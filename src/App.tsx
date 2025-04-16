import React from 'react';
import './App.css';
import Layout from './components/Layout.tsx';
import AppRoutes from './components/routing/AppRoutes.tsx';

/**
 * アプリケーションのルートコンポーネント
 * 認証ロジックはuseAuthフックに抽出し、ルーティングはAppRoutesコンポーネントに分離
 */
function App() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
