import TodoListLogic from './TodoListLogic';
import type ITodoRepository from './repositories/ITodoRepository';
import TodoItem from './repositories/TodoItem';

// モックの設定
jest.mock('./repositories/TodoRepository');

describe('TodoListLogic', () => {
  let todoListLogic: TodoListLogic;
  let mockRepository: ITodoRepository & {
    save: jest.Mock<TodoItem[], [TodoItem[]]>;
    getAll: jest.Mock<TodoItem[], []>;
  };

  beforeEach(() => {
    // モックリポジトリの作成
    mockRepository = {
      save: jest.fn().mockImplementation((todos: TodoItem[]) => todos),
      getAll: jest.fn().mockReturnValue([])
    };

    // DIを使用してモックリポジトリを注入
    todoListLogic = new TodoListLogic(mockRepository);
  });

  describe('addTodo', () => {
    it('should add a valid todo', () => {
      // Arrange
      const newTodoText: string = 'Test todo';
      const expectedTodo: Partial<TodoItem> = {
        id: expect.any(Number),
        text: newTodoText,
        completed: false
      };

      // Act
      const result: TodoItem[] | null = todoListLogic.addTodo(newTodoText);

      // Assert
      expect(result).toEqual([expectedTodo]);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should not add empty todo', () => {
      // Arrange
      const emptyTodoText = '  ';

      // Act
      const result = todoListLogic.addTodo(emptyTodoText);

      // Assert
      expect(result).toBeNull();
      expect(todoListLogic.getTodos()).toHaveLength(0);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      // Arrange
      const todos = todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');
      const todoId = todos[0].id;

      mockRepository.save.mockImplementation(() => []);

      // Act
      const result = todoListLogic.deleteTodo(todoId);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', () => {
      // Arrange
      const todos = todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');
      const todo = todos[0];

      const updatedTodo = new TodoItem(todo.id, todo.text, true);
      mockRepository.save.mockReturnValue([updatedTodo]);

      // Act
      const result = todoListLogic.toggleComplete(todo.id);

      // Assert
      expect(result[0].completed).toBe(true);
    });
  });

  describe('editTodo', () => {
    it('should edit a todo with valid text', () => {
      // Arrange
      const todos = todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');
      const todo = todos[0];
      const newText = 'Edited todo';

      const updatedTodo = new TodoItem(todo.id, newText, todo.completed);
      mockRepository.save.mockReturnValue([updatedTodo]);

      // Act
      const result = todoListLogic.editTodo(todo.id, newText);

      // Assert
      expect(result?.[0].text).toBe(newText);
    });

    it('should not edit todo with empty text', () => {
      // Arrange
      const todos = todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');
      const todo = todos[0];
      const emptyText = '  ';

      // Act
      const result = todoListLogic.editTodo(todo.id, emptyText);

      // Assert
      expect(result).toBeNull();
      expect(todoListLogic.getTodos()[0].text).toBe('Test todo');
    });
  });
});
