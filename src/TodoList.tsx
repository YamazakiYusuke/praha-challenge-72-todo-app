import { Box, Button, Container, Paper, Skeleton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import TodoForm from './components/todo/TodoForm.tsx';
import TodoItems from './components/todo/TodoItems.tsx';
import { useAuth } from './hooks/useAuth.ts';
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  const { repository } = useAuth();
  const todoListLogicRef = useRef<TodoListLogic | null>(null);

  // TodoListLogicの初期化
  useEffect(() => {
    let isMounted = true;
    const initializeLogic = async () => {
      try {
        if (!repository) {
          if (isMounted) setInitError("リポジトリが初期化されていません。再読み込みしてください。");
          return;
        }

        // TodoListLogicの作成をトライ
        try {
          todoListLogicRef.current = new TodoListLogic();
          await todoListLogicRef.current.initialize();
          if (isMounted) {
            setTodos(todoListLogicRef.current.getTodos());
            setInitError(null);
          }
        } catch (error) {
          console.error('TodoListLogic initialization error:', error);
          if (isMounted) setInitError("TodoListの初期化に失敗しました。再読み込みしてください。");
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    setIsInitializing(true);
    const timerId = setTimeout(initializeLogic, 500); // 少し遅延させて実行

    return () => {
      isMounted = false;
      clearTimeout(timerId);
    };
  }, [repository]);

  // リポジトリが利用可能でない場合
  if (initError) {
    return (
      <Container maxWidth="sm">
        <StyledPaper>
          <Box p={2} textAlign="center">
            <Typography color="error" variant="body1" gutterBottom>
              {initError}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              再読み込み
            </Button>
          </Box>
        </StyledPaper>
      </Container>
    );
  }

  // 初期化中
  if (isInitializing) {
    return (
      <Container maxWidth="sm">
        <StyledPaper>
          <Box p={2}>
            {/* TodoForm skeleton */}
            <Box mb={2}>
              <Skeleton variant="rectangular" height={56} width="100%" />
            </Box>

            {/* TodoItems skeleton */}
            {[1, 2, 3].map((item) => (
              <Box key={item} mb={1} display="flex" alignItems="center">
                <Skeleton variant="rectangular" height={40} width="100%" />
              </Box>
            ))}
          </Box>
        </StyledPaper>
      </Container>
    );
  }

  // TodoListLogicが初期化されていない場合は操作できないようにする
  if (!todoListLogicRef.current) {
    return (
      <Container maxWidth="sm">
        <StyledPaper>
          <Typography variant="body1" align="center" p={2}>
            Todoリストを読み込めませんでした。
          </Typography>
        </StyledPaper>
      </Container>
    );
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleAddTodo = async () => {
    if (!todoListLogicRef.current) return;
    const result = await todoListLogicRef.current.addTodo(newTodo);
    if (result) {
      setTodos(todoListLogicRef.current.getTodos());
      setNewTodo('');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    if (!todoListLogicRef.current) return;
    await todoListLogicRef.current.deleteTodo(id);
    setTodos(todoListLogicRef.current.getTodos());
  };

  const handleToggleComplete = async (id: number) => {
    if (!todoListLogicRef.current) return;
    await todoListLogicRef.current.toggleComplete(id);
    setTodos(todoListLogicRef.current.getTodos());
  };

  const handleEditTodo = (id: number, text: string) => {
    setEditingTodoId(id);
    setEditText(text);
  };

  const handleSaveTodo = async (id: number) => {
    if (!todoListLogicRef.current) return;
    const result = await todoListLogicRef.current.editTodo(id, editText);
    if (result) {
      setTodos(todoListLogicRef.current.getTodos());
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
