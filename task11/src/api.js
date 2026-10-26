const apiUrl = 'http://localhost:3001/tasks';

export async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('failed to fetch tasks');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function postTask(task) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
        if (!response.ok) throw new Error('failed to add task');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function patchTask(id, data) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('failed to update task');
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function removeTask(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('failed to delete task');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}