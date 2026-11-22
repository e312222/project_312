import { Link } from 'react-router-dom';

type Props = { kind: 'success' | 'fail' };

export function SupportResultPage({ kind }: Props) {
  const success = kind === 'success';

  return (
    <div className="container section card" style={{ maxWidth: 520 }}>
      <h1>{success ? 'Спасибо за поддержку!' : 'Оплата не прошла'}</h1>
      <p className="muted">
        {success
          ? 'Платёж зафиксирован (mock). В production статус придёт из callback банка.'
          : 'Можно попробовать снова или выбрать другую сумму.'}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn--ghost">
          На главную
        </Link>
        {!success && (
          <Link to="/support" className="btn">
            Повторить
          </Link>
        )}
      </div>
    </div>
  );
}