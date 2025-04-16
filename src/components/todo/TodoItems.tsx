import { List } from '@mui/material';
import React from 'react';
import TodoItem from './TodoItem.tsx';

interface TodoItemsProps {
  todos: Array<{ id: number; text: string; completed: boolean }>;
  editingTodoId: number | null;
  editText: string;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void; 
  onEdit: (id: number, text: string) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onEditTextChange: (text: string) => void;
}

/**
 * Todoアイテムのリストを表示するコンポーネント
 */
const TodoItems: React.FC<TodoItemsProps> = ({
  todos,
  editingTodoId,
  editText,
  onToggleComplete,
  onDelete,
  onEdit,
  onSave,
  onCancel,
  onEditTextChange
}) => {
  // 未完了のTodoを上部に、完了済みのTodoを下部に表示
  const sortedTodos = [
    ...todos.filter((todo) => !todo.completed),
    ...todos.filter((todo) => todo.completed)
  ];

  return (
    <List>
      {sortedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          isEditing={editingTodoId === todo.id}
          editText={editText}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onEditTextChange={onEditTextChange}
        />
      ))}
    </List>
  );
};

export default TodoItems; 