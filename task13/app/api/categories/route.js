import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';
import { validateCategory } from '../../../lib/validation';

export const runtime = 'nodejs';

export function GET() {
  try {
    const categories = getDb()
      .prepare('SELECT id, name, type FROM categories ORDER BY name')
      .all();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: 'Не удалось загрузить категории.' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let category;
  try {
    category = await request.json();
  } catch {
    return NextResponse.json({ error: 'Некорректный json.' }, { status: 400 });
  }

  try {
    const validationError = validateCategory(category);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const db = getDb();
    const id = randomUUID();
    try {
      db.prepare('INSERT INTO categories (id, name, type) VALUES (?, ?, ?)').run(
        id,
        category.name.trim(),
        category.type
      );
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return NextResponse.json(
          { error: 'Категория с таким названием уже существует.' },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json(
      { id, name: category.name.trim(), type: category.type },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Не удалось создать категорию.' },
      { status: 500 }
    );
  }
}
