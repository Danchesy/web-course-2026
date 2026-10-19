const apiUrl = 'http://localhost:3001';

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

export async function createCategory(category) {
    try {
        const response = await fetch(`${apiUrl}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category)
        });
        if (!response.ok) throw new Error('failed to create category');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

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