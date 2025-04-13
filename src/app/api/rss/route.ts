import { NextResponse } from 'next/server'
import { fetchArticlesFromRss } from '@/actions/fetchRss'
import { rssSources } from '@/models/rss-resources'

export async function GET() {
  const rssResponses = await Promise.all(
    rssSources
      .filter(source => source.enabled) // Lọc ra các nguồn được bật
      .map(async (source) => {
        const { articles, summaries } = await fetchArticlesFromRss(source.url, source.name)
        return {
          name: source.name,
          articles,
          summaries,
        }
      })
  )

  // Trả về kết quả dưới dạng JSON, mỗi nguồn RSS có bài viết và tóm tắt riêng
  return NextResponse.json(rssResponses)
}