"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function CobitMapping() {
  const [riskId, setRiskId] = useState("");
  const [domain, setDomain] = useState("");
  const [process, setProcess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const saveMapping = async () => {
    setError("");
    setSuccess("");
    if (!riskId.trim() || !domain.trim() || !process.trim()) {
      setError("Semua field harus diisi.");
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("cobit_mapping")
        .insert({
          risk_id: riskId,
          domain,
          process,
        });
      if (insertError) throw insertError;
      setSuccess("Mapping COBIT berhasil disimpan!");
      setRiskId("");
      setDomain("");
      setProcess("");
    } catch (err: any) {
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
            Risk ID
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Risk ID"
            value={riskId}
            onChange={(e) => setRiskId(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Domain (DSS/APO/...)
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Domain (DSS/APO/...)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proses COBIT
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Proses COBIT"
            value={process}
            onChange={(e) => setProcess(e.target.value)}
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
