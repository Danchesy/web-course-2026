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
        summaryDiv: document.getElementById('summary')
    };
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

export function renderSummary(summaryDiv, summary) {
    summaryDiv.innerHTML = `
        <span>income: ${summary.income}</span>
        <span>expense: ${summary.expense}</span>
        <span>balance: ${summary.balance}</span>
    `;
}

export function renderTransactions(listContainer, transactions) {
    listContainer.innerHTML = '';
    transactions.forEach(t => {
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

export function fillCategories(categorySelect, categories) {
    categorySelect.innerHTML = '<option value="">select category</option>';
    categories.forEach(c => {
        const option = document.createElement('option');
        option.value = c.name;
        option.textContent = c.name;
        categorySelect.appendChild(option);
    });
}

export function resetForm(elements) {
    elements.form.reset();
    elements.editIdInput.value = '';
    elements.submitBtn.textContent = 'add';
    elements.cancelBtn.classList.add('hidden');
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
}