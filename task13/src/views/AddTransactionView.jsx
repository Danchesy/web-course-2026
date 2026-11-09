import Link from 'next/link';
import { TransactionForm } from './TransactionsView';

export default function AddTransactionView({
  categories,
  form,
  isLoading,
  isSaving,
  error,
  onChange,
  onSubmit
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

      <section className="intro">
        <p className="eyebrow">Новая запись</p>
        <h1>Добавить операцию</h1>
      </section>

      {isLoading ? (
        <p className="status-message">Загружаем категории...</p>
      ) : (
        <TransactionForm
          categories={categories}
          form={form}
          editingId={null}
          isSaving={isSaving}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      )}
      {error && <p className="error-message" role="alert">{error}</p>}
    </main>
  );
}
