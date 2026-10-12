import {
    loadModel,
    calculateSummary,
    createTransaction,
    modifyTransaction,
    removeTransaction
} from './model.js';

import {
    getElements,
    renderSummary,
    renderTransactions,
    fillCategories,
    resetForm,
    fillForm
} from './view.js';

async function init() {
    const elements = getElements();
    const model = await loadModel();
    let transactions = model.transactions;
    const categories = model.categories;

    fillCategories(elements.categorySelect, categories);
    renderSummary(elements.summaryDiv, calculateSummary(transactions));
    renderTransactions(elements.listContainer, transactions);

    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const transactionData = {
            amount: Number(elements.amountInput.value),
            type: elements.typeSelect.value,
            category: elements.categorySelect.value,
            date: elements.dateInput.value,
            comment: elements.commentInput.value
        };
        const editId = elements.editIdInput.value;
        if (editId) {
            const updated = await modifyTransaction(editId, { ...transactionData, id: editId });
            if (updated) {
                transactions = transactions.map(t =>
                    String(t.id) === String(editId) ? updated : t
                );
            }
        } else {
            const newTransaction = await createTransaction(transactionData);
            if (newTransaction) {
                transactions.push(newTransaction);
            }
        }
        resetForm(elements);
        renderSummary(elements.summaryDiv, calculateSummary(transactions));
        renderTransactions(elements.listContainer, transactions);
    });

    elements.listContainer.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');

        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            const success = await removeTransaction(id);
            if (success) {
                transactions = transactions.filter(t => String(t.id) !== String(id));
                renderSummary(elements.summaryDiv, calculateSummary(transactions));
                renderTransactions(elements.listContainer, transactions);
            }
        }

        if (editBtn) {
            const id = editBtn.dataset.id;
            const transaction = transactions.find(t => String(t.id) === String(id));
            if (transaction) {
                fillForm(elements, transaction);
            }
        }
    });

    elements.cancelBtn.addEventListener('click', () => resetForm(elements));
}

init();