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
    <div className="page-wrap">
      <section className="panel panel--flat">
        <h1 className="page-title">Новости</h1>
        {isLoading && <p className="muted">Загрузка...</p>}
        {isError && <p className="error">Не удалось загрузить новости</p>}
        <div className="news-list">
          {(data ?? []).map((item) => (
            <Link key={item.slug} to={`/news/${item.slug}`} className="news-row">
              {item.cover_url ? (
                <img className="news-row__cover" src={item.cover_url} alt="" />
              ) : (
                <div className="news-row__cover" />
              )}
              <div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </div>
              <time dateTime={item.published_at}>{formatDate(item.published_at)}</time>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
