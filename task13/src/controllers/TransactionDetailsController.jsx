'use client';

import { useEffect, useState } from 'react';
import { getTransaction } from '../models/transaction';
import TransactionDetailsView from '../views/TransactionDetailsView';

export default function TransactionDetailsController({ id }) {
  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCurrent = true;

    async function loadTransaction() {
      setIsLoading(true);
      setError('');
      try {
        const result = await getTransaction(id);
        if (isCurrent) {
          setTransaction(result);
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

    loadTransaction();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  return (
    <TransactionDetailsView
      transaction={transaction}
      isLoading={isLoading}
      error={error}
    />
  );
}
