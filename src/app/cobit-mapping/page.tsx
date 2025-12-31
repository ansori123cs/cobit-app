"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { Risk, CobitMap } from "@/types/auth";

export default function CobitMapping() {
  const [selectedRiskId, setSelectedRiskId] = useState("");
  const [domain, setDomain] = useState("");
  const [process, setProcess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [risks, setRisks] = useState<Risk[]>([]);
  const [cobbitMap, setCobbitMap] = useState<CobitMap[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setDataLoading(true);
    try {
      const { data, error } = await supabase.from("cobit_mapping").select(`
        id,
        domain,
        process,
        risk:risk_register!risk_id (
          area_control,
          risk_description
        )
      `);
      if (error) throw error;
      setCobbitMap(data || []);
    } catch (err: any | Error) {
      setError("Gagal memuat data mapping.");
    } finally {
      setDataLoading(false);
    }
  };
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
      load();
    } catch (err: any | Error) {
      setError(err.message || "Gagal menyimpan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Pemetaan COBIT 2019
      </h1>
      {error && (
        <p className="text-red-500 mb-4 bg-red-100 p-3 rounded">{error}</p>
      )}
      {success && (
        <p className="text-green-500 mb-4 bg-green-100 p-3 rounded">
          {success}
        </p>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Hasil Pemetaan COBIT 2019
        </h2>
        {dataLoading ? (
          <p>Memuat data...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left border border-gray-300">
                  Area Kontrol
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Risiko TI
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Domain COBIT
                </th>
                <th className="p-3 text-left border border-gray-300">
                  Proses COBIT
                </th>
              </tr>
            </thead>
            <tbody>
              {cobbitMap.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    Belum ada data mapping COBIT.
                  </td>
                </tr>
              ) : (
                cobbitMap.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {/* <td className="p-3 border border-gray-300">{row.risk}</td>
                    <td className="p-3 border border-gray-300">{row.risk}</td> */}
                    <td className="p-3 border border-gray-300 font-semibold">
                      {row.domain}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {row.process}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Tambah Mapping Baru</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Risiko
            </label>
            <select
              value={selectedRiskId}
              onChange={(e) => setSelectedRiskId(e.target.value)}
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
              <p className="text-sm text-gray-500 mt-1">
                Memuat data risiko...
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain COBIT
            </label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
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
            <select
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              className="py-2.5 sm:py-3 px-4 block w-full border-gray-200 rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              disabled={loading}
            >
              <option value="">-- Pilih Proses --</option>
              <optgroup label="DSS (Deliver, Service and Support)">
                <option value="DSS01">DSS01 - Manage Operations</option>
                <option value="DSS02">
                  DSS02 - Manage Service Requests and Incidents
                </option>
                <option value="DSS03">DSS03 - Manage Problems</option>
                <option value="DSS04">DSS04 - Manage Continuity</option>
                <option value="DSS05">DSS05 - Manage Security Services</option>
                <option value="DSS06">
                  DSS06 - Manage Business Process Controls
                </option>
              </optgroup>
              <optgroup label="APO (Align, Plan and Organise)">
                <option value="APO01">
                  APO01 - Manage I&T Management Framework
                </option>
                <option value="APO02">APO02 - Manage Strategy</option>
                <option value="APO03">
                  APO03 - Manage Enterprise Architecture
                </option>
                <option value="APO04">APO04 - Manage Innovation</option>
                <option value="APO05">APO05 - Manage Portfolio</option>
                <option value="APO06">APO06 - Manage Budget and Costs</option>
                <option value="APO07">APO07 - Manage Human Resources</option>
                <option value="APO08">APO08 - Manage Relationships</option>
                <option value="APO09">APO09 - Manage Service Agreements</option>
                <option value="APO10">APO10 - Manage Suppliers</option>
                <option value="APO11">APO11 - Manage Quality</option>
                <option value="APO12">APO12 - Manage Risk</option>
                <option value="APO13">APO13 - Manage Security</option>
                <option value="APO14">APO14 - Manage Data</option>
              </optgroup>
              <optgroup label="BAI (Build, Acquire and Implement)">
                <option value="BAI01">
                  BAI01 - Manage Programmes and Projects
                </option>
                <option value="BAI02">
                  BAI02 - Manage Requirements Definition
                </option>
                <option value="BAI03">
                  BAI03 - Manage Solutions Identification and Build
                </option>
                <option value="BAI04">
                  BAI04 - Manage Availability and Capacity
                </option>
                <option value="BAI05">
                  BAI05 - Manage Organisational Change Enablement
                </option>
                <option value="BAI06">BAI06 - Manage Changes</option>
                <option value="BAI07">
                  BAI07 - Manage Change Acceptance and Transitioning
                </option>
                <option value="BAI08">BAI08 - Manage Knowledge</option>
                <option value="BAI09">BAI09 - Manage Assets</option>
                <option value="BAI10">BAI10 - Manage Configuration</option>
              </optgroup>
              <optgroup label="MEA (Monitor, Evaluate and Assess)">
                <option value="MEA01">
                  MEA01 - Monitor, Evaluate and Assess Performance and
                  Conformance
                </option>
                <option value="MEA02">
                  MEA02 - Monitor, Evaluate and Assess the System of Internal
                  Controls
                </option>
                <option value="MEA03">
                  MEA03 - Monitor, Evaluate and Assess Compliance with External
                  Requirements
                </option>
              </optgroup>
              <optgroup label="EDM (Evaluate, Direct and Monitor)">
                <option value="EDM01">
                  EDM01 - Ensure Governance Framework Setting and Maintenance
                </option>
                <option value="EDM02">EDM02 - Ensure Benefits Delivery</option>
                <option value="EDM03">EDM03 - Ensure Risk Optimisation</option>
                <option value="EDM04">
                  EDM04 - Ensure Resource Optimisation
                </option>
                <option value="EDM05">
                  EDM05 - Ensure Stakeholder Transparency
                </option>
              </optgroup>
            </select>
          </div>
          <button
            onClick={saveMapping}
            disabled={loading}
            className="w-full py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
