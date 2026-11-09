import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Database from 'better-sqlite3';

let connection;

function seedDatabase(db) {
  const seedPath = join(process.cwd(), 'db.json');
  const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
  const insertCategory = db.prepare(
    'INSERT OR IGNORE INTO categories (id, name, type) VALUES (?, ?, ?)'
  );
  const insertTransaction = db.prepare(
    `INSERT OR IGNORE INTO transactions
      (id, amount, type, category, date, comment)
      VALUES (?, ?, ?, ?, ?, ?)`
  );

  const seedData = db.transaction(() => {
    for (const category of seed.categories) {
      insertCategory.run(
        String(category.id || randomUUID()),
        category.name,
        category.type
      );
    }

    for (const transaction of seed.transactions) {
      insertTransaction.run(
        String(transaction.id || randomUUID()),
        Number(transaction.amount),
        transaction.type,
        transaction.category,
        transaction.date,
        transaction.comment || ''
      );
    }

    db.prepare(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
    ).run('seeded', 'true');
  });

  seedData();
}

export function getDb() {
  if (connection) {
    return connection;
  }

  const databasePath = process.env.VERCEL
    ? join('/tmp', 'zen-money.sqlite')
    : join(process.cwd(), 'zen-money.sqlite');
  const db = new Database(databasePath);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      amount REAL NOT NULL CHECK (amount > 0),
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      comment TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS transactions_date_idx ON transactions(date);
    CREATE INDEX IF NOT EXISTS transactions_type_idx ON transactions(type);
    CREATE INDEX IF NOT EXISTS transactions_category_idx ON transactions(category);
  `);

  const seeded = db
    .prepare('SELECT value FROM settings WHERE key = ?')
    .get('seeded');
  if (!seeded) {
    seedDatabase(db);
  }

  connection = db;
  return connection;
}
