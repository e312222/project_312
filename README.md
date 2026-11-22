# ТСЖ «Дом на Набережной»

Сайт товарищества собственников жилья: лендинг дома, фотогалерея, новости и приём добровольных взносов на общедомовые инициативы.

Жители и гости видят информацию о доме, контакты и ссылки управляющей компании, ленту новостей и кнопку **«Поддержать дом»**. По ней открывается форма платежа; сейчас вместо боевого шлюза Альфа-Банка работает mock-страница, на которой можно смоделировать успешную или неуспешную оплату.

Публичный прототип: [тсжнабережная.рф](https://xn--80abdkakqodr2b6a9gsa.xn--p1ai/).

## Что умеет сайт

- карточка дома: адрес, описание, год постройки;
- галерея фотографий с полноэкранным просмотром;
- ссылки и контакты управляющей компании;
- блог новостей (список и страница статьи);
- сбор пожертвований: создание заказа, mock-оплата, страницы успеха и ошибки.

## Архитектура

Два сервиса и база данных:

| Часть | Стек | Роль |
| --- | --- | --- |
| Frontend | React 18, TypeScript, Vite, React Router, TanStack Query | SPA: страницы, формы, запросы к API |
| Backend | FastAPI, SQLAlchemy, Pydantic | REST API `/tsg/api/v1` |
| БД | PostgreSQL 16 | заказы на пожертвования |
| Продакшен | Docker Compose + nginx | фронт на `127.0.0.1:3180`, API на `127.0.0.1:8310`; снаружи — nginx хоста |

В Docker nginx отдаёт собранный фронт по `/tsg/` и проксирует `/tsg/api/` на FastAPI. В разработке Vite крутится на `:5173` (сайт — `/tsg/`) и сам проксирует `/tsg/api` на `http://127.0.0.1:8000`.

### Backend

Точка входа — `backend/app/main.py`: CORS, lifespan с созданием таблиц, роутеры.

- `backend/app/api/public.py` — публичные данные: `/house`, `/gallery`, `/news`, `/news/{slug}`. Сейчас это моки из `backend/app/data/mocks.py`, не таблицы в БД.
- `backend/app/api/payments.py` — пожертвования:
  - `POST /donations/create` — создаёт заказ (`pending`) и отдаёт URL mock-шлюза;
  - `GET /donations/{order_id}` — статус заказа;
  - `POST /donations/mock/complete` — имитация callback платёжки (успех / ошибка).
- `backend/app/models.py` — модель `Donation` (сумма в копейках, комментарий, статус).
- `backend/app/schemas.py` — Pydantic-схемы запросов и ответов.
- `backend/app/config.py` — настройки из `.env` (`DATABASE_URL`, `MOCK_PAYMENT_BASE_URL`, `CORS_ORIGINS`).

### Frontend

Точка входа — `frontend/src/main.tsx`, маршруты — `frontend/src/App.tsx`.

- `frontend/src/api/client.ts` — все вызовы API.
- `frontend/src/pages/HomePage.tsx` — лендинг: дом, галерея, УК, последние новости.
- `NewsListPage` / `NewsDetailPage` — список и статья.
- `SupportPage` — форма суммы и комментария, редирект на оплату.
- `MockPayPage` — mock Альфа-Банка: «успех» или «ошибка».
- `SupportResultPage` — `/support/success` и `/support/fail`.

Поток платежа: форма → `POST /donations/create` → редирект на `/support/mock-pay?order_id=…` → mock complete → страница результата.

## Запуск

Нужны Docker Engine 20.10+ и docker-compose 1.25+ (команда `docker-compose`, формат файла 2.4). Для локальной разработки фронта — Node.js 22+.

### Продакшен-сборка (всё в Docker)

Контейнеры слушают только localhost: сайт на [http://127.0.0.1:3180/tsg/](http://127.0.0.1:3180/tsg/), API на [http://127.0.0.1:8310/tsg/api/v1](http://127.0.0.1:8310/tsg/api/v1). Публичный вход — nginx хоста, конфиг `nginx/host.conf`: `/tsg/` уходит на фронт, `/tsg/api/` на backend.

```bash
docker-compose up --build
```

Остановить:

```bash
docker-compose down
```

### Локальная разработка

1. Поднять Postgres и backend (фронт запускается отдельно):

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Так БД слушает `:5432`, API для Vite — `:8000` (дополнительно к серверному `:8310`), CORS и mock-URL настроены на Vite (`http://localhost:5173`).

2. В другом терминале — фронт:

```bash
cd frontend
cp .env.example .env   # при первом запуске
npm install
npm run dev
```

Откройте [http://localhost:5173/tsg/](http://localhost:5173/tsg/). Запросы к `/tsg/api` проксируются на backend.

Backend без Docker (опционально), если Postgres уже запущен:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Переменные окружения см. `backend/.env.example` и `frontend/.env.example`. Файлы `.env` в git не коммитятся.

## Как коммитить изменения

Рабочая ветка — `main`. Секреты (`.env`), `node_modules`, `dist`, `.venv` и кэш Python уже в `.gitignore`.

```bash
git status
git diff
```

Добавьте только свои файлы и сделайте коммит с коротким сообщением «зачем», а не списком файлов:

```bash
git add путь/к/файлу
git commit -m "Кратко: зачем это изменение"
```

Примеры сообщений: `fix: не грузится галерея на главной`, `добавить страницу новости по slug`.

Отправка на GitHub:

```bash
git pull
git push
```

Если работаете в отдельной ветке:

```bash
git checkout -b feature/краткое-имя
git push -u origin HEAD
```

Не коммитьте `.env`, пароли и ключи платёжного шлюза. Не используйте `--force` в `main`, если это не согласовано отдельно.
