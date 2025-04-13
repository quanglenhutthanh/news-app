import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req: Request) {
  const { url } = await req.json();

  try {
    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);
    const rssLinks: string[] = [];

    $('link[type="application/rss+xml"]').each((_, element) => {
      const rssUrl = $(element).attr('href');
      if (rssUrl) {
        rssLinks.push(rssUrl.startsWith('http') ? rssUrl : new URL(rssUrl, url).href);
      }
    });

    return NextResponse.json({ feeds: rssLinks });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to discover RSS' }, { status: 500 });
  }
}
