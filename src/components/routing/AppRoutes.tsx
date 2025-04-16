import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TodoList from '../../TodoList.tsx';
import UnauthorizedPage from '../../UnauthorizedPage.tsx';
import UserProfilePage from '../../UserProfilePage.tsx';
import { useAuth } from '../../hooks/useAuth.ts';
import PrivateRoute from './PrivateRoute.tsx';

/**
 * アプリケーションのルーティングを管理するコンポーネント
 */
const AppRoutes: React.FC = () => {
  const { repository } = useAuth();

  return (
    <Routes>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <UserProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            {repository && <TodoList />}
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 