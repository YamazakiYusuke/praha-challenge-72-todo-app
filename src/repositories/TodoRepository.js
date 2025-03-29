import ITodoRepository from './ITodoRepository';
import TodoItem from './TodoItem';

class TodoRepository extends ITodoRepository {
  constructor() {
    super();
    this.storageKey = 'todos';
  }

  getAll() {
    const todos = localStorage.getItem(this.storageKey);
    if (!todos) return [];
    return JSON.parse(todos).map(todo => TodoItem.fromJSON(todo));
  }

  save(todos) {
    const jsonTodos = todos.map(todo => todo.toJSON());
    localStorage.setItem(this.storageKey, JSON.stringify(jsonTodos));
    return todos;
  }
}

export default TodoRepository; 