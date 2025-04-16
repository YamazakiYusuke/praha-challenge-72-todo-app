import { Button, TextField } from '@mui/material';
import React, { ChangeEvent } from 'react';

interface TodoFormProps {
  newTodo: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}

/**
 * 新しいTodoを追加するためのフォームコンポーネント
 */
const TodoForm: React.FC<TodoFormProps> = ({ newTodo, onInputChange, onAdd }) => {
  return (
    <>
      <TextField
        fullWidth
        label="Add Todo"
        value={newTodo}
        onChange={onInputChange}
        margin="normal"
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onAdd();
          }
        }}
      />
      <Button variant="contained" color="primary" onClick={onAdd}>
        Add
      </Button>
    </>
  );
};

export default TodoForm; 