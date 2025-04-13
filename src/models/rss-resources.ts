export interface RssSource {
  name: string
  url: string
  category?: string
  language: string,
  enabled?: boolean
}

export const rssSources: RssSource[] = [

  {
    name: 'VnExpress - Tin mới nhất',
    url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
    language: 'vi',
    category: 'New',
    enabled: true
  },
  {
    name: 'VnExpress - Nổi bật',
    url: 'https://vnexpress.net/rss/tin-noi-bat.rss',
    language: 'vi',
    category: 'Top',
    enabled: true
  },
  {
    name: 'VnEconomy - Tin mới',
    url: 'https://vneconomy.vn/tin-moi.rss',
    language: 'vi',
    category: 'New',
    enabled: true
  },

  {
    name: 'VnEconomy - Chứng khoán',
    url: 'https://vneconomy.vn/chung-khoan.rss',
    language: 'vi',
    category: 'Stock',
    enabled: true
  },
  {
    name: 'VnExpress - Thể thao',
    url: 'https://vnexpress.net/rss/the-thao.rss',
    language: 'vi',
    category: 'Sport',
    enabled: true
  },


  

  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    language: 'en',
    category: 'Tech',
    enabled: true,
  },
  {
    name: 'CNBC',
    url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114',
    language: 'en',
    category: 'Top',
    enabled: true,
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    language: 'en',
    category: 'Tech',
    enabled: true,
  },
  {
    name: 'ABC News',
    url: 'https://abcnews.go.com/abcnews/internationalheadlines',
    language: 'en',
    category: 'Top',
    enabled: true,
  },
  {
    name: 'Aljazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    language: 'en',
    category: 'Top',
    enabled: true,
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    language: 'en',
    category: 'Tech',
    enabled: true,
  },
]
