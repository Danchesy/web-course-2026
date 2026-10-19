import {
    loadModel,
    getFiltered,
    calculateSummary,
    validateForm,
    createNewTransaction,
    modifyTransaction,
    removeTransaction,
    createNewCategory,
    loadSettings,
    saveFilters,
    saveTheme
} from './model.js';

import {
    getElements,
    renderSummary,
    renderTransactions,
    fillCategorySelects,
    applyFiltersToInputs,
    resetFilterInputs,
    resetForm,
    fillForm,
    showErrors,
    applyTheme
} from './view.js';

function buildFilters(elements) {
    return {
        category: elements.filterCategory.value,
        type: elements.filterType.value,
        dateFrom: elements.filterDateFrom.value,
        dateTo: elements.filterDateTo.value
    };
}

function render(elements, transactions, filters) {
    const filtered = getFiltered(transactions, filters);
    renderSummary(elements.summaryDiv, calculateSummary(filtered));
    renderTransactions(elements.listContainer, filtered);
}

function bindForm(elements, state) {
    elements.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const values = {
            amount: elements.amountInput.value,
            type: elements.typeSelect.value,
            category: elements.categorySelect.value,
            date: elements.dateInput.value,
            comment: elements.commentInput.value
        };
        const { valid, errors } = validateForm(values);
        if (!valid) {
            showErrors(elements, errors);
            return;
        }
        const data = {
            amount: Number(values.amount),
            type: values.type,
            category: values.category,
            date: values.date,
            comment: values.comment
        };
        const editId = elements.editIdInput.value;
        if (editId) {
            const updated = await modifyTransaction(editId, { ...data, id: editId });
            if (updated) {
                state.transactions = state.transactions.map(t =>
                    String(t.id) === String(editId) ? updated : t
                );
            }
        } else {
            const created = await createNewTransaction(data);
            if (created) state.transactions.push(created);
        }
        resetForm(elements);
        render(elements, state.transactions, state.filters);
    });
}

function bindList(elements, state) {
    elements.listContainer.addEventListener('click', async (e) => {
        const editBtn = e.target.closest('.edit-btn');
        const deleteBtn = e.target.closest('.delete-btn');
        if (deleteBtn) {
            const id = deleteBtn.dataset.id;
            const success = await removeTransaction(id);
            if (success) {
                state.transactions = state.transactions.filter(
                    t => String(t.id) !== String(id)
                );
                render(elements, state.transactions, state.filters);
            }
        }
        if (editBtn) {
            const id = editBtn.dataset.id;
            const transaction = state.transactions.find(
                t => String(t.id) === String(id)
            );
            if (transaction) fillForm(elements, transaction);
        }
    });
}

function bindFilters(elements, state) {
    const handler = () => {
        state.filters = buildFilters(elements);
        saveFilters(state.filters);
        render(elements, state.transactions, state.filters);
    };
    elements.filterCategory.addEventListener('change', handler);
    elements.filterType.addEventListener('change', handler);
    elements.filterDateFrom.addEventListener('change', handler);
    elements.filterDateTo.addEventListener('change', handler);
    elements.resetFiltersBtn.addEventListener('click', () => {
        resetFilterInputs(elements);
        state.filters = buildFilters(elements);
        saveFilters(state.filters);
        render(elements, state.transactions, state.filters);
    });
}

function bindCategory(elements, state) {
    elements.addCategoryBtn.addEventListener('click', async () => {
        const name = elements.newCategoryName.value.trim();
        const type = elements.newCategoryType.value;
        if (!name) {
            alert('enter category name');
            return;
        }
        const created = await createNewCategory({ name, type });
        if (created) {
            state.categories.push(created);
            fillCategorySelects(elements, state.categories, state.filters);
            elements.newCategoryName.value = '';
        }
    });
}

function bindTheme(elements, state) {
    elements.themeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(elements, state.theme);
        saveTheme(state.theme);
    });
}

function bindCancel(elements) {
    elements.cancelBtn.addEventListener('click', () => resetForm(elements));
}

async function init() {
    const elements = getElements();
    const settings = loadSettings();
    const model = await loadModel();
    const state = {
        transactions: model.transactions,
        categories: model.categories,
        filters: settings.filters,
        theme: settings.theme
    };

    const categoryExists = state.categories.some(c => c.name === state.filters.category);
    if (!categoryExists) {
        state.filters.category = '';
        saveFilters(state.filters);
    }

    applyTheme(elements, state.theme);
    applyFiltersToInputs(elements, state.filters);
    fillCategorySelects(elements, state.categories, state.filters);
    render(elements, state.transactions, state.filters);
    bindForm(elements, state);
    bindList(elements, state);
    bindFilters(elements, state);
    bindCategory(elements, state);
    bindTheme(elements, state);
    bindCancel(elements);
}

init();