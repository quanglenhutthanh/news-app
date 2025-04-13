export interface RssSource {
    name: string
    url: string
    category?: string
    enabled?: boolean
  }
  
  export const rssSources: RssSource[] = [
    {
        name: 'TechCrunch',
        url: 'https://techcrunch.com/feed/',
        category: 'Tech',
        enabled: true,
    },
    {
        name: 'Dân trí - Trang chủ',
        url: 'https://dantri.com.vn/rss/home.rss',
        category: 'general',
        enabled: true
    },
    {
      name: 'VnExpress - Tin mới nhất',
      url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
      category: 'general',
      enabled: true
    },
    {
      name: 'VnExpress - Nổi bật',
      url: 'https://vnexpress.net/rss/tin-noi-bat.rss',
      category: 'top',
      enabled: true
    },
    {
      name: 'Tuổi Trẻ - Mới nhất',
      url: 'https://tuoitre.vn/rss/tin-moi-nhat.rss',
      category: 'general',
      enabled: true
    }
  ]
  