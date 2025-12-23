export type User = {
  id: string;
  email?: string | null;
  name?: string | null;
  role_id?: number | null;
  created_at?: string | null;
};

export type AuthState = {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type AuthContextType = AuthState & {
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
};

export type AuthResponse = any;
export type OAuthResponse = any;

export interface Risk {
  id: string;
  area_control: string;
  risk_description: string;
}

export interface CobitMap {
  id: string;
  domain: string;
  process: string;
  risk: {
    area_control: string;
    risk_description: string;
  }[];
}
