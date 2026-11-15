import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import TodoForm from '../../task11/src/TodoForm.jsx';

describe('TodoForm', () => {
  it('renders a text field and an add button', () => {
    render(<TodoForm onAdd={vi.fn()} />);

    expect(screen.getByPlaceholderText('new task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'add' })).toBeInTheDocument();
  });

  it('submits trimmed text and clears the field', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);

    await user.type(screen.getByPlaceholderText('new task...'), '  Read docs  ');
    await user.click(screen.getByRole('button', { name: 'add' }));

    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledWith('Read docs');
    expect(screen.getByPlaceholderText('new task...')).toHaveValue('');
  });

  it('does not submit empty or whitespace-only text', () => {
    const onAdd = vi.fn();
    render(<TodoForm onAdd={onAdd} />);
    const form = screen.getByRole('button', { name: 'add' }).closest('form');

    fireEvent.submit(form);

    expect(onAdd).not.toHaveBeenCalled();
  });
});
