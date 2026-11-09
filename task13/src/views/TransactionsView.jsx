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

function SummaryCards({ summary }) {
  return (
    <section className="summary-grid" aria-label="Сводка по операциям">
      <article className="summary-card">
        <span>Доходы</span>
        <strong className="positive">{formatAmount(summary.income)}</strong>
      </article>
      <article className="summary-card">
        <span>Расходы</span>
        <strong className="negative">{formatAmount(summary.expense)}</strong>
      </article>
      <article className="summary-card">
        <span>Баланс</span>
        <strong className={summary.balance < 0 ? 'negative' : 'positive'}>
          {formatAmount(summary.balance)}
        </strong>
      </article>
    </section>
  );
}

function TransactionForm({
  categories,
  form,
  editingId,
  isSaving,
  onChange,
  onSubmit,
  onCancelEdit
}) {
  const matchingCategories = categories.filter(
    (category) => category.type === form.type
  );

  return (
    <section className="panel" aria-labelledby="form-heading">
      <div className="panel-heading">
        <h2 id="form-heading">
          {editingId === null ? 'Новая операция' : 'Изменить операцию'}
        </h2>
      </div>
      <form className="transaction-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Сумма</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={form.amount}
            onChange={(event) => onChange('amount', event.target.value)}
            placeholder="0"
            required
          />
        </label>
        <label className="field">
          <span>Тип</span>
          <select
            value={form.type}
            onChange={(event) => onChange('type', event.target.value)}
          >
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
        </label>
        <label className="field">
          <span>Категория</span>
          <select
            value={form.category}
            onChange={(event) => onChange('category', event.target.value)}
            required
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {matchingCategories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Дата</span>
          <input
            type="date"
            value={form.date}
            onChange={(event) => onChange('date', event.target.value)}
            required
          />
        </label>
        <label className="field field-wide">
          <span>Комментарий</span>
          <input
            type="text"
            value={form.comment}
            onChange={(event) => onChange('comment', event.target.value)}
            placeholder="Необязательно"
            maxLength="160"
          />
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving
              ? 'Сохранение...'
              : editingId === null
                ? 'Добавить операцию'
                : 'Сохранить изменения'}
          </button>
          {editingId !== null && (
            <button
              className="secondary-button"
              type="button"
              onClick={onCancelEdit}
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function TransactionList({ transactions, deletingId, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return <p className="empty-state">Операций по выбранным условиям нет.</p>;
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <article className="transaction-card" key={transaction.id}>
          <div className="transaction-topline">
            <Link
              className="transaction-title"
              href={`/transactions/${encodeURIComponent(transaction.id)}`}
            >
              <span
                className={`type-dot ${transaction.type}`}
                aria-hidden="true"
              />
              {transaction.category}
            </Link>
            <span
              className={`transaction-amount ${
                transaction.type === 'income' ? 'positive' : 'negative'
              }`}
            >
              {transaction.type === 'income' ? '+' : '−'}
              {formatAmount(transaction.amount)}
            </span>
          </div>
          <div className="transaction-bottomline">
            <span>
              {formatDate(transaction.date)}
              {transaction.comment ? ` · ${transaction.comment}` : ''}
            </span>
            <div className="transaction-actions">
              <button
                className="secondary-button"
                type="button"
                onClick={() => onEdit(transaction)}
              >
                Изменить
              </button>
              <button
                className="delete-button"
                type="button"
                disabled={String(deletingId) === String(transaction.id)}
                onClick={() => onDelete(transaction.id)}
              >
                {String(deletingId) === String(transaction.id)
                  ? 'Удаление...'
                  : 'Удалить'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function TransactionsView({
  transactions,
  categories,
  filters,
  form,
  editingId,
  summary,
  isLoading,
  isSaving,
  deletingId,
  error,
  onFormChange,
  onFilterChange,
  onSubmit,
  onEdit,
  onCancelEdit,
  onDelete
}) {
  return (
    <main className="page-shell">
      <header className="topbar">
        <Link className="brand" href="/">
          zen-money
        </Link>
        <span className="nav-link">Личные финансы</span>
      </header>

      <section className="intro">
        <p className="eyebrow">Простое управление бюджетом</p>
        <h1>Ваши финансы</h1>
        <p>Доходы, расходы и история операций в одном месте.</p>
      </section>

      {isLoading ? (
        <p className="status-message">Загружаем операции...</p>
      ) : (
        <>
          <SummaryCards summary={summary} />
          <TransactionForm
            categories={categories}
            form={form}
            editingId={editingId}
            isSaving={isSaving}
            onChange={onFormChange}
            onSubmit={onSubmit}
            onCancelEdit={onCancelEdit}
          />

          <section aria-labelledby="transactions-heading">
            <div className="panel-heading list-heading">
              <h2 id="transactions-heading">История операций</h2>
              <span className="nav-link">{transactions.length} операций</span>
            </div>
            <div className="filters" aria-label="Фильтры операций">
              <label className="field">
                <span>Тип</span>
                <select
                  value={filters.type}
                  onChange={(event) => onFilterChange('type', event.target.value)}
                >
                  <option value="all">Все операции</option>
                  <option value="income">Доходы</option>
                  <option value="expense">Расходы</option>
                </select>
              </label>
              <label className="field">
                <span>Категория</span>
                <select
                  value={filters.category}
                  onChange={(event) =>
                    onFilterChange('category', event.target.value)
                  }
                >
                  <option value="">Все категории</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>С даты</span>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(event) =>
                    onFilterChange('dateFrom', event.target.value)
                  }
                />
              </label>
              <label className="field">
                <span>По дату</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(event) =>
                    onFilterChange('dateTo', event.target.value)
                  }
                />
              </label>
            </div>
            {error && <p className="error-message" role="alert">{error}</p>}
            {isLoading ? (
              <p className="status-message">Загружаем операции...</p>
            ) : (
              <TransactionList
                transactions={transactions}
                deletingId={deletingId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            )}
          </section>
        </>
      )}
    </main>
  );
}
