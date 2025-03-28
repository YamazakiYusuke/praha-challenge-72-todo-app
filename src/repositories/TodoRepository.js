class TodoRepository {
  constructor() {
    this.storageKey = 'todos';
  }

  getAll() {
    const todos = localStorage.getItem(this.storageKey);
    return todos ? JSON.parse(todos) : [];
  }

  save(todos) {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
    return todos;
  }
}

export default TodoRepository; 