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
    try {
      this.todos = await this.repository.getAll();
    } catch (error) {
      console.error('Failed to initialize todos:', error);
      this.todos = [];
    }
  }

  async addTodo(newTodo: string): Promise<TodoItem[] | null> {
    try {
      if (newTodo.trim() === '') {
        return null;
      }
      const todo = new TodoItem(Date.now(), newTodo);
      this.todos = [...this.todos, todo];
      return await this.repository.save(this.todos);
    } catch (error) {
      console.error('Failed to add todo:', error);
      return null;
    }
  }

  async deleteTodo(id: number): Promise<TodoItem[] | null> {
    try {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      return await this.repository.save(this.todos);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      return null;
    }
  }

  async toggleComplete(id: number): Promise<TodoItem[] | null> {
    try {
      this.todos = this.todos.map((todo) =>
        todo.id === id ? new TodoItem(todo.id, todo.text, !todo.completed) : todo
      );
      return await this.repository.save(this.todos);
    } catch (error) {
      console.error('Failed to toggle todo completion:', error);
      return null;
    }
  }

  async editTodo(id: number, text: string): Promise<TodoItem[] | null> {
    try {
      if (text.trim() === '') {
        return null;
      }
      this.todos = this.todos.map((todo) =>
        todo.id === id ? new TodoItem(todo.id, text, todo.completed) : todo
      );
      return await this.repository.save(this.todos);
    } catch (error) {
      console.error('Failed to edit todo:', error);
      return null;
    }
  }

  getTodos(): TodoItem[] {
    try {
      return [...this.todos];  // 配列のコピーを返して不変性を保持
    } catch (error) {
      console.error('Failed to get todos:', error);
      return [];
    }
  }
}

export default TodoListLogic;
