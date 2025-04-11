import ITodoRepository from './ITodoRepository';
import TodoItem from './TodoItem.tsx';

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
}

export default InMemoryTodoRepository; 