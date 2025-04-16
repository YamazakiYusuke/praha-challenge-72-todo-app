import { User } from '@auth0/auth0-react';
import { supabase } from './supabase.ts';

/**
 * Auth0ユーザーとSupabaseユーザーを同期する関数
 * 注意: この実装は安全なトークン交換に置き換える必要があります
 */
export async function syncUserWithSupabase(user: User) {
  if (!user || !user.sub) {
    console.error('Invalid user object provided to syncUserWithSupabase');
    return null;
  }

  try {
    console.log('Syncing user with Supabase:', user.sub);

    // iOS Safari向けのエラーハンドリング強化
    // ユーザーのメールアドレスで既存ユーザーを検索
    const { data: existingUsers, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('auth0_id', user.sub);

    if (searchError) {
      console.error('Error searching for user:', searchError);
      // エラーが発生しても処理を続行し、ユーザー作成を試みる
    }

    // ユーザーが存在しない場合は作成
    if (!existingUsers || existingUsers.length === 0) {
      const userData = {
        auth0_id: user.sub,
        email: user.email || `${user.sub}@example.com`, // メールアドレスがない場合のフォールバック
        name: user.name || user.nickname || 'User', // 名前がない場合のフォールバック
        picture: user.picture || '' // 画像がない場合のフォールバック
      };

      console.log('Creating new user in Supabase:', userData.auth0_id);

      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([userData])
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
      const updateData = {
        email: user.email || existingUser.email,
        name: user.name || existingUser.name,
        picture: user.picture || existingUser.picture,
        updated_at: new Date()
      };

      console.log('Updating existing user in Supabase:', existingUser.auth0_id);

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updateData)
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
