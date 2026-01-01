"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/component/Loader";
import Link from "next/link";
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

const seriesResikoLevel = ["Rendah", "Sedang", "Tinggi", "Ekstrem"];
const seriesMonitoringLevel = ["Belum", "Proses", "Selesai"];

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

  const [summaryMonitoring, setSummaryMonitoring] = useState({
    total: 0,
    belum: 0,
    proses: 0,
    selesai: 0,
  });

  type Series = {
    name: string;
    data: number[];
  };

  const [series1, setSeries1] = useState<Series[]>([]);
  const [series2, setSeries2] = useState<Series[]>([]);
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
        setSeries1([
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
    const load2 = async () => {
      setLoadingSummary(true);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("monitoring_evaluation")
          .select("status");
        if (fetchError) throw fetchError;
        const result = {
          total: data?.length || 0,
          belum: data?.filter((d) => d.status === "Belum").length || 0,
          proses: data?.filter((d) => d.status === "Proses").length || 0,
          selesai: data?.filter((d) => d.status === "Selesai").length || 0,
        };
        setSummaryMonitoring(result);
        setSeries2([
          {
            name: "Data Monitoring",
            data: [
              data?.filter((d) => d.status === "Belum").length || 0,
              data?.filter((d) => d.status === "Proses").length || 0,
              data?.filter((d) => d.status === "Selesai").length || 0,
            ],
          },
        ]);
      } catch (err: any) {
        setError(err.message || "Gagal memuat ringkasan monitoring.");
      } finally {
        setLoadingSummary(false);
      }
    };
    if (isAuthenticated) {
      load();
      load2();
    }
  }, [isAuthenticated]);

  if (isLoading) return <Loader />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="flex flex-col w-1/6 bg-blue-500 text-white  gap-y-2 rounded-xl mx-2 mt-3 ">
        <div className="py-3 ">
          {menus.map((menu, i) => (
            <div key={i} className="flex flex-col ">
              <p className="font-semibold px-2 text-lg">{menu.title}</p>
              {menu.children && (
                <div className="flex flex-col w-full space-y-1 text-sm  my-3">
                  {menu.children.map((child, j) => (
                    <div key={j} className="w-full hover:bg-blue-800 py-2 px-4">
                      <Link href={child.href} className="text-base">
                        {child.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
              {!menu.children && (
                <Link
                  href={menu.href!}
                  className="block mt-1 text-base w-full hover:bg-blue-800 py-2 px-4"
                >
                  Buka
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Dashboard Audit Risiko TI
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Chart Risiko */}
          <div className="bg-white p-4 rounded shadow flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Chart Risiko</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {loadingSummary ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 my-3">
                <Card title="Total Risiko" value={summary.total} />
                <Card title="Rendah" value={summary.rendah} />
                <Card title="Sedang" value={summary.sedang} />
                <Card title="Tinggi" value={summary.tinggi} />
                <Card title="Ekstrem" value={summary.ekstrem} />
              </div>
            )}

            {/* Chart dipaksa mengisi ruang */}
            <div className="flex-1">
              <DashboardChart series={series1} categories={seriesResikoLevel} />
            </div>
          </div>

          {/* Chart Monitoring */}
          <div className="bg-white p-4 rounded shadow flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Chart Monitoring</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {loadingSummary ? (
              <Loader />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-3">
                <Card
                  title="Total Monitoring"
                  value={summaryMonitoring.total}
                />
                <Card title="Belum" value={summaryMonitoring.belum} />
                <Card title="Proses" value={summaryMonitoring.proses} />
                <Card title="Selesai" value={summaryMonitoring.selesai} />
              </div>
            )}

            <div className="flex-1">
              <DashboardChart
                series={series2}
                categories={seriesMonitoringLevel}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Navigasi Cepat</h2>
          {user && (
            <p className="mt-4 text-base font-bold text-gray-700">
              Halo, {user.name ?? user.email}
            </p>
          )}
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
        </div> */}
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
