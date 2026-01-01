"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { Risk } from "@/types/auth";
import Select from "react-select";
import { useRouter } from "next/navigation";

export default function RecommendationPage() {
  const [selectedRiskId, setSelectedRiskId] = useState("");
  const [rec, setRec] = useState("");
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

  const saveRec = async () => {
    setError("");
    setSuccess("");
    if (!selectedRiskId || !rec.trim()) {
      setError("Risiko dan Rekomendasi harus diisi.");
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("governance_recommendations")
        .insert({
          risk_id: selectedRiskId,
          recommendation: rec,
        });
      if (insertError) throw insertError;
      setSuccess("Rekomendasi berhasil disimpan!");
      setSelectedRiskId("");
      setRec("");
    } catch (err: any | Error) {
      setError(err.message || "Gagal menyimpan. Silakan coba lagi.");
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
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Rekomendasi Tata Kelola TI
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Risiko
          </label>
          <Select
            value={
              selectedRiskId
                ? {
                    value: selectedRiskId,
                    label:
                      risks.find((r) => r.id === selectedRiskId)?.area_control +
                      ": " +
                      risks.find((r) => r.id === selectedRiskId)
                        ?.risk_description,
                  }
                : null
            }
            onChange={(selectedOption) =>
              setSelectedRiskId(selectedOption ? selectedOption.value : "")
            }
            options={risks.map((risk) => ({
              value: risk.id,
              label: `${risk.area_control}: ${risk.risk_description}`,
            }))}
            isSearchable={true}
            isClearable={true}
            placeholder="-- Pilih Risiko --"
            className="w-full"
            isDisabled={loading || fetchLoading}
          />
          {fetchLoading && (
            <p className="text-sm text-gray-500 mt-1">Memuat data risiko...</p>
          )}
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
            onClick={saveRec}
            disabled={loading}
            className="w-1/4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
