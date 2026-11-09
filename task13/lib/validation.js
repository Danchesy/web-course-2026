export function validateCategory(value) {
  if (!value || typeof value !== 'object') {
    return 'Передайте данные категории.';
  }
  if (typeof value.name !== 'string' || !value.name.trim()) {
    return 'Укажите название категории.';
  }
  if (!['income', 'expense'].includes(value.type)) {
    return 'Тип категории должен быть доходом или расходом.';
  }
  return '';
}

export function validateTransaction(value, db) {
  if (!value || typeof value !== 'object') {
    return 'Передайте данные операции.';
  }

  const amount = Number(value.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return 'Укажите сумму больше нуля.';
  }
  if (!['income', 'expense'].includes(value.type)) {
    return 'Тип операции должен быть доходом или расходом.';
  }
  if (typeof value.category !== 'string' || !value.category.trim()) {
    return 'Выберите категорию.';
  }
  const category = db
    .prepare('SELECT type FROM categories WHERE name = ?')
    .get(value.category.trim());
  if (!category || category.type !== value.type) {
    return 'Категория не соответствует типу операции.';
  }
  if (typeof value.date !== 'string' || !isValidDate(value.date)) {
    return 'Укажите корректную дату.';
  }
  if (
    value.comment !== undefined &&
    (typeof value.comment !== 'string' || value.comment.length > 160)
  ) {
    return 'Комментарий должен содержать не более 160 символов.';
  }
  return '';
}

export function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}
