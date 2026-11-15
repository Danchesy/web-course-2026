import { Injectable } from '@angular/core';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private items: Todo[] = [];
  private nextId = 1;

  getTodos(): readonly Todo[] {
    return this.items;
  }

  addTodo(text: string): void {
    const normalizedText = text.trim();
    if (!normalizedText) {
      return;
    }

    this.items = [
      ...this.items,
      { id: this.nextId, text: normalizedText, completed: false }
    ];
    this.nextId += 1;
  }

  toggleTodo(id: number): void {
    this.items = this.items.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  deleteTodo(id: number): void {
    this.items = this.items.filter((todo) => todo.id !== id);
  }
}
