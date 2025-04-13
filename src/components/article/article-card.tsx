import { Button, Card, CardActions, CardContent, CardMedia, Link, Typography } from "@mui/material";
import { Article } from "@/models/article";

interface Props {
    article: Article;
}

export default function ArticleCard({ article }: Props) {
    return (
        <Card>
            {article.image && (
                <CardMedia
                    component="img"
                    height="180"
                    image={article.image}
                    alt={article.title}
                />
            )}
            <CardContent>
                <Typography variant="h6">{article.title}</Typography>
                <Typography>
                    {article.summary}
                </Typography>
            </CardContent>
            <CardActions>
                <Link href={article.link} target="_blank">
                    <Button size="small">Đọc tiếp</Button>
                </Link>
            </CardActions>
        </Card>
    );
} 