import { supabase } from '../lib/supabase.ts';
import ITodoRepository from './ITodoRepository';
import TodoItem from './TodoItem.tsx';

class SupabaseTodoRepository implements ITodoRepository {
  private userId: string;

  constructor(userId: string) {
    if (!userId) {
      throw new Error('User ID is required for SupabaseTodoRepository');
    }
    this.userId = userId;
  }

  async getAll(): Promise<TodoItem[]> {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('id, text, completed')
        .eq('user_id', this.userId)
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      return data ? data.map(item => new TodoItem(
        item.id,
        item.text,
        item.completed
      )) : [];
    } catch (error) {
      throw new Error('Failed to fetch todos');
    }
  }

  async save(todos: TodoItem[]): Promise<TodoItem[]> {
    try {
      // 既存のTodoを取得
      const { data: existingTodos, error: fetchError } = await supabase
        .from('todos')
        .select('id')
        .eq('user_id', this.userId);

      if (fetchError) {
        throw fetchError;
      }

      const existingIds = new Set(existingTodos.map(todo => todo.id));

      // 新しいTodo（挿入用）
      const insertItems: {
        user_id: string;
        text: string;
        completed: boolean;
      }[] = [];

      // 既存のTodo（更新用）
      const updateItems: {
        id: number;
        user_id: string;
        text: string;
        completed: boolean;
      }[] = [];

      const deleteIds: number[] = [];

      // Todoを挿入用と更新用に分ける
      for (const todo of todos) {
        if (todo.id < 0) {
          // 新しいTodo（クライアント側のネガティブID）
          insertItems.push({
            user_id: this.userId,
            text: todo.text,
            completed: todo.completed
          });
        } else {
          // 既存のTodo
          updateItems.push({
            id: todo.id,
            user_id: this.userId,
            text: todo.text,
            completed: todo.completed
          });
          existingIds.delete(todo.id);
        }
      }

      // 削除するID
      deleteIds.push(...existingIds);

      // 挿入操作を実行
      if (insertItems.length > 0) {
        const { error: insertError } = await supabase
          .from('todos')
          .insert(insertItems);

        if (insertError) {
          throw insertError;
        }
      }

      // 更新操作を実行
      for (const item of updateItems) {
        const { error: updateError } = await supabase
          .from('todos')
          .update({
            text: item.text,
            completed: item.completed
          })
          .eq('id', item.id)
          .eq('user_id', this.userId);

        if (updateError) {
          throw updateError;
        }
      }

      // 削除操作を実行
      if (deleteIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('todos')
          .delete()
          .in('id', deleteIds)
          .eq('user_id', this.userId);

        if (deleteError) {
          throw deleteError;
        }
      }

      // 更新されたリストを返す
      return this.getAll();
    } catch (error) {
      throw new Error('Failed to save todos');
    }
  }
}

export default SupabaseTodoRepository;
