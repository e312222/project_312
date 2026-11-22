import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';

export function NewsDetailPage() {
  const { slug = '' } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['news', slug],
    queryFn: () => api.getNewsArticle(slug),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="container">
        <p className="muted">Загрузка...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container">
        <p className="error">Новость не найдена</p>
        <Link to="/news">← К списку</Link>
      </div>
    );
  }

  return (
    <article className="container section">
      <p>
        <Link to="/news">← Новости</Link>
      </p>
      <h1>{data.title}</h1>
      <p className="muted">{data.summary}</p>
      {data.cover_url && (
        <img
          src={data.cover_url}
          alt=""
          style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 12 }}
        />
      )}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: data.body_html }}
      />
    </article>
  );
}