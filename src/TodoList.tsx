import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Button, Checkbox, ClickAwayListener, Container, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    if (editingTodoId !== null && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [editingTodoId]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleEditTodo = (id: number, text: string) => {
    setEditingTodoId(id);
    setEditText(text);
  };

  const handleSaveTodo = (id: number) => {
    if (editText.trim() !== '') {
      setTodos(
        todos.map((todo) => (todo.id === id ? { ...todo, text: editText } : todo))
      );
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
          {todos.map((todo) => (
            <ListItem key={todo.id}>
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
                  style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
                />
              )}
              <ListItemSecondaryAction>
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
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </StyledPaper>
    </Container>
  );
}

export default TodoList;
