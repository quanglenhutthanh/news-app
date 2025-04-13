'use client'

import { Article, Summary } from '@/models/article'
import ArticleCard from '@/components/article/article-card'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import {
  Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button
} from '@mui/material'
import { rssSources } from '@/models/rss-resources'

interface RssResource {
  name: string;
  articles: Article[];
  summaries: Summary[];
}

export default function Home() {
  const [resources, setResources] = useState<RssResource[]>([])
  const [loading, setLoading] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const [openDialog, setOpenDialog] = useState(false)
  const [currentArticles, setCurrentArticles] = useState<Article[]>([])
  const [currentSourceName, setCurrentSourceName] = useState<string>('')

  const loadNextSource = async () => {
    if (visibleCount >= rssSources.length) return

    const nextSource = rssSources[visibleCount]
    if (!nextSource.enabled) {
      setVisibleCount(prev => prev + 1)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/rss?name=${encodeURIComponent(nextSource.name)}`)
      const data = await res.json()
      setResources(prev => [...prev, data])
    } catch (err) {
      console.error('Error loading source:', err)
    } finally {
      setVisibleCount(prev => prev + 1)
      setLoading(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          loadNextSource()
        }
      },
      { threshold: 1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [observerRef, visibleCount])

  const handleSummaryClick = (sourceName: string, articles: Article[]) => {
    setCurrentSourceName(sourceName)
    setCurrentArticles(articles)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#1a237e', textAlign: 'center' }}
      >
        Tin tức hôm nay
      </Typography>

      {resources.map((resource) => (
        <Box
          key={resource.name}
          sx={{
            mb: 6,
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            background: '#ffffff',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#0d47a1' }}>
            {resource.name}
          </Typography>

          <Box
            sx={{
              mb: 4,
              mt: 2,
              p: 3,
              borderRadius: 2,
              background: '#e3f2fd',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: '#1565c0', mb: 2 }}
            >
              Tóm tắt:
            </Typography>

            {resource.summaries.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {resource.summaries.map((summary) => (
                  <Typography
                    key={`${summary.id}-${Math.random()}`}
                    variant="body1"
                    sx={{
                      color: '#0d47a1',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                    onClick={() => handleSummaryClick(resource.name, resource.articles)}
                  >
                    • {summary.summary}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: '#607d8b' }}>
                Không có tóm tắt.
              </Typography>
            )}
          </Box>
        </Box>
      ))}

      <div ref={observerRef} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress color="primary" />
        </Box>
      )}

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
                <Grid  size={{ xs:12, sm:6, md:4}} key={`${article.id} - ${Math.random()}`}>
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
