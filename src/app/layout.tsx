"use client";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import "./globals.css";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = "COBIT App";
  }, []);

  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow ">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
