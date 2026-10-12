export function getElements() {
    return {
        form: document.getElementById('transaction-form'),
        amountInput: document.getElementById('amount'),
        typeSelect: document.getElementById('type'),
        categorySelect: document.getElementById('category'),
        dateInput: document.getElementById('date'),
        commentInput: document.getElementById('comment'),
        editIdInput: document.getElementById('edit-id'),
        submitBtn: document.getElementById('submit-btn'),
        cancelBtn: document.getElementById('cancel-btn'),
        listContainer: document.getElementById('transactions-list'),
        summaryDiv: document.getElementById('summary'),
        filterCategory: document.getElementById('filter-category'),
        filterType: document.getElementById('filter-type'),
        filterDateFrom: document.getElementById('filter-date-from'),
        filterDateTo: document.getElementById('filter-date-to'),
        resetFiltersBtn: document.getElementById('reset-filters'),
        newCategoryName: document.getElementById('new-category-name'),
        newCategoryType: document.getElementById('new-category-type'),
        addCategoryBtn: document.getElementById('add-category-btn'),
        themeToggle: document.getElementById('theme-toggle'),
        amountError: document.getElementById('amount-error'),
        categoryError: document.getElementById('category-error'),
        dateError: document.getElementById('date-error')
    };
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

export function renderSummary(summaryDiv, summary) {
    summaryDiv.innerHTML = `
        <span>income: ${summary.income.toFixed(2)}</span>
        <span>expense: ${summary.expense.toFixed(2)}</span>
        <span>balance: ${summary.balance.toFixed(2)}</span>
    `;
}

export function renderTransactions(listContainer, filtered) {
    listContainer.innerHTML = '';
    filtered.forEach(t => {
        const card = document.createElement('div');
        card.className = 'transaction-card';
        const amountClass = t.type === 'income' ? 'income' : 'expense';
        const sign = t.type === 'income' ? '+' : '-';
        card.innerHTML = `
            <div class="transaction-info">
                <span>${formatDate(t.date)} | ${t.category}</span>
                <span>${t.comment || ''}</span>
                <span class="amount ${amountClass}">${sign}${t.amount}</span>
            </div>
            <div class="actions">
                <button class="edit-btn" data-id="${t.id}">edit</button>
                <button class="delete-btn" data-id="${t.id}">delete</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

export function fillCategorySelects(elements, categories, filters) {
    elements.categorySelect.innerHTML = '<option value="">select category</option>';
    elements.filterCategory.innerHTML = '<option value="">all categories</option>';
    categories.forEach(c => {
        const option1 = document.createElement('option');
        option1.value = c.name;
        option1.textContent = c.name;
        elements.categorySelect.appendChild(option1);
        const option2 = document.createElement('option');
        option2.value = c.name;
        option2.textContent = c.name;
        elements.filterCategory.appendChild(option2);
    });
    elements.filterCategory.value = filters.category || '';
}

export function applyFiltersToInputs(elements, filters) {
    elements.filterCategory.value = filters.category || '';
    elements.filterType.value = filters.type || 'all';
    elements.filterDateFrom.value = filters.dateFrom || '';
    elements.filterDateTo.value = filters.dateTo || '';
}

export function resetFilterInputs(elements) {
    elements.filterCategory.value = '';
    elements.filterType.value = 'all';
    elements.filterDateFrom.value = '';
    elements.filterDateTo.value = '';
}

export function resetForm(elements) {
    elements.form.reset();
    elements.editIdInput.value = '';
    elements.submitBtn.textContent = 'add';
    elements.cancelBtn.classList.add('hidden');
    clearErrors(elements);
}

export function fillForm(elements, transaction) {
    elements.amountInput.value = transaction.amount;
    elements.typeSelect.value = transaction.type;
    elements.categorySelect.value = transaction.category;
    elements.dateInput.value = transaction.date;
    elements.commentInput.value = transaction.comment || '';
    elements.editIdInput.value = transaction.id;
    elements.submitBtn.textContent = 'save';
    elements.cancelBtn.classList.remove('hidden');
    clearErrors(elements);
}

export function clearErrors(elements) {
    elements.amountError.textContent = '';
    elements.categoryError.textContent = '';
    elements.dateError.textContent = '';
    elements.amountInput.classList.remove('input-error');
    elements.categorySelect.classList.remove('input-error');
    elements.dateInput.classList.remove('input-error');
}

export function showErrors(elements, errors) {
    elements.amountError.textContent = errors.amount;
    elements.categoryError.textContent = errors.category;
    elements.dateError.textContent = errors.date;
    if (errors.amount) elements.amountInput.classList.add('input-error');
    if (errors.category) elements.categorySelect.classList.add('input-error');
    if (errors.date) elements.dateInput.classList.add('input-error');
}

export function applyTheme(elements, theme) {
    document.body.classList.toggle('dark', theme === 'dark');
    elements.themeToggle.textContent = theme === 'dark' ? 'light mode' : 'dark mode';
}