'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Hasil() {
  const [hasil, setHasil] = useState<any[]>([]);

  useEffect(() => {
    supabase.rpc('compute_capability').then(({ data }) => setHasil(data || []));
  }, []);

  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>Hasil Capability</h1>
      <table className='border w-full'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='p-2'>Subprocess</th>
            <th className='p-2'>Score</th>
            <th className='p-2'>Level</th>
          </tr>
        </thead>
        <tbody>
          {hasil.map((h) => (
            <tr key={h.subprocess_id}>
              <td className='p-2'>{h.subprocess_code}</td>
              <td className='p-2'>{h.capability_score}%</td>
              <td className='p-2'>{h.capability_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
