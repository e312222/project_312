import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from './api/client';
import { HomePage } from './pages/HomePage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { SupportPage } from './pages/SupportPage';
import { MockPayPage } from './pages/MockPayPage';
import { SupportResultPage } from './pages/SupportResultPage';

const sections = [
  { hash: '#about', label: 'О доме' },
  { hash: '#gallery', label: 'Галерея' },
  { hash: '#company', label: 'Управляющая' },
  { hash: '#news', label: 'Новости' },
  { hash: '#support', label: 'Поддержать' },
];

function scrollToSection(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return false;
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const houseQ = useQuery({ queryKey: ['house'], queryFn: api.getHouse });
  const phone = houseQ.data?.phone ?? '+7 (495) 000-00-00';
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  function sectionActive(hash: string) {
    if (location.pathname !== '/') return false;
    if (!location.hash) return hash === '#about';
    return location.hash === hash;
  }

  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    if (scrollToSection(location.hash)) return;

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (scrollToSection(location.hash) || attempts > 40) {
        window.clearInterval(timer);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [location.pathname, location.hash]);

  return (
    <div className="app">
      <header className="header">
        <div className="header__top">
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <span className="logo__mark">ТСЖ</span>
            <span className="logo__name">Набережная</span>
            <span className="logo__desc">дом жителей</span>
          </Link>
          <nav className="header__links">
            <NavLink to="/news" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
              Новости
            </NavLink>
            <NavLink to="/support" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
              Поддержать дом
            </NavLink>
            <Link to={{ pathname: '/', hash: '#company' }}>Контакты</Link>
          </nav>
          <div className="header__tools">
            <a className="header__phone" href={phoneHref}>
              {phone}
            </a>
            <button
              type="button"
              className="burger"
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <nav className="subnav" aria-label="Разделы">
          {sections.map((item) => (
            <Link
              key={item.hash}
              to={{ pathname: '/', hash: item.hash }}
              className={sectionActive(item.hash) ? 'is-active' : undefined}
              onClick={() => {
                if (location.pathname === '/' && location.hash === item.hash) {
                  scrollToSection(item.hash);
                }
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {menuOpen && (
          <nav className="mobile-menu">
            <Link to="/news" onClick={() => setMenuOpen(false)}>
              Новости
            </Link>
            <Link to="/support" onClick={() => setMenuOpen(false)}>
              Поддержать дом
            </Link>
            <Link to={{ pathname: '/', hash: '#company' }} onClick={() => setMenuOpen(false)}>
              Контакты
            </Link>
          </nav>
        )}
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/support/mock-pay" element={<MockPayPage />} />
          <Route path="/support/success" element={<SupportResultPage kind="success" />} />
          <Route path="/support/fail" element={<SupportResultPage kind="fail" />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer__inner">
          <div>
            <Link to="/" className="logo">
              <span className="logo__mark">ТСЖ</span>
              <span className="logo__name">Набережная</span>
              <span className="logo__desc">дом жителей</span>
            </Link>
            {houseQ.data && <p style={{ marginTop: 16 }}>{houseQ.data.address}</p>}
          </div>
          <div>
            <h3>Разделы</h3>
            <Link to={{ pathname: '/', hash: '#about' }}>О доме</Link>
            <Link to={{ pathname: '/', hash: '#gallery' }}>Галерея</Link>
            <Link to="/news">Новости</Link>
            <Link to="/support">Поддержать дом</Link>
          </div>
          <div>
            <h3>Контакты</h3>
            <a href={phoneHref}>{phone}</a>
            {houseQ.data && <a href={`mailto:${houseQ.data.email}`}>{houseQ.data.email}</a>}
            <p className="muted">Платежи: mock Альфа-Банк</p>
          </div>
        </div>
        <div className="footer__bottom">© {new Date().getFullYear()} ТСЖ «Дом на Набережной»</div>
      </footer>
    </div>
  );
}
