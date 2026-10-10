// main.js
import { 
    getTransactions, 
    getCategories, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
} from './api.js';

// dom elements
const form = document.getElementById('transaction-form');
const amountInput = document.getElementById('amount');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const dateInput = document.getElementById('date');
const commentInput = document.getElementById('comment');
const editIdInput = document.getElementById('edit-id');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const listContainer = document.getElementById('transactions-list');
const summaryDiv = document.getElementById('summary');

// local state
let transactions = [];
let categories = [];

// format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// render summary block
function renderSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        const amount = Number(t.amount);
        if (t.type === 'income') income += amount;
        if (t.type === 'expense') expense += amount;
    });

    const balance = income - expense;

    summaryDiv.innerHTML = `
        <span>income: ${income}</span>
        <span>expense: ${expense}</span>
        <span>balance: ${balance}</span>
    `;
}

// render list of transactions
function renderTransactions() {
    listContainer.innerHTML = '';

    transactions.forEach(t => {
        const card = document.createElement('div');
        card.className = 'transaction-card';

        const amountClass = t.type === 'income' ? 'income' : 'expense';
        const sign = t.type === 'income' ? '+' : '-';

        // use data-id attribute with original id value
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

// load initial data from server
async function loadData() {
    transactions = await getTransactions();
    categories = await getCategories();
    
    // fill category select
    categorySelect.innerHTML = '<option value="">select category</option>';
    categories.forEach(c => {
        const option = document.createElement('option');
        option.value = c.name;
        option.textContent = c.name;
        categorySelect.appendChild(option);
    });

    renderSummary();
    renderTransactions();
}

// reset form to add mode
function resetForm() {
    form.reset();
    editIdInput.value = '';
    submitBtn.textContent = 'add';
    cancelBtn.classList.add('hidden');
}

// handle form submit for add or edit
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const transactionData = {
        amount: Number(amountInput.value),
        type: typeSelect.value,
        category: categorySelect.value,
        date: dateInput.value,
        comment: commentInput.value
    };

    const editId = editIdInput.value;

    if (editId) {
        // update existing - keep id as string to match server
        const updated = await updateTransaction(editId, { ...transactionData, id: editId });
        if (updated) {
            // replace in array by comparing string ids
            transactions = transactions.map(t => 
                String(t.id) === String(editId) ? updated : t
            );
        }
    } else {
        // add new
        const newTransaction = await addTransaction(transactionData);
        if (newTransaction) {
            transactions.push(newTransaction);
        }
    }

    resetForm();
    renderSummary();
    renderTransactions();
});

// handle edit and delete clicks using event delegation
listContainer.addEventListener('click', async (e) => {
    // find the closest button (in case click lands on child element)
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        const success = await deleteTransaction(id);
        if (success) {
            // filter using string comparison
            transactions = transactions.filter(t => String(t.id) !== String(id));
            renderSummary();
            renderTransactions();
        }
    }

    if (editBtn) {
        const id = editBtn.dataset.id;
        // find transaction with matching string id
        const transaction = transactions.find(t => String(t.id) === String(id));
        if (transaction) {
            amountInput.value = transaction.amount;
            typeSelect.value = transaction.type;
            categorySelect.value = transaction.category;
            dateInput.value = transaction.date;
            commentInput.value = transaction.comment || '';
            editIdInput.value = transaction.id;
            submitBtn.textContent = 'save';
            cancelBtn.classList.remove('hidden');
        }
    }
});

// cancel edit mode
cancelBtn.addEventListener('click', resetForm);

// start app
loadData();