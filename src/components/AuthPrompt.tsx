import { Alert, Box, Button } from '@mui/material';
import React from 'react';
import { useAuth } from '../hooks/useAuth.ts';

/**
 * 未認証ユーザーに対してログインを促すプロンプトコンポーネント
 */
const AuthPrompt: React.FC = () => {
  const { loginWithRedirect, showRedirectPrompt } = useAuth();

  if (!showRedirectPrompt) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: 500 }}>
      <Alert
        severity="info"
        action={
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={loginWithRedirect}
          >
            ログイン
          </Button>
        }
      >
        ログインすると、Todoリストを保存できるようになります
      </Alert>
    </Box>
  );
};

export default AuthPrompt; 