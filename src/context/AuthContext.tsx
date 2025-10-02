'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { AuthContextType, AuthState, User, AuthResponse, OAuthResponse } from '@/types/auth';

// initialState, reducer, dll — pakai yang kamu punya (sama saja)
const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

type AuthAction = { type: 'SET_LOADING'; payload: boolean } | { type: 'SET_SESSION'; payload: any } | { type: 'SET_USER'; payload: User | null } | { type: 'SIGN_OUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SESSION':
      return { ...state, session: action.payload, isAuthenticated: !!action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SIGN_OUT':
      return { ...state, user: null, session: null, isAuthenticated: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          dispatch({ type: 'SET_SESSION', payload: session });
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

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      dispatch({ type: 'SET_LOADING', payload: true });

      if (session?.user) {
        dispatch({ type: 'SET_SESSION', payload: session });
        const userProfile = await fetchUserProfile(session.user.id);
        dispatch({ type: 'SET_USER', payload: userProfile });

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          router.push('/dashboard');
        }
      } else {
        dispatch({ type: 'SIGN_OUT' });
        if (event === 'SIGNED_OUT') router.push('/sign-in');
      }

      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return () => subscription?.subscription?.unsubscribe?.();
  }, [router]);

  // methods: signUp, signIn, signInWithGoogle, signOut, resetPassword, updateUser (sama seperti yang kamu miliki)
  const signUp = async (email: string, password: string, metadata?: any): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: metadata } });
    if (error) throw error;
    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert([{ id: data.user.id, email: data.user.email, name: metadata?.name || '', created_at: new Date().toISOString() }]);
      if (profileError) console.error('Profile creation error:', profileError);
    }
    if (data.session) router.push('/dashboard');
    return data as AuthResponse;
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.session) router.push('/dashboard');
    return data as AuthResponse;
  };

  const signInWithGoogle = async (): Promise<OAuthResponse> => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return data as OAuthResponse;
  };

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    router.push('/sign-in');
  };

  const resetPassword = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    if (error) throw error;
    router.push('/auth/reset-password-sent');
  };

  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) throw new Error('No user logged in');
    const { error } = await supabase.from('users').update(updates).eq('id', state.user.id);
    if (error) throw error;
    dispatch({ type: 'SET_USER', payload: { ...state.user, ...updates } });
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
