import TodoListLogic from './TodoListLogic';
import type ITodoRepository from './repositories/ITodoRepository';
import TodoItem from './repositories/TodoItem.tsx';

// モックの設定
jest.mock('./repositories/TodoRepository');

describe('TodoListLogic', () => {
  let todoListLogic: TodoListLogic;
  let mockRepository: ITodoRepository & {
    save: jest.Mock<Promise<TodoItem[]>, [TodoItem[]]>;
    getAll: jest.Mock<Promise<TodoItem[]>, []>;
  };

  beforeEach(async () => {
    // Arrange
    mockRepository = {
      save: jest.fn().mockResolvedValue([]),
      getAll: jest.fn().mockResolvedValue([])
    };
    todoListLogic = new TodoListLogic(mockRepository);
    await todoListLogic.initialize();
  });

  describe('addTodo', () => {
    it('should add a valid todo', async () => {
      // Arrange
      const newTodoText = 'Test todo';
      const expectedTodo: Partial<TodoItem> = {
        id: expect.any(Number),
        text: newTodoText,
        completed: false
      };
      mockRepository.save.mockResolvedValue([expectedTodo as TodoItem]);

      // Act
      const result = await todoListLogic.addTodo(newTodoText);

      // Assert
      expect(result).toEqual([expectedTodo]);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining(expectedTodo)
      ]));
    });

    it('should not add empty todo', async () => {
      // Arrange
      const emptyTodoText = '  ';

      // Act
      const result = await todoListLogic.addTodo(emptyTodoText);

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(todoListLogic.getTodos()).toHaveLength(0);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      // Arrange
      const initialTodo = new TodoItem(1, 'Test todo');
      mockRepository.save.mockResolvedValueOnce([initialTodo]);
      const todos = await todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');
      mockRepository.save.mockResolvedValue([]);

      // Act
      const result = await todoListLogic.deleteTodo(initialTodo.id);

      // Assert
      expect(result).toHaveLength(0);
      expect(mockRepository.save).toHaveBeenCalledWith([]);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', async () => {
      // Arrange
      const initialTodo = new TodoItem(1, 'Test todo', false);
      mockRepository.save.mockResolvedValueOnce([initialTodo]);
      const todos = await todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');

      const expectedTodo = new TodoItem(initialTodo.id, initialTodo.text, true);
      mockRepository.save.mockResolvedValue([expectedTodo]);

      // Act
      const result = await todoListLogic.toggleComplete(initialTodo.id);

      // Assert
      expect(result[0].completed).toBe(true);
      expect(mockRepository.save).toHaveBeenCalledWith([
        expect.objectContaining({ completed: true })
      ]);
    });
  });

  describe('editTodo', () => {
    it('should edit a todo with valid text', async () => {
      // Arrange
      const initialTodo = new TodoItem(1, 'Test todo');
      mockRepository.save.mockResolvedValueOnce([initialTodo]);
      const todos = await todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');

      const newText = 'Edited todo';
      const expectedTodo = new TodoItem(initialTodo.id, newText, initialTodo.completed);
      mockRepository.save.mockResolvedValue([expectedTodo]);

      // Act
      const result = await todoListLogic.editTodo(initialTodo.id, newText);

      // Assert
      expect(result?.[0].text).toBe(newText);
      expect(mockRepository.save).toHaveBeenCalledWith([
        expect.objectContaining({ text: newText })
      ]);
    });

    it('should not edit todo with empty text', async () => {
      // Arrange
      const initialTodo = new TodoItem(1, 'Test todo');
      mockRepository.save.mockResolvedValueOnce([initialTodo]);
      const todos = await todoListLogic.addTodo('Test todo');
      if (!todos) throw new Error('Failed to add todo');
      const emptyText = '  ';

      // Act
      const result = await todoListLogic.editTodo(initialTodo.id, emptyText);

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(todoListLogic.getTodos()[0].text).toBe('Test todo');
    });
  });
});
