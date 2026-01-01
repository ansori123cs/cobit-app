"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Select from "react-select";

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

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex-1 p-6 bg-white m-3 rounded shadow ">
      <h1 className="text-2xl font-bold mb-4">Identifikasi Risiko TI</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Select
        value={area ? { value: area, label: area } : null}
        onChange={(selectedOption) =>
          setArea(selectedOption ? selectedOption.value : "")
        }
        options={[
          { value: "Access Control", label: "Access Control" },
          { value: "Backup Management", label: "Backup Management" },
          { value: "Change Management", label: "Change Management" },
          { value: "Incident Management", label: "Incident Management" },
          { value: "Other", label: "Other" },
        ]}
        isSearchable={true}
        isClearable={true}
        placeholder="Pilih Area Kontrol"
        className="w-full mb-4"
        isDisabled={loading}
      />
      <textarea
        placeholder="Deskripsi Risiko"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded h-24"
        disabled={loading}
      />
      <div className="flex flex-row gap-3 justify-end">
        <button
          onClick={handleBack}
          disabled={loading}
          className="w-1/4 bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        >
          {loading ? "Kembali..." : "Kembali"}
        </button>
        <button
          onClick={saveRisk}
          disabled={loading}
          className="w-1/4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
