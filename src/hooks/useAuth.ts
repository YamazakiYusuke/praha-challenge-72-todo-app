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
    async function setupAuth() {
      try {
        if (isAuthenticated && user) {
          console.log('Setting up authenticated user:', user.sub);

          try {
            // iOS向けにエラーハンドリングを強化
            await syncUserWithSupabase(user);
          } catch (syncError) {
            console.error('Error syncing with Supabase:', syncError);
            // エラーが発生しても処理を続行
          }

          try {
            const repo = await RepositoryFactory.getInstance().createTodoRepository(user);
            setRepository(repo);
          } catch (repoError) {
            console.error('Repository creation error:', repoError);
            // リポジトリの作成に失敗した場合でもフォールバックを試みる
            const fallbackRepo = await RepositoryFactory.getInstance().createTodoRepository();
            setRepository(fallbackRepo);
          }
        } else if (!isLoading && isAuthenticated) {
          const repo = await RepositoryFactory.getInstance().createTodoRepository();
          setRepository(repo);
        }
      } catch (error) {
        console.error('Authentication setup error:', error);
      } finally {
        setRepoLoading(false);
      }
    }

    setupAuth();
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