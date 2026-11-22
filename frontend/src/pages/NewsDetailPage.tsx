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
      <div className="page-wrap">
        <p className="muted">Загрузка...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="page-wrap">
        <p className="error">Новость не найдена</p>
        <Link to="/news" className="back-link">
          ← К списку
        </Link>
      </div>
    );
  }

  return (
    <article className="page-wrap">
      <section className="panel">
        <Link to="/news" className="back-link">
          ← Новости
        </Link>
        <h1>{data.title}</h1>
        <p className="muted">{data.summary}</p>
        {data.cover_url && <img className="article-cover" src={data.cover_url} alt="" />}
        <div className="article-body" dangerouslySetInnerHTML={{ __html: data.body_html }} />
      </section>
    </article>
  );
}
