'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Register() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.name);
      alert('Registrasi sukses, silakan login!');
      router.push('/login');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-md mx-auto space-y-4 p-6'>
      <input className='border p-2 w-full rounded' placeholder='Nama' onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className='border p-2 w-full rounded' placeholder='Email' onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type='password' className='border p-2 w-full rounded' placeholder='Password' onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type='submit' className='bg-blue-600 text-white px-4 py-2 rounded'>
        Daftar
      </button>
    </form>
  );
}
