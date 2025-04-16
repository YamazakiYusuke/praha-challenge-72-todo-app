import { User } from "@auth0/auth0-react";
import { supabase } from "../lib/supabase.ts";
import ITodoRepository from "../repositories/ITodoRepository";
import InMemoryTodoRepository from "../repositories/InMemoryTodoRepository.tsx";
import SupabaseTodoRepository from "../repositories/SupabaseTodoRepository.tsx";

class RepositoryFactory {
  private static instance: RepositoryFactory;
  private currentRepository: ITodoRepository | null = null;

  private constructor() { }

  public static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  public async createTodoRepository(user?: User): Promise<ITodoRepository> {
    if (user) {
      try {
        // Auth0ユーザー情報があればSupabaseリポジトリを使用
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error('Supabase auth error:', error);
          // エラーが発生した場合はユーザーIDとしてAuth0のsubを使用
          if (user.sub) {
            this.currentRepository = new SupabaseTodoRepository(user.sub);
          } else {
            // Auth0のユーザーIDがない場合は一時的なIDを生成
            this.currentRepository = new InMemoryTodoRepository();
          }
        } else if (!data.user?.id) {
          console.warn('Supabase user ID not found, using Auth0 ID instead');
          if (user.sub) {
            this.currentRepository = new SupabaseTodoRepository(user.sub);
          } else {
            this.currentRepository = new InMemoryTodoRepository();
          }
        } else {
          this.currentRepository = new SupabaseTodoRepository(data.user.id);
        }
      } catch (error) {
        console.error('Error creating repository:', error);
        // エラーが発生した場合はフォールバックとしてインメモリリポジトリを使用
        this.currentRepository = new InMemoryTodoRepository();
      }
    } else {
      this.currentRepository = new InMemoryTodoRepository();
    }
    return this.currentRepository;
  }

  public getCurrentRepository(): ITodoRepository | null {
    return this.currentRepository;
  }
}

export default RepositoryFactory;
