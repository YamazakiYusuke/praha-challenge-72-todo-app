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
  const [showRedirectPrompt, setShowRedirectPrompt] = useState(false);

  // 未認証ユーザーに対する処理（リダイレクトプロンプトを表示）
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // ログインページへの自動リダイレクトは行わず、代わりにプロンプト表示状態をセット
      setShowRedirectPrompt(true);
      setRepoLoading(false); // 未認証の場合はローディング終了
    } else {
      setShowRedirectPrompt(false);
    }
  }, [isAuthenticated, isLoading]);

  // リダイレクト処理関数を定義
  const handleLogin = async () => {
    await loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };

  // 認証後のリポジトリ初期化
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    // 初期化をタイムアウトさせる関数
    const setupTimeout = () => {
      // 5秒後にローディング状態を強制終了
      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.log('Repository initialization timeout - forcing load completion');
          setRepoLoading(false);
        }
      }, 5000);
    };

    async function setupAuth() {
      try {
        if (isAuthenticated && user) {
          console.log('Setting up auth for user:', user.sub);
          setupTimeout(); // タイムアウト設定

          try {
            await syncUserWithSupabase(user);
            const repo = await RepositoryFactory.getInstance().createTodoRepository(user);

            if (isMounted) {
              setRepository(repo);
              setRepoLoading(false);
              if (timeoutId) clearTimeout(timeoutId);
            }
          } catch (error) {
            console.error('Authentication error:', error);
            if (isMounted) {
              // エラー発生時にもローディングを終了
              setRepoLoading(false);
              if (timeoutId) clearTimeout(timeoutId);
            }
          }
        } else if (!isLoading && isAuthenticated) {
          setupTimeout(); // タイムアウト設定
          const repo = await RepositoryFactory.getInstance().createTodoRepository();

          if (isMounted) {
            setRepository(repo);
            setRepoLoading(false);
            if (timeoutId) clearTimeout(timeoutId);
          }
        } else if (!isLoading && !isAuthenticated) {
          if (isMounted) {
            setRepoLoading(false);
          }
        }
      } catch (error) {
        console.error('Unexpected error in auth setup:', error);
        if (isMounted) {
          setRepoLoading(false);
        }
      }
    }

    setupAuth();

    // クリーンアップ関数
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAuthenticated, user, isLoading]);

  return {
    isAuthenticated,
    user,
    loginWithRedirect: handleLogin,
    isLoading,
    repository,
    repoLoading,
    navigate,
    showRedirectPrompt
  };
}; 