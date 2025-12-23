"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function RecommendationPage() {
  const [riskId, setRiskId] = useState("");
  const [rec, setRec] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const saveRec = async () => {
    setError("");
    setSuccess("");
    if (!riskId.trim() || !rec.trim()) {
      setError("Risk ID dan Rekomendasi harus diisi.");
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("governance_recommendations")
        .insert({
          risk_id: riskId,
          recommendation: rec,
        });
      if (insertError) throw insertError;
      setSuccess("Rekomendasi berhasil disimpan!");
      setRiskId("");
      setRec("");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Rekomendasi Tata Kelola TI
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
            Rekomendasi
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Rekomendasi"
            value={rec}
            onChange={(e) => setRec(e.target.value)}
            rows={4}
          />
        </div>
        <button
          onClick={saveRec}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
