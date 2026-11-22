from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ManagementCompanyLink(BaseModel):
    title: str
    url: str


class HouseInfo(BaseModel):
    title: str
    address: str
    description: str
    year_built: int
    management_company: str
    management_links: list[ManagementCompanyLink]
    phone: str
    email: str


class GalleryItem(BaseModel):
    id: int
    url: str
    caption: str
    sort_order: int


class NewsPreview(BaseModel):
    slug: str
    title: str
    summary: str
    published_at: datetime
    cover_url: str | None = None


class NewsArticle(NewsPreview):
    body_html: str


class DonationCreate(BaseModel):
    amount_rub: int = Field(ge=10, le=500_000)
    comment: str | None = Field(default=None, max_length=500)


class DonationCreateResponse(BaseModel):
    order_id: str
    payment_url: str
    amount_rub: int


class DonationStatusResponse(BaseModel):
    order_id: str
    status: Literal["pending", "paid", "failed"]
    amount_rub: int


class MockPaymentComplete(BaseModel):
    order_id: str
    success: bool = True