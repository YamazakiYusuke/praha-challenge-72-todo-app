class TodoListLogic {
  constructor() {
    this.todos = [];
  }

  addTodo(newTodo) {
    if (newTodo.trim() === '') {
      return null;
    }
    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };
    this.todos = [...this.todos, todo];
    return todo;
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return this.todos;
  }

  toggleComplete(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    return this.todos;
  }

  editTodo(id, text) {
    if (text.trim() === '') {
      return null;
    }
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, text: text } : todo
    );
    return this.todos;
  }

  getTodos() {
    return this.todos;
  }
}

export default TodoListLogic;
