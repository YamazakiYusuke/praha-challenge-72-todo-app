import { Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import TodoForm from './components/todo/TodoForm.tsx';
import TodoItems from './components/todo/TodoItems.tsx';
import TodoListLogic from './TodoListLogic.ts';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  maxWidth: 400,
}));

/**
 * Todoリスト管理コンポーネント
 */
function TodoList() {
  const [todos, setTodos] = useState<Array<{ id: number; text: string; completed: boolean }>>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const todoListLogic = useRef(new TodoListLogic()).current;

  useEffect(() => {
    const initializeTodos = async () => {
      await todoListLogic.initialize();
      setTodos(todoListLogic.getTodos());
    };
    initializeTodos();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    const result = await todoListLogic.addTodo(newTodo);
    if (result) {
      setTodos(todoListLogic.getTodos());
      setNewTodo('');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    await todoListLogic.deleteTodo(id);
    setTodos(todoListLogic.getTodos());
  };

  const handleToggleComplete = async (id: number) => {
    await todoListLogic.toggleComplete(id);
    setTodos(todoListLogic.getTodos());
  };

  const handleEditTodo = (id: number, text: string) => {
    setEditingTodoId(id);
    setEditText(text);
  };

  const handleSaveTodo = async (id: number) => {
    const result = await todoListLogic.editTodo(id, editText);
    if (result) {
      setTodos(todoListLogic.getTodos());
      setEditingTodoId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingTodoId(null);
    setEditText('');
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper>
        <TodoForm
          newTodo={newTodo}
          onInputChange={handleInputChange}
          onAdd={handleAddTodo}
        />
        <TodoItems
          todos={todos}
          editingTodoId={editingTodoId}
          editText={editText}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTodo}
          onEdit={handleEditTodo}
          onSave={handleSaveTodo}
          onCancel={handleCancelEdit}
          onEditTextChange={setEditText}
        />
      </StyledPaper>
    </Container>
  );
}

export default TodoList;
