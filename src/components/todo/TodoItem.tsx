import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Checkbox, ClickAwayListener, IconButton, ListItem, ListItemIcon, ListItemText, TextField } from '@mui/material';
import React, { useEffect, useRef } from 'react';

interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  isEditing: boolean;
  editText: string;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, text: string) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onEditTextChange: (text: string) => void;
}

/**
 * 個々のTodoアイテムを表示するコンポーネント
 */
const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  isEditing,
  editText,
  onToggleComplete,
  onDelete,
  onEdit,
  onSave,
  onCancel,
  onEditTextChange
}) => {
  const textFieldRef = useRef<HTMLInputElement>(null);

  // 編集モードになったら入力フィールドにフォーカス
  useEffect(() => {
    if (isEditing && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [isEditing]);

  return (
    <ListItem
      secondaryAction={
        <div>
          {!isEditing ? (
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => onEdit(id, text)}
            >
              <EditIcon />
            </IconButton>
          ) : null}
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => onDelete(id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      }
    >
      <ListItemIcon>
        <Checkbox
          checked={completed}
          onChange={() => onToggleComplete(id)}
        />
      </ListItemIcon>
      {isEditing ? (
        <ClickAwayListener onClickAway={onCancel}>
          <TextField
            fullWidth
            value={editText}
            onChange={(e) => onEditTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSave(id);
              }
            }}
            inputRef={textFieldRef}
          />
        </ClickAwayListener>
      ) : (
        <ListItemText
          primary={text}
          style={{
            textDecoration: completed ? 'line-through' : 'none',
            color: completed ? '#888888' : 'inherit'
          }}
        />
      )}
    </ListItem>
  );
};

export default TodoItem; 