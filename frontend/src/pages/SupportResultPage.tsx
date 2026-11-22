import { Link } from 'react-router-dom';

type Props = { kind: 'success' | 'fail' };

export function SupportResultPage({ kind }: Props) {
  const success = kind === 'success';

  return (
    <div className="page-wrap">
      <section className="panel" style={{ maxWidth: 640 }}>
        <h1>{success ? 'Спасибо за поддержку' : 'Оплата не прошла'}</h1>
        <p className="lead">
          {success
            ? 'Платёж зафиксирован в mock-режиме. В production статус придёт из callback банка.'
            : 'Можно попробовать снова или выбрать другую сумму.'}
        </p>
        <div className="actions">
          <Link to="/" className="btn btn--ghost">
            На главную
          </Link>
          {!success && (
            <Link to="/support" className="btn">
              Повторить
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
