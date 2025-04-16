import { User } from '@auth0/auth0-react';
import { supabase } from './supabase.ts';

/**
 * Auth0ユーザーとSupabaseユーザーを同期する関数
 * 注意: この実装は安全なトークン交換に置き換える必要があります
 */
export async function syncUserWithSupabase(user: User) {
  try {
    // ユーザーのメールアドレスで既存ユーザーを検索
    const { data: existingUsers, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('auth0_id', user.sub);

    if (searchError) {
      console.error('Error searching for user:', searchError);
      return null;
    }

    // ユーザーが存在しない場合は作成
    if (!existingUsers || existingUsers.length === 0) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            auth0_id: user.sub,
            email: user.email,
            name: user.name,
            picture: user.picture
          }
        ])
        .select();

      if (createError) {
        console.error('Error creating user:', createError);
        return null;
      }

      return newUser;
    }

    // ユーザー情報が変更されている場合は更新
    const existingUser = existingUsers[0];
    if (
      existingUser.email !== user.email ||
      existingUser.name !== user.name ||
      existingUser.picture !== user.picture
    ) {
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          email: user.email,
          name: user.name,
          picture: user.picture,
          updated_at: new Date()
        })
        .eq('auth0_id', user.sub)
        .select();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return null;
      }

      return updatedUser;
    }

    return existingUsers;
  } catch (error) {
    console.error('Error syncing user with Supabase:', error);
    return null;
  }
}
