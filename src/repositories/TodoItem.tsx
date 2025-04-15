class TodoItem {
  constructor(
    public id: number,
    public text: string,
    public completed: boolean = false,
    public userId?: string,
    public createdAt?: string
  ) { }

  static fromJSON(json: {
    id: number;
    text: string;
    completed: boolean;
    user_id?: string;
    created_at?: string;
  }): TodoItem {
    return new TodoItem(
      json.id,
      json.text,
      json.completed,
      json.user_id,
      json.created_at
    );
  }

  toJSON(): {
    id: number;
    text: string;
    completed: boolean;
    user_id?: string;
    created_at?: string;
  } {
    return {
      id: this.id,
      text: this.text,
      completed: this.completed,
      user_id: this.userId,
      created_at: this.createdAt
    };
  }
}

export default TodoItem; 