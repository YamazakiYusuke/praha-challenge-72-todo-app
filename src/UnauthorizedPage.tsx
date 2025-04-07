import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';

const UnauthorizedPage = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

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

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          color: '#555',
          marginBottom: 2
        }}
      >
        このページはログインしていないとリダイレクトされます
      </Typography>
      {!isAuthenticated ? (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: '#666',
          }}
        >
          3秒後にログインページに移動します...
        </Typography>
      ) : (
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: '#666',
          }}
        >
          あなたはログイン済みなのでリダイレクトされません
        </Typography>
      )}
    </Box>
  );
};

export default UnauthorizedPage; 