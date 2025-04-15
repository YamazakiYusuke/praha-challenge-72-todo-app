import TodoListLogic from './TodoListLogic';
import ITodoRepository from './repositories/ITodoRepository';
import TodoItem from './repositories/TodoItem';

// Mock the ITodoRepository
class MockTodoRepository implements ITodoRepository {
  private todos: TodoItem[] = [];

  async getAll(): Promise<TodoItem[]> {
    return this.todos;
  }

  async save(todos: TodoItem[]): Promise<TodoItem[]> {
    this.todos = todos;
    return this.todos;
  }

  async create(input: { text: string; }): Promise<TodoItem> {
    const newTodo = new TodoItem(this.todos.length + 1, input.text);
    this.todos.push(newTodo);
    return newTodo;
  }

  async update(todo: TodoItem): Promise<TodoItem> {
    const index = this.todos.findIndex((t) => t.id === todo.id);
    if (index > -1) {
      this.todos[index] = todo;
      return todo;
    }
    throw new Error('Todo not found');
  }

  async delete(id: number): Promise<void> {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }
}

describe('TodoListLogic', () => {
  let todoListLogic: TodoListLogic;
  let mockRepository: MockTodoRepository;

  beforeEach(() => {
    // Mock the supabase client
    jest.mock('./lib/supabase', () => ({
      supabase: {
        from: () => ({
          select: () => ({
            data: [],
            error: null,
          }),
        }),
      },
    }));

    mockRepository = new MockTodoRepository();
    // Override RepositoryFactory to use the mock repository
    jest.spyOn(require('./composables/RepositoryFactory.tsx').default, 'getInstance').mockImplementation(() => {
      return {
        getCurrentRepository: () => mockRepository,
      };
    });
    todoListLogic = new TodoListLogic();
  });

  it('should add a todo', async () => {
    const newTodoText = 'Test todo';
    const result = await todoListLogic.addTodo(newTodoText);
    expect(result).toEqual([new TodoItem(0, newTodoText)]);
  });

  it('should delete a todo', async () => {
    await todoListLogic.addTodo('Test todo');
    let todos = todoListLogic.getTodos();
    const idToDelete = todos[0].id;
    await todoListLogic.deleteTodo(idToDelete);
    todos = todoListLogic.getTodos();
    expect(todos.length).toBe(0);
  });

  it('should toggle complete a todo', async () => {
    await todoListLogic.addTodo('Test todo');
    let todos = todoListLogic.getTodos();
    const idToToggle = todos[0].id;
    await todoListLogic.toggleComplete(idToToggle);
    todos = todoListLogic.getTodos();
    expect(todos[0].completed).toBe(true);
  });

  it('should edit a todo', async () => {
    await todoListLogic.addTodo('Test todo');
    let todos = todoListLogic.getTodos();
    const idToEdit = todos[0].id;
    const newText = 'Edited todo';
    await todoListLogic.editTodo(idToEdit, newText);
    todos = todoListLogic.getTodos();
    expect(todos[0].text).toBe(newText);
  });

  it('should not add a todo if the text is empty', async () => {
    const result = await todoListLogic.addTodo('  ');
    expect(result).toBeNull();
  });

  it('should not edit a todo if the text is empty', async () => {
    await todoListLogic.addTodo('Test todo');
    let todos = todoListLogic.getTodos();
    const idToEdit = todos[0].id;
    const result = await todoListLogic.editTodo(idToEdit, '  ');
    expect(result).toBeNull();
  });
});
