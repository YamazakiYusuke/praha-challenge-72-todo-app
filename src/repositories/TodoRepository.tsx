// import ITodoRepository from './ITodoRepository';
// import TodoItem from './TodoItem.tsx';

// class TodoRepository implements ITodoRepository {
//   private baseUrl: string;

//   constructor() {
//     this.baseUrl = '/api';
//   }

//   async getAll(): Promise<TodoItem[]> {
//     const response = await fetch(`${this.baseUrl}/todos`);
//     const todos = await response.json();
//     return todos.map(todo => TodoItem.fromJSON(todo));
//   }

//   async save(todos: TodoItem[]): Promise<TodoItem[]> {
//     const response = await fetch(`${this.baseUrl}/todos`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(todos.map(todo => todo.toJSON())),
//     });
//     const savedTodos = await response.json();
//       return savedTodos.map(todo => TodoItem.fromJSON(todo));
//     } else {
//       return [TodoItem.fromJSON(savedTodos)];
//     }
//   }
// }

// export default TodoRepository; 