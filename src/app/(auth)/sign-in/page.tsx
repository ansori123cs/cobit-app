'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/component/Loader';

export default function SignInPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      alert(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <form onSubmit={onSubmit} className='max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow'>
      <h1 className='text-xl font-bold'>Masuk</h1>
      <input className='border p-2 w-full' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type='password' className='border p-2 w-full' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className='bg-blue-600 text-white px-4 py-2 rounded' disabled={loading}>
        {loading ? 'Loading...' : 'Masuk'}
      </button>
    </form>
  );
}
