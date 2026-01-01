"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Select from "react-select";
import { useRouter } from "next/navigation";

type Recommendation = {
  id: string;
  recommendation: string;
  status: string;
};

export default function MonitoringPage() {
  const [data, setData] = useState<Recommendation[]>([]);
  const [status, setStatus] = useState("Belum");
  const [notes, setNotes] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("governance_recommendations")
        .select("id, recommendation, status");
      if (fetchError) throw fetchError;
      setData(data || []);
    } catch (err: any | Error) {
      setError("Gagal memuat data rekomendasi.");
    } finally {
      setLoading(false);
    }
  };

  const saveMonitoring = async () => {
    if (!selectedId) {
      setError("Pilih rekomendasi terlebih dahulu.");
      return;
    }
    if (!notes.trim()) {
      setError("Catatan evaluasi harus diisi.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("monitoring_evaluation")
        .insert({
          recommendation_id: selectedId,
          status,
          evaluation_notes: notes,
        });
      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from("governance_recommendations")
        .update({ status })
        .eq("id", selectedId);
      if (updateError) throw updateError;

      setSuccess("Monitoring berhasil disimpan!");
      setNotes("");
      setSelectedId("");
      load();
    } catch (err: any | Error) {
      setError(err.message || "Gagal menyimpan evaluasi.");
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="flex-1 p-6 bg-white m-3 rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Monitoring & Evaluasi Rekomendasi TI
      </h1>

      {error && (
        <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
      )}
      {success && (
        <p className="text-green-500 mb-4 bg-green-100 p-3 rounded">
          {success}
        </p>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-700">
                Rekomendasi
              </th>
              <th className="p-4 text-left font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr
                key={r.id}
                className={`cursor-pointer hover:bg-gray-100 transition ${
                  selectedId === r.id ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedId(r.id)}
              >
                <td className="p-4 border-b">{r.recommendation}</td>
                <td className="p-4 border-b">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-4 text-center">Memuat data...</p>}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Evaluasi Rekomendasi
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={status ? { value: status, label: status } : null}
            onChange={(selectedOption) =>
              setStatus(selectedOption ? selectedOption.value : "")
            }
            options={[
              { value: "Belum", label: "Belum" },
              { value: "Proses", label: "Proses" },
              { value: "Selesai", label: "Selesai" },
            ]}
            isSearchable={true}
            isClearable={true}
            placeholder="Pilih Status"
            className="w-full"
            isDisabled={loading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Evaluasi
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-24"
            placeholder="Catatan evaluasi"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex flex-row gap-3 justify-end">
          <button
            onClick={handleBack}
            disabled={loading}
            className="w-1/4 bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-400"
          >
            {loading ? "Kembali..." : "Kembali"}
          </button>

          <button
            onClick={saveMonitoring}
            disabled={loading}
            className="w-1/4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Simpan Evaluasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
