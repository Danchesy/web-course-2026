import Link from 'next/link';

function formatAmount(amount) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2
  }).format(amount);
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('ru-RU');
}

export default function TransactionDetailsView({
  transaction,
  isLoading,
  error
}) {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          zen-money
        </Link>
        <Link className="back-link" href="/">
          К списку операций
        </Link>
      </header>

      {isLoading ? (
        <p className="status-message">Загружаем операцию...</p>
      ) : error ? (
        <section className="detail-card">
          <h1>Не удалось загрузить операцию</h1>
          <p className="error-message" role="alert">{error}</p>
          <Link className="back-link" href="/">Вернуться к списку</Link>
        </section>
      ) : transaction ? (
        <section className="detail-card">
          <div className="detail-heading">
            <div>
              <p className="eyebrow">
                {transaction.type === 'income' ? 'Доход' : 'Расход'}
              </p>
              <h1>{transaction.category}</h1>
            </div>
            <span
              className={`type-dot ${transaction.type}`}
              aria-hidden="true"
            />
          </div>
          <p
            className={`detail-amount ${
              transaction.type === 'income' ? 'positive' : 'negative'
            }`}
          >
            {transaction.type === 'income' ? '+' : '−'}
            {formatAmount(transaction.amount)}
          </p>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Дата</dt>
              <dd>{formatDate(transaction.date)}</dd>
            </div>
            <div className="detail-row">
              <dt>Тип операции</dt>
              <dd>{transaction.type === 'income' ? 'Доход' : 'Расход'}</dd>
            </div>
            <div className="detail-row">
              <dt>Комментарий</dt>
              <dd>{transaction.comment || 'Нет комментария'}</dd>
            </div>
            <div className="detail-row">
              <dt>Идентификатор</dt>
              <dd>{transaction.id}</dd>
            </div>
          </dl>
        </section>
      ) : (
        <p className="status-message">Операция не найдена.</p>
      )}
    </main>
  );
}
