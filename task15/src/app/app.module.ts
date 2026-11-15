import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TodoController } from './controllers/todo.controller';

@NgModule({
  declarations: [TodoController],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [TodoController]
})
export class AppModule {}
