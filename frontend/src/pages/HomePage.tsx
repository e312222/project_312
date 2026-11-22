import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { api } from '../api/client';

export function HomePage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const houseQ = useQuery({ queryKey: ['house'], queryFn: api.getHouse });
  const galleryQ = useQuery({ queryKey: ['gallery'], queryFn: api.getGallery });
  const newsQ = useQuery({ queryKey: ['news'], queryFn: api.getNews });

  if (houseQ.isLoading) {
    return <LoadingState>Загрузка...</LoadingState>;
  }
  if (houseQ.isError || !houseQ.data) {
    return <div className="container error">Не удалось загрузить данные о доме</div>;
  }

  const house = houseQ.data;
  const slides = (galleryQ.data ?? []).map((g) => ({ src: g.url, title: g.caption }));
  const latestNews = (newsQ.data ?? []).slice(0, 3);

  return (
    <div className="container">
      <section className="hero">
        <h1>{house.title}</h1>
        <p>{house.description}</p>
        <div className="hero__meta">
          <span>{house.address}</span>
          <span>Год постройки: {house.year_built}</span>
          <Link to="/support" className="btn">
            Поддержать дом
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Галерея</h2>
        {galleryQ.isLoading && <p className="muted">Загрузка фото...</p>}
        {galleryQ.isError && <p className="error">Не удалось загрузить галерею</p>}
        <div className="gallery">
          {(galleryQ.data ?? []).map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={item.caption}
              onClick={() => setLightboxIndex(index)}
            >
              <img src={item.url} alt={item.caption} loading="lazy" />
            </button>
          ))}
        </div>
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={slides}
        />
      </section>

      <section className="section grid-2">
        <div className="card">
          <h2>Управляющая компания</h2>
          <p>
            <strong>{house.management_company}</strong>
          </p>
          <p className="muted">
            Тел.: {house.phone}
            <br />
            Email: {house.email}
          </p>
          <ul>
            {house.management_links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h2>Новости дома</h2>
          {newsQ.isLoading && <p className="muted">Загрузка новостей...</p>}
          <div className="news-list">
            {latestNews.map((item) => (
              <article key={item.slug}>
                <Link to={`/news/${item.slug}`}>
                  <strong>{item.title}</strong>
                </Link>
                <p className="muted">{item.summary}</p>
              </article>
            ))}
          </div>
          <p style={{ marginTop: '1rem' }}>
            <Link to="/news">Все новости →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function LoadingState({ children }: { children: ReactNode }) {
  return <div className="container muted">{children}</div>;
}