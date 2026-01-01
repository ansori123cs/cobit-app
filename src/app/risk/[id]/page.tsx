"use client";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Risk } from "@/types/auth";

import {
  SweetAlertErrorDialogue,
  SweetAlertSuccessDialogue,
} from "@/component/SwalFire";
import { useRouter } from "next/navigation";
import Select from "react-select";

export default function AssessmentPage() {
  const { id } = useParams();
  const [impact, setImpact] = useState(1);
  const [likelihood, setLikelihood] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedRiskId, setSelectedRiskId] = useState("Silahkan Pilih");

  const router = useRouter();

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

  const assess = async () => {
    if (!selectedRiskId) {
      setError("Pilih risiko terlebih dahulu.");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from("risk_assessment")
        .insert({
          risk_id: selectedRiskId,
          impact,
          likelihood,
        });
      if (insertError) throw insertError;
      setSuccess("Penilaian risiko berhasil disimpan!");
      SweetAlertSuccessDialogue("Penilaian risiko berhasil disimpan!");

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any | Error) {
      setError(err.message || "Gagal menyimpan penilaian.");
      SweetAlertErrorDialogue("Gagal menyimpan penilaian");
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex-1 p-6 bg-white m-3 rounded shadow ">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Penilaian Risiko
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            Pilih Risiko
          </label>

          <Select
            placeholder="-- Pilih Risiko --"
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
            className="w-full"
            isDisabled={loading || fetchLoading}
          />
          {fetchLoading && (
            <p className="text-sm text-gray-500 mt-1">Memuat data risiko...</p>
          )}
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            Impact
          </label>

          <div className="flex items-center justify-start gap-10 mt-2  p-2 mb-4 border border-gray-300 rounded h-24">
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Rendah
            </p>
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="mx-auto">
                <input
                  type="radio"
                  name="impact"
                  value={value}
                  checked={impact === value}
                  onChange={(e) => setImpact(Number(e.target.value))}
                  className="accent-blue-600"
                />
                <p className="block text-sm font-medium text-gray-700 mb-1">
                  {value}
                </p>
              </div>
            ))}
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Tinggi
            </p>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-700 mb-1">
            Likelihood
          </label>

          <div className="flex items-center justify-start gap-10 mt-2  p-2 mb-4 border border-gray-300 rounded h-24">
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Rendah
            </p>
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="mx-auto">
                <input
                  type="radio"
                  name="likelihood"
                  value={value}
                  checked={likelihood === value}
                  onChange={(e) => setLikelihood(Number(e.target.value))}
                  className="accent-blue-600"
                />
                <p className="block text-sm font-medium text-gray-700 mb-1">
                  {value}
                </p>
              </div>
            ))}
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Tinggi
            </p>
          </div>
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
            onClick={assess}
            disabled={loading}
            className="w-1/4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Menyimpan..." : "Hitung Risiko"}
          </button>
        </div>
      </div>
    </div>
  );
}
