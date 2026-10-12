import {
    getTransactions,
    getCategories,
    addTransaction,
    updateTransaction,
    deleteTransaction
} from './api.js';

export async function loadModel() {
    const transactions = await getTransactions();
    const categories = await getCategories();
    return { transactions, categories };
}

export function calculateSummary(transactions) {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
        const amount = Number(t.amount);
        if (t.type === 'income') income += amount;
        if (t.type === 'expense') expense += amount;
    });
    return { income, expense, balance: income - expense };
}

export async function createTransaction(data) {
    return await addTransaction(data);
}

export async function modifyTransaction(id, data) {
    return await updateTransaction(id, data);
}

export async function removeTransaction(id) {
    return await deleteTransaction(id);
}