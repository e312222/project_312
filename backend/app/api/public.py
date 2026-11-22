from fastapi import APIRouter, HTTPException

from app.data import mocks
from app.schemas import GalleryItem, HouseInfo, NewsArticle, NewsPreview

router = APIRouter()


@router.get("/house", response_model=HouseInfo)
def get_house() -> HouseInfo:
    return mocks.HOUSE


@router.get("/gallery", response_model=list[GalleryItem])
def get_gallery() -> list[GalleryItem]:
    return sorted(mocks.GALLERY, key=lambda g: g.sort_order)


@router.get("/news", response_model=list[NewsPreview])
def get_news() -> list[NewsPreview]:
    previews = mocks.list_news_previews()
    return sorted(previews, key=lambda n: n.published_at, reverse=True)


@router.get("/news/{slug}", response_model=NewsArticle)
def get_news_article(slug: str) -> NewsArticle:
    article = mocks.get_news_by_slug(slug)
    if article is None:
        raise HTTPException(status_code=404, detail="Новость не найдена")
    return article