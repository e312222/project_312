from datetime import datetime, timezone

from app.schemas import GalleryItem, HouseInfo, ManagementCompanyLink, NewsArticle, NewsPreview

HOUSE = HouseInfo(
    title='Доходный дом Первого Российского Страхового Общества 1913-1914',
    address='г. Москва, ул. Набережная, д. 12',
    description=(
        'Жилой дом 2018 года постройки: 9 этажей, подземный паркинг, '
        'двор без машин и собственная котельная. Сайт — для жителей и гостей: '
        'новости, фото и возможность поддержать общие инициативы двора.'
    ),
    year_built=2018,
    management_company='ООО «УК Комфорт»',
    management_links=[
        ManagementCompanyLink(title='Личный кабинет жильца', url='https://example.com/lk'),
        ManagementCompanyLink(title='Заявка в управляющую компанию', url='https://example.com/request'),
        ManagementCompanyLink(title='Тарифы и нормативы', url='https://example.com/tariffs'),
    ],
    phone='+7 (495) 000-00-00',
    email='info@tsg-naberezhnaya.example',
)

GALLERY: list[GalleryItem] = [
    GalleryItem(
        id=1,
        url='https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        caption='Подъезд и входная группа',
        sort_order=1,
    ),
    GalleryItem(
        id=2,
        url='https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
        caption='Двор и детская площадка',
        sort_order=2,
    ),
    GalleryItem(
        id=3,
        url='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        caption='Вид на дом с набережной',
        sort_order=3,
    ),
    GalleryItem(
        id=4,
        url='https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
        caption='Клубная зона на первом этаже',
        sort_order=4,
    ),
]

NEWS: list[NewsArticle] = [
    NewsArticle(
        slug='osveshchenie-dvora',
        title='Обновили освещение во дворе',
        summary='Установили LED-фонари по периметру и на детской площадке.',
        published_at=datetime(2025, 10, 28, 10, 0, tzinfo=timezone.utc),
        cover_url='https://images.unsplash.com/photo-1513828583688-c52646db9bca?w=800&q=80',
        body_html=(
            '<p>В октябре завершили замену уличного освещения. Новые светильники '
            'экономичнее и дают более ровный свет на дорожках и площадке.</p>'
            '<p>Спасибо жителям, кто участвовал в обсуждении проекта на общем собрании.</p>'
        ),
    ),
    NewsArticle(
        slug='subbotnik-osen',
        title='Осенний субботник: итоги',
        summary='Собрали 40 мешков листвы и обновили клумбы у входа.',
        published_at=datetime(2025, 10, 12, 9, 0, tzinfo=timezone.utc),
        cover_url='https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
        body_html=(
            '<p>12 октября прошёл традиционный субботник. Работали группы по дворам '
            'и клумбам, привезли новую мульчу для кустарников.</p>'
        ),
    ),
    NewsArticle(
        slug='lift-modernization',
        title='Модернизация лифтов: этап 1',
        summary='В первом подъезде обновили кабину и систему диспетчеризации.',
        published_at=datetime(2025, 9, 5, 14, 30, tzinfo=timezone.utc),
        cover_url=None,
        body_html=(
            '<p>Подрядчик завершил первый этап: замена кнопочной панели, '
            'ремонт кабины и настройка удалённого мониторинга.</p>'
            '<p>Следующий подъезд — по графику в ноябре.</p>'
        ),
    ),
]


def list_news_previews() -> list[NewsPreview]:
    return [
        NewsPreview(
            slug=n.slug,
            title=n.title,
            summary=n.summary,
            published_at=n.published_at,
            cover_url=n.cover_url,
        )
        for n in NEWS
    ]


def get_news_by_slug(slug: str) -> NewsArticle | None:
    for item in NEWS:
        if item.slug == slug:
            return item
    return None