import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RepositoryFactory from '../composables/RepositoryFactory.tsx';
import { syncUserWithSupabase } from '../lib/auth.ts';
import ITodoRepository from '../repositories/ITodoRepository.tsx';

/**
 * カスタムフック：認証とリポジトリの初期化を担当
 */
export const useAuth = () => {
  const { isAuthenticated, user, loginWithRedirect, isLoading } = useAuth0();
  const navigate = useNavigate();
  const [repository, setRepository] = useState<ITodoRepository | null>(null);
  const [repoLoading, setRepoLoading] = useState(true);

  // 未認証ユーザーをログインページにリダイレクト
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const redirectToLogin = async () => {
        await loginWithRedirect({
          appState: { returnTo: window.location.pathname }
        });
      };

      const timer = setTimeout(() => {
        redirectToLogin();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loginWithRedirect, isLoading]);

  // 認証後のリポジトリ初期化
  useEffect(() => {
    async function setupAuth() {
      if (isAuthenticated && user) {
        try {
          await syncUserWithSupabase(user);
          const repo = await RepositoryFactory.getInstance().createTodoRepository(user);
          setRepository(repo);
        } catch (error) {
          console.error('Authentication error:', error);
        } finally {
          setRepoLoading(false);
        }
      } else if (!isLoading && isAuthenticated) {
        const repo = await RepositoryFactory.getInstance().createTodoRepository();
        setRepository(repo);
        setRepoLoading(false);
      } else if (!isLoading && !isAuthenticated) {
        setRepoLoading(false);
      }
    }

    setupAuth();
  }, [isAuthenticated, user, isLoading]);

  return {
    isAuthenticated,
    user,
    loginWithRedirect,
    isLoading,
    repository,
    repoLoading,
    navigate
  };
}; 