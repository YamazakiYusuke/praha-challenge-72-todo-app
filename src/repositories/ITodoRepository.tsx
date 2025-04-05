import TodoItem from "./TodoItem";

/**
 * @interface ITodoRepository
 */
interface ITodoRepository {
  /**
   * Get all todo items
   * @returns {Promise<TodoItem[]>}
   */
  getAll(): Promise<TodoItem[]>;

  /**
   * Save todo items
   * @param {TodoItem[]} todos
   * @returns {Promise<TodoItem[]>}
   */
  save(todos: TodoItem[]): Promise<TodoItem[]>;
}

export default ITodoRepository; 