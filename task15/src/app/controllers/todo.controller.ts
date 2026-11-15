import { Component } from '@angular/core';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: '../views/todo-view.component.html',
  styleUrls: ['../views/todo-view.component.css']
})
export class TodoController {
  text = '';

  constructor(private readonly todoService: TodoService) {}

  get todos(): readonly Todo[] {
    return this.todoService.getTodos();
  }

  addTodo(): void {
    this.todoService.addTodo(this.text);
    this.text = '';
  }

  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  trackById(_index: number, todo: Todo): number {
    return todo.id;
  }
}
