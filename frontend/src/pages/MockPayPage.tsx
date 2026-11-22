import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function MockPayPage() {
  const [params] = useSearchParams();
  const orderId = params.get('order_id') ?? '';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusQ = useQuery({
    queryKey: ['donation', orderId],
    queryFn: () => api.getDonationStatus(orderId),
    enabled: Boolean(orderId),
  });

  async function complete(success: boolean) {
    if (!orderId) return;
    setBusy(true);
    setError(null);
    try {
      await api.mockCompletePayment(orderId, success);
      window.location.href = success ? '/support/success' : '/support/fail';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка');
      setBusy(false);
    }
  }

  if (!orderId) {
    return (
      <div className="page-wrap">
        <p className="error">Не указан order_id</p>
        <Link to="/support" className="back-link">
          Вернуться
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <section className="panel" style={{ maxWidth: 640 }}>
        <h1>Оплата</h1>
        <p className="muted">Mock шлюза Альфа-Банк · заказ {orderId}</p>
        {statusQ.data && (
          <p>
            Сумма: <strong>{statusQ.data.amount_rub} ₽</strong> · статус: {statusQ.data.status}
          </p>
        )}
        <p>Выберите исход оплаты, чтобы проверить сценарий.</p>
        <div className="actions">
          <button type="button" className="btn" disabled={busy} onClick={() => complete(true)}>
            Успешная оплата
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            disabled={busy}
            onClick={() => complete(false)}
          >
            Ошибка оплаты
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </section>
    </div>
  );
}
