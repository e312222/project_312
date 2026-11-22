import { FormEvent, useState } from 'react';
import { api } from '../api/client';

export function SupportPage() {
  const [amount, setAmount] = useState(500);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await api.createDonation(amount, comment || undefined);
      window.location.href = result.payment_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания платежа');
      setLoading(false);
    }
  }

  return (
    <div className="container section">
      <h1>Поддержать дом</h1>
      <p className="muted">
        Средства идут на общедомовые инициативы (двор, освещение, мелкий ремонт).
        Сейчас подключён <strong>mock</strong> платёжного шлюза Альфа-Банка.
      </p>
      <form className="form card" onSubmit={onSubmit}>
        <label>
          Сумма, ₽
          <input
            type="number"
            min={10}
            max={500000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
        </label>
        <label>
          Комментарий (необязательно)
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Перенаправление…' : 'Перейти к оплате'}
        </button>
      </form>
    </div>
  );
}