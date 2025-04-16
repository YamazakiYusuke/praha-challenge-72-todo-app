import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import LoginButton from './LoginButton.tsx';
import LogoutButton from './LogoutButton.tsx';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * アプリケーションの共通レイアウトを提供するコンポーネント
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, navigate } = useAuth();

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{ mr: 2, cursor: 'pointer' }}
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
        {children}
      </Box>
    </div>
  );
};

export default Layout; 