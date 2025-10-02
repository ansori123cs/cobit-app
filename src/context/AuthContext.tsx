'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { AuthContextType, AuthState, User, AuthResponse, OAuthResponse } from '../types/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

// Action types
type AuthAction = { type: 'SET_LOADING'; payload: boolean } | { type: 'SET_SESSION'; payload: any } | { type: 'SET_USER'; payload: User | null } | { type: 'SIGN_OUT' };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        session: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          dispatch({ type: 'SET_SESSION', payload: session });

          // Fetch user profile
          const userProfile = await fetchUserProfile(session.user.id);
          dispatch({ type: 'SET_USER', payload: userProfile });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (session?.user) {
        dispatch({ type: 'SET_SESSION', payload: session });

        const userProfile = await fetchUserProfile(session.user.id);
        dispatch({ type: 'SET_USER', payload: userProfile });

        // Redirect based on event
        if (event === 'SIGNED_IN') {
          router.push('/dashboard');
        }
      } else {
        dispatch({ type: 'SIGN_OUT' });

        // Redirect to sign in on sign out
        if (event === 'SIGNED_OUT') {
          router.push('/auth/signin');
        }
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Auth methods
  const signUp = async (email: string, password: string, metadata?: any): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Create user profile after successful signup
      if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            email: data.user.email,
            full_name: metadata?.full_name || '',
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Continue anyway - user can update profile later
        }
      }

      // Show success message for email verification
      if (data.user && !data.session) {
        router.push('/auth/verify-email');
      }

      return data as AuthResponse;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Router will handle redirect via auth state change listener
      return data as AuthResponse;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<OAuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      return data as OAuthResponse;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Dispatch will happen in auth state change listener
      // Router will handle redirect via auth state change listener
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      router.push('/auth/reset-password-sent');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    try {
      if (!state.user) throw new Error('No user logged in');

      const { error } = await supabase.from('profiles').update(updates).eq('id', state.user.id);

      if (error) throw error;

      // Update local state
      dispatch({
        type: 'SET_USER',
        payload: { ...state.user, ...updates },
      });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook untuk menggunakan auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
