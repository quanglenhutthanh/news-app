'use client'

import { Article, Summary } from '@/models/article'
import ArticleCard from '@/components/article/article-card'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import {
  Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Skeleton
} from '@mui/material'
import { rssSources } from '@/models/rss-resources'

export default function Home() {
  const [allSummaries, setAllSummaries] = useState<
  { source: string; summary: Summary; articles: Article[]; language: string }[]
>([]);

  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const [openDialog, setOpenDialog] = useState(false)

  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [filteredSources, setFilteredSources] = useState<typeof rssSources>([]);

  const [currentArticles, setCurrentArticles] = useState<Article[]>([])
  const [currentSourceName, setCurrentSourceName] = useState<string>('')

  const loadNextSource = async () => {
    if (visibleCount >= filteredSources.length) return;
const nextSource = filteredSources[visibleCount];
    if (!nextSource.enabled) {
      setVisibleCount(prev => prev + 1)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/rss?name=${encodeURIComponent(nextSource.name)}`)
      const data = await res.json()
      setAllSummaries(prev => {
        const newSummaries: { source: string; summary: Summary; articles: Article[],language: string }[] =
          data.summaries.map((summary: Summary) => ({
            source: data.name,
            summary,
            articles: data.articles,
            selectedLanguage
          }));

        const existingIds = new Set(prev.map((item) => item.summary.id));
        const filteredNew = newSummaries.filter(
          (item: { source: string; summary: Summary; articles: Article[] }) =>
            !existingIds.has(item.summary.id)
        );

        return [...prev, ...filteredNew];
      });
    } catch (err) {
      console.error('Error loading source:', err)
    } finally {
      setVisibleCount(prev => prev + 1)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedLanguage) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadNextSource();
        }
      },
      { threshold: 1 }
    );
  
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
  
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [observerRef, visibleCount, selectedLanguage]);
  const handleSummaryClick = (sourceName: string, articles: Article[]) => {
    setCurrentSourceName(sourceName)
    setCurrentArticles(articles)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const handleLanguageSelect = (lang: string) => {
    setSelectedLanguage(lang);
    const sources = rssSources.filter(source => source.language === lang && source.enabled);
    setFilteredSources(sources);
    setAllSummaries([]); // Reset summaries when switching language
    setVisibleCount(0);  // Reset counter
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#1a237e', textAlign: 'center' }}
      >
        Tin tức hôm nay
      </Typography> */}
  <Box sx={{ mb: 4 }}>
  <Typography variant="h6">Chọn ngôn ngữ / Choose Language:</Typography>
  <Button variant={selectedLanguage === 'vi' ? 'contained' : 'outlined'} onClick={() => handleLanguageSelect('vi')}>
    Tiếng Việt
  </Button>
  <Button variant={selectedLanguage === 'en' ? 'contained' : 'outlined'} onClick={() => handleLanguageSelect('en')} sx={{ ml: 2 }}>
    English
  </Button>
</Box>
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Tóm tắt tin:
        </Typography>

        {allSummaries.length > 0 ? (
          allSummaries.map((item, index) => (
            <Box
              key={`${item.summary.id}-${index}`}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                mt: 2,
                cursor: 'pointer',
                '&:hover .summary-title': { textDecoration: 'underline' },
              }}
              // onClick={() => handleSummaryClick(item.source, item.articles)}
            >
              {item.summary.image && (
                <Box
                  component="img"
                  src={item.summary.image}
                  alt={item.source}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
              )}
              <Typography variant="body2" sx={{ color: '#333' }}>
                <strong className="summary-title"
                  onClick={() => handleSummaryClick(item.source, item.articles)}
                >{item.source}</strong> - {item.summary.summary}
              </Typography>
            </Box>
          ))
        ) : (
          !loading && (
            <Typography variant="body2" sx={{ mt: 2, color: '#888' }}>
              Không có tóm tắt.
            </Typography>
          )
        )}

        {loading && (
          <>
            {[...Array(3)].map((_, idx) => (
              <Skeleton
                key={idx}
                variant="text"
                height={30}
                animation="wave"
                sx={{ mt: 2 }}
              />
            ))}
          </>
        )}
      </Box>

      <div ref={observerRef} />

      {/* Dialog hiển thị danh sách bài viết */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          {currentSourceName}
        </DialogTitle>
        <DialogContent>
          {currentArticles.length > 0 ? (
            <Grid container spacing={3}>
              {currentArticles.map((article) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${article.id}-${Math.random()}`}>
                  <ArticleCard article={article} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ mt: 2, color: '#888' }}>
              Không có bài viết.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
