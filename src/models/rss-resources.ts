export interface RssSource {
    name: string
    url: string
    category?: string
    enabled?: boolean
  }
  
  export const rssSources: RssSource[] = [
    
    {
      name: 'VnExpress - Tin mới nhất',
      url: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
      category: 'New',
      enabled: true
    },
    {
      name: 'VnExpress - Nổi bật',
      url: 'https://vnexpress.net/rss/tin-noi-bat.rss',
      category: 'Top',
      enabled: true
    },
    {
      name: 'VnExpress - Thể thao',
      url: 'https://vnexpress.net/rss/the-thao.rss',
      category: 'Sport',
      enabled: true
    },
    
    {
      name: 'VnEconomy - Tin mới',
      url: 'https://vneconomy.vn/tin-moi.rss',
      category: 'New',
      enabled: true
    },
    {
      name: 'Bongda24h',
      url: 'https://bongda24h.vn/RSS/1.rss',
      category: 'Sport',
      enabled: true
    },
    {
      name: 'TechCrunch',
      url: 'https://techcrunch.com/feed/',
      category: 'Tech',
      enabled: true,
  },
  {
      name: 'Dân trí - Trang chủ',
      url: 'https://dantri.com.vn/rss/home.rss',
      category: 'New',
      enabled: true
  },
  {
    name: 'VnEconomy - Chứng khoán',
      url: 'https://vneconomy.vn/chung-khoan.rss',
      category: 'Stock',
      enabled: true
  }
    
  ]
  