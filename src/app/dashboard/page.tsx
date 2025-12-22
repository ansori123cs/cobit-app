"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CapabilityChart from "@/component/CapabilityChart";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/component/Loader";
import Link from "next/link";

const menus = [
  { title: "Dashboard", href: "/dashboard" },

  {
    title: "Audit Risiko TI",
    children: [
      { title: "Identifikasi Risiko", href: "/risk" },
      { title: "Penilaian Risiko", href: "/risk/assessment" },
    ],
  },

  {
    title: "General Control",
    children: [
      { title: "Kontrol Akses", href: "/general-control/access" },
      { title: "Backup & Recovery", href: "/general-control/backup" },
      { title: "Change Management", href: "/general-control/change" },
      { title: "Incident Management", href: "/general-control/incident" },
    ],
  },

  { title: "Pemetaan COBIT 2019", href: "/cobit-mapping" },
  { title: "Rekomendasi Tata Kelola", href: "/recommendation" },
  { title: "Monitoring & Evaluasi", href: "/monitoring" },
];

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/sign-in");
  }, [isLoading, isAuthenticated, router]);

  const [summary, setSummary] = useState({
    total: 0,
    rendah: 0,
    sedang: 0,
    tinggi: 0,
    ekstrem: 0,
  });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("risk_assessment")
        .select("risk_level");

      const result = {
        total: data?.length || 0,
        rendah: data?.filter((d) => d.risk_level === "Rendah").length || 0,
        sedang: data?.filter((d) => d.risk_level === "Sedang").length || 0,
        tinggi: data?.filter((d) => d.risk_level === "Tinggi").length || 0,
        ekstrem: data?.filter((d) => d.risk_level === "Ekstrem").length || 0,
      };

      setSummary(result);
    };
    load();
  }, []);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div>
      <div className=" flex-1 flex-row min-h-screen gap-10">
        <div className="w-64 bg-gray-900 text-white  p-4">
          <h2 className="text-xl font-bold mb-6">Audit TI COBIT 2019</h2>

          {menus.map((menu, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold">{menu.title}</p>

              {menu.children && (
                <ul className="ml-4 mt-2 space-y-1 text-sm">
                  {menu.children.map((child, j) => (
                    <li key={j}>
                      <Link href={child.href} className="hover:underline">
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {!menu.children && (
                <Link
                  href={menu.href!}
                  className="block mt-1 text-sm hover:underline"
                >
                  Buka
                </Link>
              )}
            </div>
          ))}
        </div>
        <div>
          <div className="flex w-75">
            <h1 className="text-2xl font-bold mb-6">
              Dashboard Audit Risiko TI
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card title="Total Risiko" value={summary.total} />
              <Card title="Rendah" value={summary.rendah} />
              <Card title="Sedang" value={summary.sedang} />
              <Card title="Tinggi" value={summary.tinggi} />
              <Card title="Ekstrem" value={summary.ekstrem} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        {user && <p className="mb-4">Halo, {user.email}</p>}
        <ul className="space-y-2">
          <li>
            <a href="/kuesioner" className="text-blue-500">
              Isi Kuesioner
            </a>
          </li>
          <li>
            <a href="/hasil" className="text-blue-500">
              Lihat Hasil Capability
            </a>
          </li>
        </ul>
        <CapabilityChart />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
