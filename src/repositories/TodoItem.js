class TodoItem {
  constructor(id, text, completed = false) {
    this.id = id;
    this.text = text;
    this.completed = completed;
  }

  static fromJSON(json) {
    return new TodoItem(json.id, json.text, json.completed);
  }

  toJSON() {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed
    };
  }
}

export default TodoItem; 