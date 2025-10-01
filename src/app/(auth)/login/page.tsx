'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className='max-w-md mx-auto space-y-4 p-6'>
      <input className='border p-2 w-full rounded' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
      <input type='password' className='border p-2 w-full rounded' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
      <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
        Login
      </button>
    </form>
  );
}
