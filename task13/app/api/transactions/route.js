import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { isValidDate, validateTransaction } from '../../../lib/validation';

export const runtime = 'nodejs';

function readFilters(request) {
  const params = new URL(request.url).searchParams;
  const filters = {
    type: params.get('type') || 'all',
    category: params.get('category') || '',
    dateFrom: params.get('dateFrom') || '',
    dateTo: params.get('dateTo') || ''
  };

  if (!['all', 'income', 'expense'].includes(filters.type)) {
    return { error: 'Недопустимый тип операции.' };
  }
  if (filters.dateFrom && !isValidDate(filters.dateFrom)) {
    return { error: 'Некорректная дата начала периода.' };
  }
  if (filters.dateTo && !isValidDate(filters.dateTo)) {
    return { error: 'Некорректная дата окончания периода.' };
  }
  if (filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) {
    return { error: 'Дата начала периода позже даты окончания.' };
  }
  return { filters };
}

export function GET(request) {
  const result = readFilters(request);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const { filters } = result;
    const conditions = [];
    const values = [];

    if (filters.type !== 'all') {
      conditions.push('type = ?');
      values.push(filters.type);
    }
    if (filters.category) {
      conditions.push('category = ?');
      values.push(filters.category);
    }
    if (filters.dateFrom) {
      conditions.push('date >= ?');
      values.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      conditions.push('date <= ?');
      values.push(filters.dateTo);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const transactions = getDb()
      .prepare(
        `SELECT id, amount, type, category, date, comment
         FROM transactions ${where}
         ORDER BY date DESC, rowid DESC`
      )
      .all(...values);

    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json(
      { error: 'Не удалось загрузить операции.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let transaction;
  try {
    transaction = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный json.' }, { status: 400 });
  }

  try {
    const db = getDb();
    const validationError = validateTransaction(transaction, db);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const created = {
      id: randomUUID(),
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category.trim(),
      date: transaction.date,
      comment: transaction.comment?.trim() || ''
    };
    db.prepare(
      `INSERT INTO transactions (id, amount, type, category, date, comment)
       VALUES (@id, @amount, @type, @category, @date, @comment)`
    ).run(created);

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Не удалось создать операцию.' },
      { status: 500 }
    );
  }
}
