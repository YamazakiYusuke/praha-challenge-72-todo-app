import { useAuth0 } from "@auth0/auth0-react";
import { AppBar, Box, Toolbar, Typography } from '@mui/material';
import React from 'react';
import './App.css';
import LoginButton from './components/LoginButton.tsx';
import LogoutButton from './components/LogoutButton.tsx';
import TodoList from './TodoList.tsx';

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Todo App
          </Typography>
          {isAuthenticated ? <LogoutButton /> : <LoginButton />}
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 3 }}>
        {isAuthenticated && <TodoList />}
      </Box>
    </div>
  );
}

export default App;
