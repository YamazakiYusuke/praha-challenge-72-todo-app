import TodoListLogic from './TodoListLogic';

describe('TodoListLogic', () => {
  let todoListLogic;

  beforeEach(() => {
    todoListLogic = new TodoListLogic();
  });

  describe('addTodo', () => {
    it('should add a valid todo', () => {
      const result = todoListLogic.addTodo('Test todo');
      expect(result).toEqual({
        id: expect.any(Number),
        text: 'Test todo',
        completed: false
      });
      expect(todoListLogic.getTodos()).toHaveLength(1);
    });

    it('should not add empty todo', () => {
      const result = todoListLogic.addTodo('  ');
      expect(result).toBeNull();
      expect(todoListLogic.getTodos()).toHaveLength(0);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const todo = todoListLogic.addTodo('Test todo');
      const result = todoListLogic.deleteTodo(todo.id);
      expect(result).toHaveLength(0);
    });
  });

  describe('toggleComplete', () => {
    it('should toggle todo completion status', () => {
      const todo = todoListLogic.addTodo('Test todo');
      const result = todoListLogic.toggleComplete(todo.id);
      expect(result[0].completed).toBe(true);
    });
  });

  describe('editTodo', () => {
    it('should edit a todo with valid text', () => {
      const todo = todoListLogic.addTodo('Test todo');
      const result = todoListLogic.editTodo(todo.id, 'Edited todo');
      expect(result[0].text).toBe('Edited todo');
    });

    it('should not edit todo with empty text', () => {
      const todo = todoListLogic.addTodo('Test todo');
      const result = todoListLogic.editTodo(todo.id, '  ');
      expect(result).toBeNull();
      expect(todoListLogic.getTodos()[0].text).toBe('Test todo');
    });
  });
});
