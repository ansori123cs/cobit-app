"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RiskPage() {
  const [area, setArea] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const saveRisk = async () => {
    if (!area.trim() || !desc.trim()) {
      setError("Area Kontrol dan Deskripsi Risiko harus diisi.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error: insertError } = await supabase
        .from("risk_register")
        .insert({
          area_control: area,
          risk_description: desc,
        });
      if (insertError) throw insertError;
      alert("Risiko berhasil disimpan!");
      setArea("");
      setDesc("");
    } catch (err) {
      setError("Gagal menyimpan risiko. Coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Identifikasi Risiko TI</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        disabled={loading}
      >
        <option value="">Pilih Area Kontrol</option>
        <option value="Access Control">Access Control</option>
        <option value="Backup Management">Backup Management</option>
        <option value="Change Management">Change Management</option>
        <option value="Incident Management">Incident Management</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        placeholder="Deskripsi Risiko"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded h-24"
        disabled={loading}
      />
      <button
        onClick={saveRisk}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </div>
  );
}
