export interface RssFeed {
  title: string
  href: string
}

export async function discoverRssFeeds(websiteUrl: string): Promise<RssFeed[]> {
  try {
    const res = await fetch('/api/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl }),
      });
    
      const data = await res.json();
      console.log(data);
      if (data.error) {
        throw new Error(data.error);
      }
    
      return data.data; 
  } catch (err) {
    console.error('Failed to discover RSS feeds:', err)
    return []
  }
}
