import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Box, Button, CircularProgress, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import LoginButton from './components/LoginButton.tsx';
import LogoutButton from './components/LogoutButton.tsx';
import { syncUserWithSupabase } from './lib/auth.ts';
import ITodoRepository from './repositories/ITodoRepository';
import RepositoryFactory from './repositories/RepositoryFactory.tsx';
import TodoList from './TodoList.tsx';
import UnauthorizedPage from './UnauthorizedPage.tsx';
import UserProfilePage from './UserProfilePage.tsx';

function App() {
  const { isAuthenticated, user, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<ITodoRepository | null>(null);
  const [repoLoading, setRepoLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      const redirectToLogin = async () => {
        await loginWithRedirect({
          appState: { returnTo: window.location.pathname }
        });
      };

      const timer = setTimeout(() => {
        redirectToLogin();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loginWithRedirect]);

  useEffect(() => {
    async function setupAuth() {
      if (isAuthenticated && user) {
        try {
          await syncUserWithSupabase(user);
          const repo = await RepositoryFactory.getInstance().createTodoRepository(user);
          setRepository(repo);
        } catch (error) {
          console.error('Authentication error:', error);
        } finally {
          setRepoLoading(false);
        }
      } else if (!isLoading) {
        const repo = await RepositoryFactory.getInstance().createTodoRepository();
        setRepository(repo);
        setRepoLoading(false);
      }
    }

    setupAuth();
  }, [isAuthenticated, user, isLoading]);

  if (isLoading || (isAuthenticated && repoLoading)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        sx={{ bgcolor: 'background.default' }}
      >
        <CircularProgress color="primary" size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          読み込み中...
        </Typography>
      </Box>
    );
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Todo App
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          {isAuthenticated && (
            <Button
              color="inherit"
              onClick={() => navigate('/profile')}
              sx={{ mr: 2 }}
            >
              プロフィール
            </Button>
          )}

          <Button
            color="inherit"
            onClick={() => navigate('/unauthorized')}
            sx={{ mr: 2 }}
          >
            認証確認ページ
          </Button>

          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 3 }}>
        <Routes>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/" element={repository && <TodoList />} />
        </Routes>
      </Box>
    </div>
  );
}

export default App;
