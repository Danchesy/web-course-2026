async function request(path, options) {
  const response = await fetch(path, options);

  if (!response.ok) {
    const result = await response.json();
    throw new Error(
      result.error || `Не удалось выполнить запрос: ${response.status}`
    );
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

export function getTransactions(filters = {}) {
  const params = new URLSearchParams(filters);
  return request(`/api/transactions?${params}`);
}

export function getTransaction(id) {
  return request(`/api/transactions/${encodeURIComponent(id)}`);
}

export function getCategories() {
  return request('/api/categories');
}

export function createTransaction(transaction) {
  return request('/api/transactions', jsonOptions('POST', transaction));
}

export function createCategory(category) {
  return request('/api/categories', jsonOptions('POST', category));
}

export function updateTransaction(id, transaction) {
  return request(
    `/api/transactions/${encodeURIComponent(id)}`,
    jsonOptions('PUT', transaction)
  );
}

export function deleteTransaction(id) {
  return request(`/api/transactions/${encodeURIComponent(id)}`, {
    method: 'DELETE'
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
