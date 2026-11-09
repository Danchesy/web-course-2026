'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  calculateSummary,
  createTransaction,
  deleteTransaction,
  filterTransactions,
  getCategories,
  getTransactions,
  updateTransaction,
  validateTransaction
} from '../models/transaction';
import TransactionsView from '../views/TransactionsView';

function createEmptyForm() {
  return {
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    comment: ''
  };
}

export default function TransactionsController() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    category: '',
    dateFrom: '',
    dateTo: ''
  });
  const [form, setForm] = useState(createEmptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadData() {
      try {
        const [loadedTransactions, loadedCategories] = await Promise.all([
          getTransactions(),
          getCategories()
        ]);
        if (isCurrent) {
          setTransactions(loadedTransactions);
          setCategories(loadedCategories);
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message);
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadData();
    return () => {
      isCurrent = false;
    };
  }, []);

  const visibleTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );
  const summary = useMemo(
    () => calculateSummary(visibleTransactions),
    [visibleTransactions]
  );

  function handleFormChange(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
      ...(field === 'type' ? { category: '' } : {})
    }));
  }

  function handleFilterChange(field, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateTransaction(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const transaction = {
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      comment: form.comment.trim()
    };

    setIsSaving(true);
    setError('');
    try {
      if (editingId === null) {
        const created = await createTransaction(transaction);
        setTransactions((currentTransactions) => [
          created,
          ...currentTransactions
        ]);
      } else {
        const updated = await updateTransaction(editingId, transaction);
        setTransactions((currentTransactions) =>
          currentTransactions.map((item) =>
            String(item.id) === String(editingId) ? updated : item
          )
        );
      }
      setForm(createEmptyForm());
      setEditingId(null);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(transaction) {
    setEditingId(transaction.id);
    setForm({
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      comment: transaction.comment || ''
    });
    setError('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(createEmptyForm());
    setError('');
  }

  async function handleDelete(id) {
    setDeletingId(id);
    setError('');
    try {
      await deleteTransaction(id);
      setTransactions((currentTransactions) =>
        currentTransactions.filter((item) => String(item.id) !== String(id))
      );
      if (String(editingId) === String(id)) {
        handleCancelEdit();
      }
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <TransactionsView
      transactions={visibleTransactions}
      categories={categories}
      filters={filters}
      form={form}
      editingId={editingId}
      summary={summary}
      isLoading={isLoading}
      isSaving={isSaving}
      deletingId={deletingId}
      error={error}
      onFormChange={handleFormChange}
      onFilterChange={handleFilterChange}
      onSubmit={handleSubmit}
      onEdit={handleEdit}
      onCancelEdit={handleCancelEdit}
      onDelete={handleDelete}
    />
  );
}
