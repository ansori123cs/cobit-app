'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, { name });
      alert('Cek email Anda (jika email confirmation aktif).');
    } catch (err: any) {
      alert(err.message || 'Registrasi gagal');
    }
  };

  return (
    <form onSubmit={onSubmit} className='max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow'>
      <h1 className='text-xl font-bold'>Daftar</h1>
      <input className='border p-2 w-full' placeholder='Nama' value={name} onChange={(e) => setName(e.target.value)} />
      <input className='border p-2 w-full' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type='password' className='border p-2 w-full' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className='bg-green-600 text-white px-4 py-2 rounded'>Daftar</button>
    </form>
  );
}
