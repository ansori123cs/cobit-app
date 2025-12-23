"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { Risk } from "@/types/auth";

export default function CobitMapping() {
  const [selectedRiskId, setSelectedRiskId] = useState("");
  const [domain, setDomain] = useState("");
  const [process, setProcess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [risks, setRisks] = useState<Risk[]>([]);

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
    } catch (err: any | Error) {
      setError(err.message || "Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Pemetaan COBIT 2019
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Risiko
          </label>
          <select
            value={selectedRiskId}
            onChange={(e) => setSelectedRiskId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            <p className="text-sm text-gray-500 mt-1">Memuat data risiko...</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain COBIT
          </label>
          <select
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Contoh: DSS01, APO01"
            value={process}
            onChange={(e) => setProcess(e.target.value)}
            disabled={loading}
          />
        </div>
        <button
          onClick={saveMapping}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
