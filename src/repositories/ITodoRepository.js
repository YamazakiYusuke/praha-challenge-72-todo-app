/**
 * @interface ITodoRepository
 */
class ITodoRepository {
  /**
   * Get all todo items
   * @returns {TodoItem[]}
   */
  getAll() { }

  /**
   * Save todo items
   * @param {TodoItem[]} todos
   * @returns {TodoItem[]}
   */
  save(todos) { }
}

export default ITodoRepository; 