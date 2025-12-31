"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { Risk, CobitMap } from "@/types/auth";

export default function CobitMapping() {
  const [selectedRiskId, setSelectedRiskId] = useState("");
  const [domain, setDomain] = useState("");
  const [process, setProcess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [risks, setRisks] = useState<Risk[]>([]);
  const [cobbitMap, setCobbitMap] = useState<CobitMap[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchRisks = async () => {
      setFetchLoading(true);
      setError("");
      try {
        const { data, error } = await supabase
          .from("risk_register")
          .select("id, area_control, risk_description");
        if (error) throw error;
        setRisks(data || []);
      } catch (err: any | Error) {
        setError("Gagal memuat data risiko.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchRisks();
  }, []);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase.from("cobit_mapping").select(`
        id,
        domain,
        process,
        risk:risk_register!risk_id (
          area_control,
          risk_description
        )
      `);
      if (error) throw error;
      setCobbitMap(data || []);
    } catch (err: any | Error) {
      setError("Gagal memuat data mapping.");
    } finally {
      setDataLoading(false);
    }
  };
  const saveMapping = async () => {
    setError("");
    setSuccess("");
    if (!selectedRiskId || !domain.trim() || !process.trim()) {
      setError("Semua field harus diisi.");
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("cobit_mapping")
        .insert({
          risk_id: selectedRiskId,
          domain,
          process,
        });
      if (insertError) throw insertError;
      setSuccess("Mapping COBIT berhasil disimpan!");
      setSelectedRiskId("");
      setDomain("");
      setProcess("");
      load();
    } catch (err: any | Error) {
      setError(err.message || "Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Pemetaan COBIT 2019
      </h1>
      {error && (
        <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
      )}
      {success && (
        <p className="text-green-500 mb-4 bg-green-100 p-3 rounded">
          {success}
        </p>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Hasil Pemetaan COBIT 2019
        </h2>
        {dataLoading ? (
          <p>Memuat data...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left border border-gray-300">
                  Area Kontrol
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Risiko TI
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Domain COBIT
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Proses COBIT
                </th>
              </tr>
            </thead>
            <tbody>
              {cobbitMap.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Belum ada data mapping COBIT.
                  </td>
                </tr>
              ) : (
                cobbitMap.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {/* <td className="p-3 border border-gray-300">{row.risk}</td>
                    <td className="p-3 border border-gray-300">{row.risk}</td> */}
                    <td className="p-3 border border-gray-300 font-semibold">
                      {row.domain}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {row.process}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tambah Mapping Baru</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Risiko
            </label>
            <select
              value={selectedRiskId}
              onChange={(e) => setSelectedRiskId(e.target.value)}
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              disabled={loading || fetchLoading}
            >
              <option value="">-- Pilih Risiko --</option>
              {risks.map((risk) => (
                <option key={risk.id} value={risk.id}>
                  {risk.area_control}: {risk.risk_description}
                </option>
              ))}
            </select>
            {fetchLoading && (
              <p className="text-sm text-gray-500 mt-1">
                Memuat data risiko...
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain COBIT
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
              disabled={loading}
            >
              <option value="">-- Pilih Domain --</option>
              <option value="DSS">DSS (Deliver, Service and Support)</option>
              <option value="APO">APO (Align, Plan and Organise)</option>
              <option value="BAI">BAI (Build, Acquire and Implement)</option>
              <option value="MEA">MEA (Monitor, Evaluate and Assess)</option>
              <option value="EDM">EDM (Evaluate, Direct and Monitor)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proses COBIT
            </label>
            <input
              type="text"
              className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Contoh: DSS01, APO01"
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            onClick={saveMapping}
            disabled={loading}
            className="w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
