"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname().replace("/", "");

  return (
    <nav className="flex justify-between p-4 bg-white shadow">
      <Link href="/" className="font-bold text-2xl">
        Audit TI Cobit 2019
      </Link>
      <div className="space-x-4">
        {!user ? (
          <div className="flex gap-2">
            <Link href="/sign-in">Masuk</Link>
            <Link href="/sign-up">Daftar</Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="hover:text-gray-300">
              Halo {user.name ?? user.email}
            </span>
            <button
              onClick={signOut}
              className="ml-2 p-3 rounded-full transition duration-200 hover:underline"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
