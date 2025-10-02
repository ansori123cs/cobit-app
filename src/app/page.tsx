'use client';
import Link from 'next/link';
import Avatar from '@/component/Avatar';
import Typewriter from '@/component/TypewriterEffect';

export default function Home() {
  return (
    <div className='w-full min-h-screen px-6 text-gray-800'>
      <div className='flex items-center justify-start  bg-white shadow rounded-lg p-6 mb-6'>
        <Typewriter text='Selamat Datang Di ' delay={250} className='text-3xl font-bold' />
        <Typewriter text='Cobit App' delay={250} className='text-3xl font-bold text-xl-blue ms-3' />
      </div>
      {/* Profil Mahasiswa */}
      <div className='flex items-center justify-between  bg-white shadow rounded-lg p-6 mb-6'>
        {/* Info Text */}
        <div className='flex  items-center gap-4'>
          <div>
            <h2 className='text-2xl font-bold mb-3'>Profil Singkat</h2>
            <p className='text-lg font-semiboldmt-3'>Muhammad Satria Aulia</p>
            <p className='text-gray-700'>NPM: 13.2021.1.01011</p>
            <p className='text-gray-500 text-sm mt-2'>Mahasiswa Sistem Informasi – ITATS</p>
          </div>
          {/* Foto Profil */}
          <div className='rounded-full overflow-hidden shadow-md'>
            <Avatar
              id='pic'
              alt='muhammad satria aulia'
              width={96} // ✅ 96px (setara w-24 di Tailwind)
              height={96} // ✅ 96px
              className='mt-3'
            />
          </div>
        </div>
        {/* Link ke Dashboard */}

        <Link href='/dashboard' className='bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition'>
          Mulai App Sekarang
        </Link>
      </div>

      <div className='w-full bg-white shadow rounded-lg p-6 mb-6 '>
        <p className='text-lg  mb-6'>
          <span className='font-semibold'>COBIT 2019</span> (Control Objectives for Information and Related Technologies) adalah kerangka kerja internasional untuk <span className='font-semibold'>tata kelola dan manajemen TI</span>.
          Framework ini membantu organisasi memastikan bahwa teknologi informasi mendukung tujuan bisnis dengan efektif, efisien, dan terkontrol.
        </p>
      </div>

      <div className='flex md:flex-row flex-col gap-2'>
        {/* Domain dan Subprocess */}
        <div className='w-full max-w-3xl bg-white shadow rounded-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold mb-3'>Domain Utama COBIT 2019</h2>
          <ul className='list-disc pl-6 space-y-2'>
            <li>
              <strong>EDM</strong> – Evaluate, Direct, and Monitor
            </li>
            <li>
              <strong>APO</strong> – Align, Plan, and Organize
            </li>
            <li>
              <strong>BAI</strong> – Build, Acquire, and Implement
            </li>
            <li>
              <strong>DSS</strong> – Deliver, Service, and Support
            </li>
            <li>
              <strong>MEA</strong> – Monitor, Evaluate, and Assess
            </li>
          </ul>
          <p className='mt-3 text-sm text-gray-600'>
            Setiap domain memiliki beberapa <em>subprocess</em> yang berisi aktivitas untuk mengukur kapabilitas tata kelola TI di organisasi.
          </p>
        </div>
        {/* Prosedur Singkat */}
        <div className='w-full max-w-3xl bg-white shadow rounded-lg p-6 mb-6'>
          <h2 className='text-2xl font-bold mb-3'>Prosedur Penggunaan Aplikasi</h2>
          <ol className='list-decimal pl-6 space-y-2'>
            <li>Login atau daftar sebagai pengguna.</li>
            <li>Isi kuesioner berdasarkan pertanyaan tiap domain dan subprocess COBIT.</li>
            <li>Jawaban akan dihitung untuk menentukan tingkat kapabilitas (Level 1 – 5).</li>
            <li>Lihat hasil analisis di dashboard dalam bentuk tabel dan grafik.</li>
            <li>Pimpinan/asesor dapat menggunakan laporan untuk rekomendasi perbaikan.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
