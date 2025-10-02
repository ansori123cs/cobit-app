'use client';

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/component/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='min-h-screen bg-gray-50 text-gray-800'>
        <AuthProvider>
          <Navbar />
          <main className='mx-auto p-4'>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
