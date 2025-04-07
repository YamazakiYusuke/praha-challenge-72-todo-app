import { useAuth0 } from "@auth0/auth0-react";
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

const UserProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">
          ログインが必要です
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: 3,
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user.picture}
              alt={user.name}
              sx={{ width: 100, height: 100 }}
            />
            <Typography variant="h5" gutterBottom>
              プロフィール情報
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>名前:</strong> {user.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>メールアドレス:</strong> {user.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>メール認証:</strong> {user.email_verified ? '済み' : '未認証'}
              </Typography>
              <Typography variant="body1">
                <strong>最終更新:</strong> {new Date(user.updated_at ?? '').toLocaleString('ja-JP')}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfilePage; 