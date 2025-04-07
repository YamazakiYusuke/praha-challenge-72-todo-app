class TodoItem {
  constructor(
    public id: number,
    public text: string,
    public completed: boolean = false
  ) { }

  static fromJSON(json: { id: number; text: string; completed: boolean }): TodoItem {
    return new TodoItem(json.id, json.text, json.completed);
  }

  toJSON(): { id: number; text: string; completed: boolean } {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed
    };
  }
}

export default TodoItem; 