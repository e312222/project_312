import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { api } from '../api/client';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function HomePage() {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const houseQ = useQuery({ queryKey: ['house'], queryFn: api.getHouse });
  const galleryQ = useQuery({ queryKey: ['gallery'], queryFn: api.getGallery });
  const newsQ = useQuery({ queryKey: ['news'], queryFn: api.getNews });

  if (houseQ.isLoading) {
    return <LoadingState>Загрузка...</LoadingState>;
  }
  if (houseQ.isError || !houseQ.data) {
    return <div className="page-wrap error">Не удалось загрузить данные о доме</div>;
  }

  const house = houseQ.data;
  const gallery = galleryQ.data ?? [];
  const slides = gallery.map((g) => ({ src: g.url, title: g.caption }));
  const latestNews = (newsQ.data ?? []).slice(0, 3);
  const hero = gallery[0];

  return (
    <>
      <section className="hero">
        {hero && <img src={hero.url} alt={hero.caption} />}
        <div className="hero__shade" />
        <div className="hero__caption">
          <span className="hero__eyebrow">{house.address}</span>
          <h1>{house.title}</h1>
        </div>
      </section>

      <div className="page">
        <section className="panel" id="about">
          <h2>О доме</h2>
          <p className="lead">{house.description}</p>
          <div className="stats">
            <div>
              <strong>{house.year_built}</strong>
              <span>Год постройки</span>
            </div>
            <div>
              <strong className="stats__name">{house.management_company}</strong>
              <span>Управляющая компания</span>
            </div>
          </div>
        </section>

        <section className="panel panel--flat" id="gallery">
          <h2>Галерея</h2>
          {galleryQ.isLoading && <p className="muted">Загрузка фото...</p>}
          {galleryQ.isError && <p className="error">Не удалось загрузить галерею</p>}
          <div className="gallery">
            {gallery.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.caption}
                onClick={() => setLightboxIndex(index)}
              >
                <img src={item.url} alt={item.caption} loading="lazy" />
                <span className="gallery__caption">{item.caption}</span>
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

        <section className="panel" id="company">
          <h2>Управляющая компания</h2>
          <p className="lead">{house.management_company}</p>
          <p className="muted">
            {house.phone}
            <br />
            {house.email}
          </p>
          <ul className="links">
            {house.management_links.map((link) => (
              <li key={link.url}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel panel--flat" id="news">
          <h2>Новости</h2>
          {newsQ.isLoading && <p className="muted">Загрузка новостей...</p>}
          <div className="news-list">
            {latestNews.map((item) => (
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
          <p className="section-action">
            <Link to="/news" className="btn btn--ghost">
              Все новости
            </Link>
          </p>
        </section>

        <section className="panel panel--dark" id="support">
          <h2>Поддержать дом</h2>
          <p className="lead">
            Средства идут на общедомовые инициативы: двор, освещение и мелкий ремонт.
          </p>
          <p className="section-action">
            <Link to="/support" className="btn btn--light">
              Перейти к оплате
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}

function LoadingState({ children }: { children: ReactNode }) {
  return <div className="page-wrap muted">{children}</div>;
}
