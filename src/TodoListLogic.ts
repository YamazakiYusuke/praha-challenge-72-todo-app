import ITodoRepository from './repositories/ITodoRepository';
import TodoItem from './repositories/TodoItem';
import TodoRepository from './repositories/TodoRepository';

class TodoListLogic {
  private repository: ITodoRepository;
  private todos: TodoItem[];

  constructor(repository: ITodoRepository = new TodoRepository()) {
    this.repository = repository;
    this.todos = this.repository.getAll();
  }

  addTodo(newTodo: string): TodoItem[] | null {
    if (newTodo.trim() === '') {
      return null;
    }
    const todo = new TodoItem(Date.now(), newTodo);
    this.todos = [...this.todos, todo];
    return this.repository.save(this.todos);
  }

  deleteTodo(id: number): TodoItem[] {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return this.repository.save(this.todos);
  }

  toggleComplete(id: number): TodoItem[] {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? new TodoItem(todo.id, todo.text, !todo.completed) : todo
    );
    return this.repository.save(this.todos);
  }

  editTodo(id: number, text: string): TodoItem[] | null {
    if (text.trim() === '') {
      return null;
    }
    this.todos = this.todos.map((todo) =>
      todo.id === id ? new TodoItem(todo.id, text, todo.completed) : todo
    );
    return this.repository.save(this.todos);
  }

  getTodos(): TodoItem[] {
    return this.todos;
  }
}

export default TodoListLogic;
