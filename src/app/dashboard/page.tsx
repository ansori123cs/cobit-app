"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CapabilityChart from "@/component/CapabilityChart";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/component/Loader";
import Link from "next/link";
import { testOpenAi } from "@/lib/openAiClient";
import DashboardChart from "@/component/DashboardChart";

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

const seriesLevel = ["Rendah", "Sedang", "Tinggi", "Ekstrem"];

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

  type Series = {
    name: string;
    data: number[];
  };

  const [series, setSeries] = useState<Series[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // testOpenAi("apakah next js masih aman?");
    const load = async () => {
      setLoadingSummary(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("risk_assessment")
          .select("risk_level");
        if (fetchError) throw fetchError;
        const result = {
          total: data?.length || 0,
          rendah: data?.filter((d) => d.risk_level === "Rendah").length || 0,
          sedang: data?.filter((d) => d.risk_level === "Sedang").length || 0,
          tinggi: data?.filter((d) => d.risk_level === "Tinggi").length || 0,
          ekstrem: data?.filter((d) => d.risk_level === "Ekstrem").length || 0,
        };
        setSummary(result);
        setSeries([
          {
            name: "Data Resiko",
            data: [
              data?.filter((d) => d.risk_level === "Rendah").length || 0,
              data?.filter((d) => d.risk_level === "Sedang").length || 0,
              data?.filter((d) => d.risk_level === "Tinggi").length || 0,
              data?.filter((d) => d.risk_level === "Ekstrem").length || 0,
            ],
          },
        ]);
      } catch (err: any) {
        setError(err.message || "Gagal memuat ringkasan risiko.");
      } finally {
        setLoadingSummary(false);
      }
    };
    if (isAuthenticated) load();
  }, [isAuthenticated]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
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

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Dashboard Audit Risiko TI
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loadingSummary ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card title="Total Risiko" value={summary.total} />
            <Card title="Rendah" value={summary.rendah} />
            <Card title="Sedang" value={summary.sedang} />
            <Card title="Tinggi" value={summary.tinggi} />
            <Card title="Ekstrem" value={summary.ekstrem} />
          </div>
        )}
        <div className="mb-8">
          <DashboardChart series={series} categories={seriesLevel} />
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Navigasi Cepat</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/kuesioner" className="text-blue-500 hover:underline">
                Isi Kuesioner
              </Link>
            </li>
            <li>
              <Link href="/hasil" className="text-blue-500 hover:underline">
                Lihat Hasil Capability
              </Link>
            </li>
          </ul>
          {user && (
            <p className="mt-4 text-gray-700">
              Halo, {user.name ?? user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
