import ITodoRepository from './repositories/ITodoRepository';
import TodoItem from './repositories/TodoItem.tsx';
import TodoRepository from './repositories/TodoRepository.tsx';

class TodoListLogic {
  private repository: ITodoRepository;
  private todos: TodoItem[] = [];

  constructor(repository: ITodoRepository = new TodoRepository()) {
    this.repository = repository;
  }

  async initialize(): Promise<void> {
    this.todos = await this.repository.getAll();
  }

  async addTodo(newTodo: string): Promise<TodoItem[] | null> {
    if (newTodo.trim() === '') {
      return null;
    }
    const todo = new TodoItem(Date.now(), newTodo);
    this.todos = [...this.todos, todo];
    return this.repository.save(this.todos);
  }

  deleteTodo(id: number): Promise<TodoItem[]> {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return this.repository.save(this.todos);
  }

  toggleComplete(id: number): Promise<TodoItem[]> {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? new TodoItem(todo.id, todo.text, !todo.completed) : todo
    );
    return this.repository.save(this.todos);
  }

  editTodo(id: number, text: string): Promise<TodoItem[] | null> {
    if (text.trim() === '') {
      return Promise.resolve(null);
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
