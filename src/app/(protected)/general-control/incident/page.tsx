"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function IncidentControlPage() {
  const [exist, setExist] = useState(false);
  const [effective, setEffective] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const save = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("general_controls")
        .insert({
          control_area: "Incident Management",
          control_name: "Penanganan insiden TI",
          is_exist: exist,
          is_effective: effective,
          notes,
        });
      if (insertError) throw insertError;
      setSuccess("Incident Management berhasil disimpan!");
      setExist(false);
      setEffective(false);
      setNotes("");
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        General Control – Incident Management
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="space-y-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={exist}
            onChange={(e) => setExist(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700">Kontrol tersedia</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={effective}
            onChange={(e) => setEffective(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-gray-700">Kontrol efektif</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Audit
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Catatan audit"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        <button
          onClick={save}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
