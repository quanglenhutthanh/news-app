'use client'

import { Article, Summary } from '@/models/article'
import ArticleCard from '@/components/article/article-card'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'


interface RssResource {
  name: string;
  articles: Article[];
  summaries: Summary[];
}
export default function Home() {
  const [resources, setResources] = useState<RssResource[]>([]); // Mảng chứa các nguồn với articles và summaries
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở/đóng dialog
  const [currentArticles, setCurrentArticles] = useState<Article[]>([]); // Danh sách bài viết của nguồn hiện tại
  const [currentSourceName, setCurrentSourceName] = useState<string>(''); // Tên nguồn đang mở

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetch('/api/rss');
        const data = await res.json();
        setResources(data); // Set dữ liệu các nguồn RSS
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải tin tức:', error);
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  const handleSummaryClick = (sourceName: string, articles: Article[]) => {
    // Khi click vào tóm tắt, mở dialog và hiển thị các bài viết của nguồn đó
    setCurrentSourceName(sourceName);
    setCurrentArticles(articles);
    setOpenDialog(true); // Mở dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Đóng dialog
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tin tức hôm nay
      </Typography>

      {/* Hiển thị các nguồn RSS với tóm tắt và bài viết */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        resources.map((resource) => (
          <Box key={resource.name} sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom>
              {resource.name}
            </Typography>

            {/* Hiển thị tóm tắt của nguồn */}
            <Box sx={{ mb: 4, p: 2, backgroundColor: '#f4f6f8', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Tóm tắt:
              </Typography>
              {resource.summaries.length > 0 ? (
                <Box>
                  {resource.summaries.map((summary: { id: string; summary: string }) => (
                    <Typography
                      key={`${summary.id}-${Math.random()}`}
                      variant="body2"
                      sx={{ mt: 2, color: '#333', cursor: 'pointer' }}
                      onClick={() => handleSummaryClick(resource.name, resource.articles)} // Khi click vào tóm tắt sẽ mở dialog
                    >
                      {summary.summary}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ mt: 2, color: '#888' }}>
                  Không có tóm tắt.
                </Typography>
              )}
            </Box>
          </Box>
        ))
      )}

      {/* Dialog hiển thị danh sách bài viết */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{currentSourceName}</DialogTitle>
        <DialogContent>
          {/* Hiển thị các bài viết trong dialog */}
          {currentArticles.length > 0 ? (
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {currentArticles.map((article) => (
                <Grid key={article.id} size={{ xs: 4, sm: 4, md: 4 }}>
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
          <Button onClick={handleCloseDialog} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
