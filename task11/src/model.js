export function generateId() {
    return Date.now().toString();
}

export function filterTasks(tasks, filter) {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
}

export function sortTasks(tasks, sortType) {
    const copy = [...tasks];
    if (sortType === 'alpha') {
        return copy.sort((a, b) => a.text.localeCompare(b.text));
    }
    if (sortType === 'newest') {
        return copy.sort((a, b) => Number(b.id) - Number(a.id));
    }
    if (sortType === 'oldest') {
        return copy.sort((a, b) => Number(a.id) - Number(b.id));
    }
    return copy;
}

export function calculateStats(tasks) {
    const left = tasks.filter(t => !t.completed).length;
    const done = tasks.filter(t => t.completed).length;
    return { left, done };
}