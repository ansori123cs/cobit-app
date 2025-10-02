'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import XLButton from '@/component/XLButton';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signUp, signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const result = await signUp(email, password, { full_name: fullName });

        // Check if email confirmation is required
        if (result.user && !result.session) {
          // Email confirmation required
          router.push('/auth/verify-email');
        } else {
          // Auto-logged in
          router.push('/dashboard');
        }
      } else {
        await signIn(email, password);
        // Redirect will be handled by auth state change listener
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      // Redirect to OAuth provider
      window.location.href = result.url;
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    }
  };

  return (
    <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6'>
      <h2 className='text-2xl font-bold text-center mb-6 text-xl-dark'>{isSignUp ? 'Create Account' : 'Sign In'}</h2>

      {error && <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {isSignUp && (
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
            <input
              type='text'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xl-primary focus:border-transparent'
              required
            />
          </div>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xl-primary focus:border-transparent' required />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-xl-primary focus:border-transparent'
            required
            minLength={6}
          />
        </div>

        <XLButton type='submit' variant='primary' size='lg' className='w-full' disabled={isLoading}>
          {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </XLButton>
      </form>

      <div className='mt-4'>
        <button
          onClick={handleGoogleSignIn}
          type='button'
          className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xl-primary'
        >
          <img className='w-5 h-5 mr-2' src='https://www.google.com/favicon.ico' alt='Google' />
          Continue with Google
        </button>
      </div>

      <div className='mt-4 text-center'>
        <button type='button' onClick={() => setIsSignUp(!isSignUp)} className='text-xl-primary hover:text-red-600 text-sm font-medium'>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default Login;
