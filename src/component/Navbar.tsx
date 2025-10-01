'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const Navbar = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.href = '/';
  };

  return (
    <nav className='flex justify-between bg-white p-4 shadow mb-4 rounded'>
      <Link href='/' className='font-bold text-2xl'>
        COBIT App
      </Link>

      <div className='nav-items'></div>
      <div className='space-x-4'>
        {!user ? (
          <>
            <Link href='/login'>Login</Link>
            <Link href='/register'>Register</Link>
          </>
        ) : (
          <>
            <Link href='/dashboard'>Dashboard</Link>
            <button onClick={handleLogout} className='text-red-500'>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
