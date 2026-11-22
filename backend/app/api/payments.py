import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Donation, DonationStatus
from app.schemas import (
    DonationCreate,
    DonationCreateResponse,
    DonationStatusResponse,
    MockPaymentComplete,
)

router = APIRouter(prefix="/donations", tags=["donations"])


@router.post("/create", response_model=DonationCreateResponse)
def create_donation(
    payload: DonationCreate,
    db: Session = Depends(get_db),
) -> DonationCreateResponse:
    order_id = uuid.uuid4().hex[:16]
    amount_kopecks = payload.amount_rub * 100

    donation = Donation(
        order_id=order_id,
        amount_kopecks=amount_kopecks,
        comment=payload.comment,
        status=DonationStatus.pending,
    )
    db.add(donation)
    db.commit()

    base = settings.mock_payment_base_url.rstrip("/")
    payment_url = f"{base}?order_id={order_id}"

    return DonationCreateResponse(
        order_id=order_id,
        payment_url=payment_url,
        amount_rub=payload.amount_rub,
    )


@router.get("/{order_id}", response_model=DonationStatusResponse)
def get_donation_status(
    order_id: str,
    db: Session = Depends(get_db),
) -> DonationStatusResponse:
    donation = db.query(Donation).filter(Donation.order_id == order_id).first()
    if donation is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")
    return DonationStatusResponse(
        order_id=donation.order_id,
        status=donation.status.value,
        amount_rub=donation.amount_kopecks // 100,
    )


@router.post("/mock/complete", response_model=DonationStatusResponse)
def mock_complete_payment(
    payload: MockPaymentComplete,
    db: Session = Depends(get_db),
) -> DonationStatusResponse:
    """Имитация callback от платёжного шлюза Альфа-Банка."""
    donation = db.query(Donation).filter(Donation.order_id == payload.order_id).first()
    if donation is None:
        raise HTTPException(status_code=404, detail="Заказ не найден")

    donation.status = DonationStatus.paid if payload.success else DonationStatus.failed
    db.commit()
    db.refresh(donation)

    return DonationStatusResponse(
        order_id=donation.order_id,
        status=donation.status.value,
        amount_rub=donation.amount_kopecks // 100,
    )