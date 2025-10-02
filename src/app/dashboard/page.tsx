'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CapabilityChart from '@/component/CapabilityChart';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/component/Loader';

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/sign-in');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div>
      <h1 className='text-xl font-bold'>Dashboard</h1>
      {user && <p className='mb-4'>Halo, {user.email}</p>}
      <ul className='space-y-2'>
        <li>
          <a href='/kuesioner' className='text-blue-500'>
            Isi Kuesioner
          </a>
        </li>
        <li>
          <a href='/hasil' className='text-blue-500'>
            Lihat Hasil Capability
          </a>
        </li>
      </ul>
      <CapabilityChart />
    </div>
  );
}
