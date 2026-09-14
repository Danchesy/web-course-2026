let tasks = [];
let nextId = 1;
let currentFilter = 'all';

const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const filterBtns = document.querySelectorAll('.filter-btn');

// render function redraws list based on current state
function render() {
    // clear list
    list.innerHTML = '';

    const filtered = tasks.filter(task => {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    // create dom elements for each task
    filtered.forEach(task => {
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        // toggle completion status
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const span = document.createElement('span');
        span.textContent = task.text;
        // apply visual style if completed
        if (task.completed) {
            li.classList.add('completed');
        }

        const delBtn = document.createElement('button');
        delBtn.textContent = 'delete';
        // delete task handler
        delBtn.addEventListener('click', () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(delBtn);
        list.appendChild(li);
    });

    // update stats counter
    const doneCount = tasks.filter(t => t.completed).length;
    counter.textContent = `left: ${tasks.length - doneCount}, done: ${doneCount}`;
}

// add new task to array
function addTask() {
    const text = input.value.trim();
    // prevent empty tasks
    if (!text) {
        alert('enter a task');
        return;
    }
    tasks.push({ id: nextId++, text: text, completed: false });
    input.value = '';
    render();
}

// remove task from array by id
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    render();
}

// flip completed status of a task
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        render();
    }
}

// change current filter and update active button style
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    render();
}

// event listeners
addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTask();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// initial draw
render();