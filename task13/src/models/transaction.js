function apiUrl(path) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return `${baseUrl}${path}`;
}

async function request(path, options) {
  const response = await fetch(apiUrl(path), options);

  if (!response.ok) {
    throw new Error(`Не удалось выполнить запрос: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function jsonOptions(method, data) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}

export function getTransactions() {
  return request('/transactions');
}

export function getTransaction(id) {
  return request(`/transactions/${encodeURIComponent(id)}`);
}

export function getCategories() {
  return request('/categories');
}

export function createTransaction(transaction) {
  return request('/transactions', jsonOptions('POST', transaction));
}

export function updateTransaction(id, transaction) {
  return request(
    `/transactions/${encodeURIComponent(id)}`,
    jsonOptions('PUT', transaction)
  );
}

export function deleteTransaction(id) {
  return request(`/transactions/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function filterTransactions(transactions, filters) {
  return transactions.filter((transaction) => {
    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }
    if (filters.dateFrom && transaction.date < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && transaction.date > filters.dateTo) {
      return false;
    }
    return true;
  });
}

export function calculateSummary(transactions) {
  const totals = transactions.reduce(
    (summary, transaction) => {
      const amount = Number(transaction.amount);
      if (transaction.type === 'income') {
        summary.income += amount;
      } else {
        summary.expense += amount;
      }
      return summary;
    },
    { income: 0, expense: 0, balance: 0 }
  );

  totals.balance = totals.income - totals.expense;
  return totals;
}

export function validateTransaction(transaction) {
  const amount = Number(transaction.amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Укажите сумму больше нуля.';
  }
  if (!transaction.category) {
    return 'Выберите категорию.';
  }
  if (!transaction.date) {
    return 'Укажите дату.';
  }
  return '';
}
