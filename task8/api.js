// api.js
const apiUrl = 'http://localhost:3001';

// get all transactions from server
export async function getTransactions() {
    try {
        const response = await fetch(`${apiUrl}/transactions`);
        if (!response.ok) throw new Error('failed to fetch transactions');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// get categories from server
export async function getCategories() {
    try {
        const response = await fetch(`${apiUrl}/categories`);
        if (!response.ok) throw new Error('failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// add new transaction
export async function addTransaction(transaction) {
    try {
        const response = await fetch(`${apiUrl}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        if (!response.ok) throw new Error('failed to add transaction');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// update existing transaction
export async function updateTransaction(id, transaction) {
    try {
        const response = await fetch(`${apiUrl}/transactions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        if (!response.ok) throw new Error('failed to update transaction');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// delete transaction by id
export async function deleteTransaction(id) {
    try {
        const response = await fetch(`${apiUrl}/transactions/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('failed to delete transaction');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}