import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { validateTransaction } from '../../../../lib/validation';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const transaction = getDb()
      .prepare(
        `SELECT id, amount, type, category, date, comment
         FROM transactions WHERE id = ?`
      )
      .get(id);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Операция не найдена.' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json(
      { error: 'Не удалось загрузить операцию.' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  let transaction;
  try {
    transaction = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный json.' }, { status: 400 });
  }

  try {
    const { id } = await params;
    const db = getDb();
    const existing = db
      .prepare('SELECT id FROM transactions WHERE id = ?')
      .get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Операция не найдена.' },
        { status: 404 }
      );
    }

    const validationError = validateTransaction(transaction, db);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updated = {
      id,
      amount: Number(transaction.amount),
      type: transaction.type,
      category: transaction.category.trim(),
      date: transaction.date,
      comment: transaction.comment?.trim() || ''
    };
    db.prepare(
      `UPDATE transactions
       SET amount = @amount, type = @type, category = @category,
           date = @date, comment = @comment
       WHERE id = @id`
    ).run(updated);

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Не удалось обновить операцию.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = getDb()
      .prepare('DELETE FROM transactions WHERE id = ?')
      .run(id);
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Операция не найдена.' },
        { status: 404 }
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: 'Не удалось удалить операцию.' },
      { status: 500 }
    );
  }
}
