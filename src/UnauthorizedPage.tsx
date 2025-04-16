import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const UnauthorizedPage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        padding: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          color: '#555',
          marginBottom: 4
        }}
      >
        {isAuthenticated
          ? 'ようこそ、認証済みユーザーさん！'
          : 'このページは認証についての情報を提供します'}
      </Typography>

      {!isAuthenticated ? (
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#666',
              mb: 3
            }}
          >
            ログインすると、以下の機能を利用できます：
          </Typography>
          <Box sx={{ textAlign: 'left', mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>✓ Todoリストを保存する</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>✓ デバイス間でTodoを同期する</Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>✓ プロフィール情報を管理する</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            ログインする
          </Button>
        </Box>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: '#666',
          }}
        >
          あなたは既にログインしています。アプリケーションの全ての機能を利用できます。
        </Typography>
      )}
    </Box>
  );
};

export default UnauthorizedPage;