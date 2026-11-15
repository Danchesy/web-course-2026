import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TodoItem from '../../task11/src/TodoItem.jsx';

describe('TodoItem', () => {
  it('calls onDelete with the task id', () => {
    const onDelete = vi.fn();
    const task = { id: 'todo-42', text: 'Submit lab', completed: false };
    render(<TodoItem task={task} onToggle={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole('button', { name: 'delete' }));

    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith('todo-42');
  });

  it('calls onToggle with the task id when its checkbox changes', () => {
    const onToggle = vi.fn();
    const task = { id: 'todo-7', text: 'Review tests', completed: false };
    render(<TodoItem task={task} onToggle={onToggle} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledOnce();
    expect(onToggle).toHaveBeenCalledWith('todo-7');
  });
});
