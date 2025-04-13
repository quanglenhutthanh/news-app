import axios from 'axios'
import { XMLParser } from 'fast-xml-parser'
import { JSDOM } from 'jsdom'
import { Article, Summary } from '@/models/article'

const GEMINI_API_URL = process.env.NEXT_PUBLIC_GEMINI_API as string;

export async function fetchArticlesFromRss(rssUrl: string, source: string): Promise<{
    articles: Article[]
    summaries: { id: string; summary: string }[]
  }> {
    // Step 1: Fetch RSS
    const response = await axios.get(rssUrl)
    const xml = response.data
  
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseTagValue: true,
      parseAttributeValue: true,
    })
  
    const json = parser.parse(xml)
    const items = json.rss.channel.item
  
    const articles: Article[] = []
    const summaries: Summary[] = []
  
    for (let i = 0; i < 10; i++) {
      const item = items[i]
      const imageMatch = item.description.match(/<img.*?src="(.*?)"/)
      const image = imageMatch ? imageMatch[1] : item.enclosure?.url
  
      const id = item.guid || item.link
      const article: Article = {
        id,
        title: item.title,
        summary: item.description.replace(/<[^>]+>/g, '').trim(),
        image,
        pubDate: item.pubDate,
        link: item.link,
        source,
      }
  
      articles.push(article)
  
      // Step 2: Tóm tắt 2 bài đầu tiên
      if (i < 5) {
        const html = await axios.get(item.link).then(res => res.data).catch(() => '')
        const dom = new JSDOM(html)
        const text = dom.window.document.body.textContent?.trim().slice(0, 8000) || ''
  
        const fullSummary = await getGeminiSummary(text)
        //const shortSummary = fullSummary.slice(0, 300)
  
        summaries.push({ id, summary: fullSummary })
      }
    }
  
    return { articles, summaries }
  }

// Function to summarize using Gemini API
async function getGeminiSummary(content: string): Promise<string> {
  const prompt = `Tóm tắt nội dung sau bằng tiếng Việt với 300 kí tự:\n\n${content}`

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    })

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    return result || 'Không thể tóm tắt nội dung.'
  } catch (error) {
    console.error('Gemini API error:', error)
    return 'Lỗi khi gọi Gemini API.'
  }
}
