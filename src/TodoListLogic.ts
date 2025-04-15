import ITodoRepository from './repositories/ITodoRepository';
import RepositoryFactory from './composables/RepositoryFactory.tsx';
import TodoItem from './repositories/TodoItem.tsx';

/**
 * @class TodoListLogic
 * This class contains the business logic for managing the todo list.
 */
export default class TodoListLogic {
  /**
   * @private
   * This property holds the repository instance used to interact with the data source.
   */
  private repository: ITodoRepository;
  /**
   * @private
   * This property holds the list of todos.
   */
  private todos: TodoItem[] = [];

  /**
   * @constructor
   * Initializes the TodoListLogic with a repository instance.
   * @throws {Error} If the repository is not initialized.
   */
  constructor() {
    const repo = RepositoryFactory.getInstance().getCurrentRepository();
    if (!repo) {
      throw new Error('Repository must be initialized before creating TodoListLogic');
    }
    this.repository = repo;
  }

  /**
   * @async
   * Initializes the todo list by loading all todos from the repository.
   */
  async initialize(): Promise<void> {
    this.todos = await this.repository.getAll();
  }

  /**
   * @async
   * Adds a new todo to the list.
   * @param {string} newTodo The text of the new todo.
   * @returns {Promise<TodoItem[] | null>} The updated list of todos, or null if the input is invalid.
   */
  async addTodo(newTodo: string): Promise<TodoItem[] | null> {
    if (newTodo.trim() === '') {
      return null;
    }
    const todo = new TodoItem(0, newTodo);
    this.todos = [...this.todos, todo];
    this.todos = await this.repository.save(this.todos);
    return this.todos;
  }

  /**
   * Deletes a todo from the list.
   * @param {number} id The ID of the todo to delete.
   * @returns {Promise<TodoItem[]>} The updated list of todos.
   */
  deleteTodo(id: number): Promise<TodoItem[]> {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return this.repository.save(this.todos);
  }

  /**
   * Toggles the completion status of a todo.
   * @param {number} id The ID of the todo to toggle.
   * @returns {Promise<TodoItem[]>} The updated list of todos.
   */
  toggleComplete(id: number): Promise<TodoItem[]> {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? new TodoItem(todo.id, todo.text, !todo.completed) : todo
    );
    return this.repository.save(this.todos);
  }

  /**
   * @async
   * Edits a todo in the list.
   * @param {number} id The ID of the todo to edit.
   * @param {string} text The new text of the todo.
   * @returns {Promise<TodoItem[] | null>} The updated list of todos, or null if the input is invalid.
   */
  async editTodo(id: number, text: string): Promise<TodoItem[] | null> {
    if (text.trim() === '') {
    return Promise.resolve(null);
  }
  this.todos = this.todos.map((todo) =>
    todo.id === id ? new TodoItem(todo.id, text, todo.completed) : todo
  );
  this.todos = await this.repository.save(this.todos);
  return this.todos;
}

  /**
   * Gets the list of todos.
   * @returns {TodoItem[]} The list of todos.
   */
  getTodos(): TodoItem[] {
    return this.todos;
  }
}
