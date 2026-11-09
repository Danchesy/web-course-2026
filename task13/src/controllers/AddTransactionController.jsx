'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createTransaction,
  getCategories,
  validateTransaction
} from '../models/transaction';
import AddTransactionView from '../views/AddTransactionView';

function createEmptyForm() {
  return {
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    comment: ''
  };
}

export default function AddTransactionController() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(createEmptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadCategories() {
      try {
        const result = await getCategories();
        if (isCurrent) {
          setCategories(result);
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

    loadCategories();
    return () => {
      isCurrent = false;
    };
  }, []);

  function handleChange(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
      ...(field === 'type' ? { category: '' } : {})
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validateTransaction(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await createTransaction({
        ...form,
        amount: Number(form.amount),
        comment: form.comment.trim()
      });
      router.push('/');
      router.refresh();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AddTransactionView
      categories={categories}
      form={form}
      isLoading={isLoading}
      isSaving={isSaving}
      error={error}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
