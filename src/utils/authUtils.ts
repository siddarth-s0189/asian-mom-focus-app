
import { supabase } from '@/integrations/supabase/client';

export const cleanupAuthState = () => {
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    // First try to sign in with a fake password to check if email exists
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'fake-password-for-check',
    });
    
    // If the error is "Invalid login credentials", the email doesn't exist
    // If the error is something else, the email likely exists
    if (error?.message === 'Invalid login credentials') {
      return false;
    }
    
    // Any other error suggests the email exists
    return true;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};
