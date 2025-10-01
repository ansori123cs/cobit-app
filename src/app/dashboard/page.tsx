'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CapabilityChart from '@/component/CapabilityChart';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

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
