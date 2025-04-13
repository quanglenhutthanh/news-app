import { NextResponse } from 'next/server'
import { fetchArticlesFromRss } from '@/actions/fetchRss'
import { rssSources } from '@/models/rss-resources'

// export async function GET() {
//   const rssResponses = await Promise.all(
//     rssSources
//       .filter(source => source.enabled) // Lọc ra các nguồn được bật
//       .map(async (source) => {
//         const { articles, summaries } = await fetchArticlesFromRss(source.url, source.name)
//         return {
//           name: source.name,
//           articles,
//           summaries,
//         }
//       })
//   )

//   // Trả về kết quả dưới dạng JSON, mỗi nguồn RSS có bài viết và tóm tắt riêng
//   return NextResponse.json(rssResponses)
// }


export async function GET(req: Request) {
  const url = new URL(req.url)
  const name = url.searchParams.get('name')

  if (!name) {
    return NextResponse.json({ error: 'Missing source name' }, { status: 400 })
  }

  const source = rssSources.find(src => src.name === name && src.enabled)
  if (!source) {
    return NextResponse.json({ error: 'Source not found or disabled' }, { status: 404 })
  }

  try {
    const { articles, summaries } = await fetchArticlesFromRss(source.url, source.name)
    return NextResponse.json({
      name: source.name,
      articles,
      summaries,
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch RSS data' }, { status: 500 })
  }
}
