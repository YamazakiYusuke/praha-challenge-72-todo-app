import ITodoRepository from './ITodoRepository';
import TodoItem, { NewTodoInput } from './TodoItem.tsx';

/**
 * インメモリのTodoリポジトリの実装
 * APIリクエストの代わりにメモリ内でTodoアイテムを管理します
 */
class InMemoryTodoRepository implements ITodoRepository {
  private todos: TodoItem[] = [];

  /**
   * 初期データでリポジトリを構築します
   * @param initialTodos 初期Todoアイテム
   */
  constructor(initialTodos: TodoItem[] = []) {
    this.todos = [...initialTodos];
  }

  /**
   * すべてのTodoアイテムを取得します
   * @returns Todoアイテムの配列のPromise
   */
  async getAll(): Promise<TodoItem[]> {
    // メモリからTodoアイテムのコピーを返す
    return [...this.todos];
  }

  /**
   * Todoアイテムを保存します
   * @param todos 保存するTodoアイテムの配列
   * @returns 保存されたTodoアイテムの配列のPromise
   */
  async save(todos: TodoItem[]): Promise<TodoItem[]> {
    // 新しいTodoアイテムで置き換える
    this.todos = [...todos];
    return this.todos;
  }

  async create(input: NewTodoInput): Promise<TodoItem> {
    // FIXME: The id assignment using Date.now() is not ideal. It could lead to issues if todos are created in quick succession, as the ids might not be unique. A better approach would be to use a counter or a UUID generator.
    const todo = new TodoItem(Date.now(), input.text, input.completed);
    this.todos.push(todo);
    return todo;
  }

  async update(todo: TodoItem): Promise<TodoItem> {
    this.todos = this.todos.map(t => t.id === todo.id ? todo : t);
    return todo;
  }

  async delete(id: number): Promise<void> {
    this.todos = this.todos.filter(t => t.id !== id);
  }
}

export default InMemoryTodoRepository;
