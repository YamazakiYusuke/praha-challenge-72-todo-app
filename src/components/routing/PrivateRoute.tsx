import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * 認証済みユーザーのみがアクセスできるルートを提供するコンポーネント
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, repoLoading } = useAuth();

  // 読み込み中はローディング表示
  if (isLoading || repoLoading) {
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

  // 未認証の場合はリダイレクト（useAuthのリダイレクト処理が動くまでの間）
  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" />;
  }

  // 認証済みの場合は子コンポーネントを表示
  return <>{children}</>;
};

export default PrivateRoute; 