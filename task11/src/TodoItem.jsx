export default function TodoItem({ task, onToggle, onDelete }) {
    return (
        <li className={task.completed ? 'completed' : ''}>
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => onToggle(task.id)} 
            />
            <span>{task.text}</span>
            <button onClick={() => onDelete(task.id)}>delete</button>
        </li>
    );
}