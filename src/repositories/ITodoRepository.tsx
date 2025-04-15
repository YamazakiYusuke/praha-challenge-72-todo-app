import TodoItem, { NewTodoInput } from "./TodoItem";

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

  create(input: NewTodoInput): Promise<TodoItem>;
  update(todo: TodoItem): Promise<TodoItem>;
  delete(id: number): Promise<void>;
}

export default ITodoRepository; 