"use client";
import Link from "next/link";
import Avatar from "@/component/Avatar";
import Typewriter from "@/component/TypewriterEffect";

export default function Home() {
  return (
    <div className="w-full min-h-screen px-6 py-8 text-gray-800">
      <div className="flex items-center justify-center bg-white shadow-lg rounded-lg p-6 mb-8">
        <Typewriter
          text="Selamat Datang Di "
          delay={250}
          className="text-4xl font-bold"
        />
        <Typewriter
          text="Cobit App"
          delay={250}
          className="text-4xl font-bold text-blue-600 ml-3"
        />
      </div>

      {/* Profil Mahasiswa */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Profil Singkat</h2>
            <p className="text-xl font-semibold mb-2">Muhammad Satria Aulia</p>
            <p className="text-lg text-gray-700">NPM: 13.2021.1.01011</p>
            <p className="text-base text-gray-500">
              Mahasiswa Sistem Informasi – ITATS
            </p>
          </div>
          <div className="rounded-full overflow-hidden shadow-lg">
            <Avatar
              id="pic"
              alt="muhammad satria aulia"
              width={120}
              height={120}
              className="mt-4 md:mt-0"
            />
          </div>
        </div>
        <Link
          href="/dashboard"
          className="mt-6 md:mt-0 bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition text-lg font-semibold"
        >
          Mulai App Sekarang
        </Link>
      </div>

      <div className="w-full bg-white shadow-lg rounded-lg p-6 mb-8">
        <p className="text-lg mb-6 leading-relaxed">
          <span className="font-semibold">COBIT 2019</span> (Control Objectives
          for Information and Related Technologies) adalah kerangka kerja
          internasional untuk{" "}
          <span className="font-semibold">tata kelola dan manajemen TI</span>.
          Framework ini membantu organisasi memastikan bahwa teknologi informasi
          mendukung tujuan bisnis dengan efektif, efisien, dan terkontrol.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Domain dan Subprocess */}
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Domain Utama COBIT 2019</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
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
          <p className="mt-4 text-sm text-gray-600">
            Setiap domain memiliki beberapa <em>subprocess</em> yang berisi
            aktivitas untuk mengukur kapabilitas tata kelola TI di organisasi.
          </p>
        </div>

        {/* Prosedur Singkat */}
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">
            Prosedur Penggunaan Aplikasi
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Login atau daftar sebagai pengguna.</li>
            <li>
              Isi kuesioner berdasarkan pertanyaan tiap domain dan subprocess
              COBIT.
            </li>
            <li>
              Jawaban akan dihitung untuk menentukan tingkat kapabilitas (Level
              1 – 5).
            </li>
            <li>
              Lihat hasil analisis di dashboard dalam bentuk tabel dan grafik.
            </li>
            <li>
              Pimpinan/asesor dapat menggunakan laporan untuk rekomendasi
              perbaikan.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
