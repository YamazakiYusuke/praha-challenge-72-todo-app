import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Button, Checkbox, ClickAwayListener, Container, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import TodoListLogic from './TodoListLogic.ts';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  maxWidth: 400,
}));

function TodoList() {
  const [todos, setTodos] = useState<Array<{ id: number; text: string; completed: boolean }>>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  const todoListLogic = useRef(new TodoListLogic()).current;

  useEffect(() => {
    const initializeTodos = async () => {
      await todoListLogic.initialize();
      setTodos(todoListLogic.getTodos());
    };
    initializeTodos();
  }, []);

  useEffect(() => {
    if (editingTodoId !== null && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [editingTodoId]);

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

  const handleDeleteTodo = (id: number) => {
    todoListLogic.deleteTodo(id);
    setTodos(todoListLogic.getTodos());
  };

  const handleToggleComplete = (id: number) => {
    todoListLogic.toggleComplete(id);
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
        <TextField
          fullWidth
          label="Add Todo"
          value={newTodo}
          onChange={handleInputChange}
          margin="normal"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleAddTodo();
            }
          }}
        />
        <Button variant="contained" color="primary" onClick={handleAddTodo}>
          Add
        </Button>
        <List>
          {[
            ...todos.filter((todo) => !todo.completed),
            ...todos.filter((todo) => todo.completed),
          ].map((todo) => (
            <ListItem
              key={todo.id}
              secondaryAction={
                <div>
                  {editingTodoId !== todo.id ? (
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditTodo(todo.id, todo.text)}
                    >
                      <EditIcon />
                    </IconButton>
                  ) : null}
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTodo(todo.id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              }
            >
              <ListItemIcon>
                <Checkbox
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo.id)}
                />
              </ListItemIcon>
              {editingTodoId === todo.id ? (
                <ClickAwayListener onClickAway={() => handleCancelEdit()}>
                  <TextField
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveTodo(todo.id);
                      }
                    }}
                    inputRef={textFieldRef}
                  />
                </ClickAwayListener>
              ) : (
                <ListItemText
                  primary={todo.text}
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888888' : 'inherit'
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    </Container>
  );
}

export default TodoList;
