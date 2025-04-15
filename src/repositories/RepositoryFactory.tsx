import { User } from "@auth0/auth0-react";
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

  public createTodoRepository(user?: User): ITodoRepository {
    if (user) {
      this.currentRepository = new SupabaseTodoRepository(user.sub!);
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
