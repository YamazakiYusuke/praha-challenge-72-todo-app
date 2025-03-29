import TodoListLogic from './TodoListLogic';
import TodoRepository from './repositories/TodoRepository';

// モックの設定
jest.mock('./repositories/TodoRepository');

describe('TodoListLogic', () => {
  let todoListLogic;
  let mockRepository;

  beforeEach(() => {
    // モックをクリアして再設定
    jest.clearAllMocks();
    mockRepository = {
      storageKey: 'todos',
      save: jest.fn().mockImplementation(todos => todos),
      getAll: jest.fn().mockReturnValue([])
    };
    TodoRepository.prototype = mockRepository;

    todoListLogic = new TodoListLogic();
  });

  describe('addTodo', () => {
    it('should add a valid todo', () => {
      // Arrange
      const newTodoText = 'Test todo';
      const expectedTodo = {
        id: expect.any(Number),
        text: newTodoText,
        completed: false
      };

      // Act
      const result = todoListLogic.addTodo(newTodoText);

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
      mockRepository.save.mockImplementation(() => []);
      const todo = todoListLogic.addTodo('Test todo');

      // Act
      const result = todoListLogic.deleteTodo(todo.id);

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', () => {
      // Arrange
      mockRepository.save.mockImplementation(todos => todos);
      const todo = todoListLogic.addTodo('Test todo');
      const updatedTodo = { ...todo[0], completed: true };
      mockRepository.save.mockReturnValue([updatedTodo]);

      // Act
      const result = todoListLogic.toggleComplete(todo[0].id);

      // Assert
      expect(result[0].completed).toBe(true);
    });
  });

  describe('editTodo', () => {
    it('should edit a todo with valid text', () => {
      // Arrange
      mockRepository.save.mockImplementation(todos => todos);
      const todo = todoListLogic.addTodo('Test todo');
      const newText = 'Edited todo';
      const updatedTodo = { ...todo[0], text: newText };
      mockRepository.save.mockReturnValue([updatedTodo]);

      // Act
      const result = todoListLogic.editTodo(todo[0].id, newText);

      // Assert
      expect(result[0].text).toBe(newText);
    });

    it('should not edit todo with empty text', () => {
      // Arrange
      const todo = todoListLogic.addTodo('Test todo');
      const emptyText = '  ';

      // Act
      const result = todoListLogic.editTodo(todo.id, emptyText);

      // Assert
      expect(result).toBeNull();
      expect(todoListLogic.getTodos()[0].text).toBe('Test todo');
    });
  });
});
