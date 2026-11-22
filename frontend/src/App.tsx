import { Link, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { SupportPage } from './pages/SupportPage';
import { MockPayPage } from './pages/MockPayPage';
import { SupportResultPage } from './pages/SupportResultPage';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <Link to="/" className="logo">
            ТСЖ Набережная
          </Link>
          <nav className="nav">
            <Link to="/news">Новости</Link>
            <Link to="/support" className="btn btn--small">
              Поддержать дом
            </Link>
          </nav>
        </div>
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
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} ТСЖ</span>
          <span className="footer__hint">Платежи: mock Альфа-Банк</span>
        </div>
      </footer>
    </div>
  );
}