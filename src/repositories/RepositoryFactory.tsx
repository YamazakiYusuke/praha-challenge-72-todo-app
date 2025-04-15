import { User } from "@auth0/auth0-react";
import { supabase } from "../lib/supabase.ts";
import ITodoRepository from "./ITodoRepository";
import InMemoryTodoRepository from "./InMemoryTodoRepository.tsx";
import SupabaseTodoRepository from "./SupabaseTodoRepository.tsx";

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
      const { data } = await supabase.auth.getUser();
      if (!data.user?.id) throw new Error('Supabase user ID not found');
      this.currentRepository = new SupabaseTodoRepository(data.user.id);
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
