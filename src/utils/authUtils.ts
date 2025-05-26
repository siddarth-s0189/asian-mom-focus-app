
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
    // Try to initiate password reset for the email
    // This will return success regardless of whether email exists (for security)
    // But we can check the response pattern
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password'
    });
    
    // If there's no error, we can't determine if email exists from this method
    // Let's use a different approach - try to sign up and check the error
    return false;
  } catch (error) {
    console.error('Error checking email:', error);
    return false;
  }
};
