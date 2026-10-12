import {
    getTransactions,
    getCategories,
    createCategory,
    addTransaction,
    updateTransaction,
    deleteTransaction
} from './api.js';

export async function loadModel() {
    const transactions = await getTransactions();
    const categories = await getCategories();
    return { transactions, categories };
}

export function getFiltered(transactions, filters) {
    return transactions.filter(t => {
        if (filters.category && t.category !== filters.category) return false;
        if (filters.type !== 'all' && t.type !== filters.type) return false;
        if (filters.dateFrom && t.date < filters.dateFrom) return false;
        if (filters.dateTo && t.date > filters.dateTo) return false;
        return true;
    });
}

export function calculateSummary(filtered) {
    let income = 0;
    let expense = 0;
    filtered.forEach(t => {
        const amount = Number(t.amount);
        if (t.type === 'income') income += amount;
        if (t.type === 'expense') expense += amount;
    });
    return { income, expense, balance: income - expense };
}

export function validateForm(values) {
    const errors = { amount: '', category: '', date: '' };
    let valid = true;
    const amount = Number(values.amount);
    if (!values.amount || amount <= 0) {
        errors.amount = 'amount must be a positive number';
        valid = false;
    }
    if (!values.category) {
        errors.category = 'category is required';
        valid = false;
    }
    if (!values.date) {
        errors.date = 'date is required';
        valid = false;
    }
    return { valid, errors };
}

export async function createNewTransaction(data) {
    return await addTransaction(data);
}

export async function modifyTransaction(id, data) {
    return await updateTransaction(id, data);
}

export async function removeTransaction(id) {
    return await deleteTransaction(id);
}

export async function createNewCategory(data) {
    return await createCategory(data);
}

export function loadSettings() {
    const savedFilters = localStorage.getItem('zenFilters');
    const savedTheme = localStorage.getItem('zenTheme');
    return {
        filters: savedFilters
            ? JSON.parse(savedFilters)
            : { category: '', type: 'all', dateFrom: '', dateTo: '' },
        theme: savedTheme || 'light'
    };
}

export function saveFilters(filters) {
    localStorage.setItem('zenFilters', JSON.stringify(filters));
}

export function saveTheme(theme) {
    localStorage.setItem('zenTheme', theme);
}