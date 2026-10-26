import { useState, useEffect } from 'react';
import { filterTasks, sortTasks, calculateStats, generateId } from './model';
import { fetchTasks, postTask, patchTask, removeTask } from './api';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Filters from './Filters';
import Sorting from './Sorting';
import Stats from './Stats';
import './App.css';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('none');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await fetchTasks();
            setTasks(data);
            setIsLoading(false);
        }
        load();
    }, []);

    const handleAdd = async (text) => {
        const newTask = { id: generateId(), text, completed: false };
        const created = await postTask(newTask);
        if (created) {
            setTasks(prev => [...prev, created]);
        }
    };

    const handleToggle = async (id) => {
        const task = tasks.find(t => String(t.id) === String(id));
        if (!task) return;
        
        const updated = await patchTask(id, { completed: !task.completed });
        if (updated) {
            setTasks(prev => prev.map(t => String(t.id) === String(id) ? updated : t));
        }
    };

    const handleDelete = async (id) => {
        const success = await removeTask(id);
        if (success) {
            setTasks(prev => prev.filter(t => String(t.id) !== String(id)));
        }
    };

    const filtered = filterTasks(tasks, filter);
    const sorted = sortTasks(filtered, sort);
    const stats = calculateStats(tasks);

    if (isLoading) {
        return <div className="app">loading...</div>;
    }

    return (
        <div className="app">
            <TodoForm onAdd={handleAdd} />
            
            <div className="controls">
                <Filters currentFilter={filter} onFilterChange={setFilter} />
                <Sorting currentSort={sort} onSortChange={setSort} />
            </div>

            <Stats stats={stats} />
            
            <TodoList 
                tasks={sorted} 
                onToggle={handleToggle} 
                onDelete={handleDelete} 
            />
        </div>
    );
}