import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NewsListPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['news'],
    queryFn: api.getNews,
  });

  return (
    <div className="container section">
      <h1>Новости</h1>
      {isLoading && <p className="muted">Загрузка...</p>}
      {isError && <p className="error">Не удалось загрузить новости</p>}
      <div className="news-list">
        {(data ?? []).map((item) => (
          <article key={item.slug} className="card news-card">
            {item.cover_url ? (
              <img className="news-card__cover" src={item.cover_url} alt="" />
            ) : (
              <div className="news-card__cover" />
            )}
            <div>
              <p className="muted">{formatDate(item.published_at)}</p>
              <h3>
                <Link to={`/news/${item.slug}`}>{item.title}</Link>
              </h3>
              <p>{item.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}