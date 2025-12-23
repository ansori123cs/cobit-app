"use client";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function AssessmentPage() {
  const { id } = useParams();
  const [impact, setImpact] = useState(1);
  const [likelihood, setLikelihood] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const assess = async () => {
    if (!id) {
      setError("ID risiko tidak valid.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("risk_assessment")
        .insert({
          risk_id: id,
          impact,
          likelihood,
        });
      if (insertError) throw insertError;
      setSuccess("Penilaian risiko berhasil disimpan!");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan penilaian.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Penilaian Risiko
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Impact (1-5)
          </label>
          <input
            type="number"
            min={1}
            max={5}
            value={impact}
            onChange={(e) => setImpact(+e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Likelihood (1-5)
          </label>
          <input
            type="number"
            min={1}
            max={5}
            value={likelihood}
            onChange={(e) => setLikelihood(+e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={assess}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Hitung Risiko"}
        </button>
      </div>
    </div>
  );
}
