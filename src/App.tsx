import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import LoginButton from './components/LoginButton.tsx';
import LogoutButton from './components/LogoutButton.tsx';
import TodoList from './TodoList.tsx';
import UnauthorizedPage from './UnauthorizedPage.tsx';
import UserProfilePage from './UserProfilePage.tsx';

function App() {
  const { isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      const redirectToLogin = async () => {
        await loginWithRedirect({
          appState: { returnTo: window.location.pathname }
        });
      };

      // 3秒後にログインページにリダイレクト
      const timer = setTimeout(() => {
        redirectToLogin();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loginWithRedirect]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
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
          <Route path="/" element={<TodoList />} />
        </Routes>
      </Box>
    </div>
  );
}

export default App;
