import { User as SupabaseUser, Session, Provider, WeakPassword } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: SupabaseUser;
  session: Session;
  weakPassword?: WeakPassword;
}

export interface OAuthResponse {
  provider: Provider;
  url: string;
}

export interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, metadata?: any) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithGoogle: () => Promise<OAuthResponse>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}
