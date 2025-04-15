import { User } from '@auth0/auth0-react';
import { supabase } from './supabase.ts';

// Function to sync Auth0 user with Supabase
export async function syncUserWithSupabase(user: User) {
  try {
    // This is a simplified approach - in a production app, you'd typically 
    // use custom JWT claims or a more secure method
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: user.sub!, // Using Auth0 sub as password is just for demonstration
    });

    if (error) {
      // If user doesn't exist, create them
      if (error.status === 400) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: user.email!,
          password: user.sub!,
          options: {
            data: {
              full_name: user.name,
              auth0_id: user.sub,
            }
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        return data;
      }

      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error syncing user with Supabase:', error);
    throw error;
  }
}
