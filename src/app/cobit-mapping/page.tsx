"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState, useEffect } from "react";
import { Risk, CobitMap } from "@/types/auth";
import dynamic from "next/dynamic";

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

  const Select = dynamic(() => import("react-select"), {
    ssr: false,
    loading: () => (
      <div className="w-full h-[38px] bg-gray-100 rounded animate-pulse"></div>
    ),
  });

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
        risk_id
      `);

      if (error) throw error;

      // Fetch risks separately atau gunakan RPC jika perlu
      const riskIds = data.map((item) => item.risk_id).filter(Boolean);

      if (riskIds.length > 0) {
        const { data: risksData, error: risksError } = await supabase
          .from("risk_register")
          .select("id, area_control, risk_description")
          .in("id", riskIds);

        if (risksError) throw risksError;

        // Gabungkan data
        const combinedData = data.map((item) => ({
          ...item,
          risk: risksData?.find((r) => r.id === item.risk_id) || null,
        }));

        setCobbitMap(combinedData);
      } else {
        setCobbitMap(data.map((item) => ({ ...item, risk: null })));
      }
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
                    <td className="p-3 border border-gray-300">
                      {row.risk?.area_control}
                    </td>
                    <td className="p-3 border border-gray-300">
                      {row.risk?.risk_description}
                    </td>
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
            <Select
              instanceId="risk-select"
              value={
                selectedRiskId
                  ? {
                      value: selectedRiskId,
                      label:
                        risks.find((r) => r.id === selectedRiskId)
                          ?.area_control +
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
              <p className="text-sm text-gray-500 mt-1">
                Memuat data risiko...
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain COBIT
            </label>
            <Select
              value={
                domain
                  ? {
                      value: domain,
                      label:
                        domain === "DSS"
                          ? "DSS (Deliver, Service and Support)"
                          : domain === "APO"
                            ? "APO (Align, Plan and Organise)"
                            : domain === "BAI"
                              ? "BAI (Build, Acquire and Implement)"
                              : domain === "MEA"
                                ? "MEA (Monitor, Evaluate and Assess)"
                                : "EDM (Evaluate, Direct and Monitor)",
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setDomain(selectedOption ? selectedOption.value : "")
              }
              options={[
                { value: "DSS", label: "DSS (Deliver, Service and Support)" },
                { value: "APO", label: "APO (Align, Plan and Organise)" },
                { value: "BAI", label: "BAI (Build, Acquire and Implement)" },
                { value: "MEA", label: "MEA (Monitor, Evaluate and Assess)" },
                { value: "EDM", label: "EDM (Evaluate, Direct and Monitor)" },
              ]}
              isSearchable={true}
              isClearable={true}
              placeholder="-- Pilih Domain --"
              className="w-full"
              isDisabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proses COBIT
            </label>
            <Select
              instanceId="domain-select"
              value={process ? { value: process, label: process } : null}
              onChange={(selectedOption) =>
                setProcess(selectedOption ? selectedOption.value : "")
              }
              options={[
                {
                  label: "DSS (Deliver, Service and Support)",
                  options: [
                    { value: "DSS01", label: "DSS01 - Manage Operations" },
                    {
                      value: "DSS02",
                      label: "DSS02 - Manage Service Requests and Incidents",
                    },
                    { value: "DSS03", label: "DSS03 - Manage Problems" },
                    { value: "DSS04", label: "DSS04 - Manage Continuity" },
                    {
                      value: "DSS05",
                      label: "DSS05 - Manage Security Services",
                    },
                    {
                      value: "DSS06",
                      label: "DSS06 - Manage Business Process Controls",
                    },
                  ],
                },
                {
                  label: "APO (Align, Plan and Organise)",
                  options: [
                    {
                      value: "APO01",
                      label: "APO01 - Manage I&T Management Framework",
                    },
                    { value: "APO02", label: "APO02 - Manage Strategy" },
                    {
                      value: "APO03",
                      label: "APO03 - Manage Enterprise Architecture",
                    },
                    { value: "APO04", label: "APO04 - Manage Innovation" },
                    { value: "APO05", label: "APO05 - Manage Portfolio" },
                    {
                      value: "APO06",
                      label: "APO06 - Manage Budget and Costs",
                    },
                    { value: "APO07", label: "APO07 - Manage Human Resources" },
                    { value: "APO08", label: "APO08 - Manage Relationships" },
                    {
                      value: "APO09",
                      label: "APO09 - Manage Service Agreements",
                    },
                    { value: "APO10", label: "APO10 - Manage Suppliers" },
                    { value: "APO11", label: "APO11 - Manage Quality" },
                    { value: "APO12", label: "APO12 - Manage Risk" },
                    { value: "APO13", label: "APO13 - Manage Security" },
                    { value: "APO14", label: "APO14 - Manage Data" },
                  ],
                },
                {
                  label: "BAI (Build, Acquire and Implement)",
                  options: [
                    {
                      value: "BAI01",
                      label: "BAI01 - Manage Programmes and Projects",
                    },
                    {
                      value: "BAI02",
                      label: "BAI02 - Manage Requirements Definition",
                    },
                    {
                      value: "BAI03",
                      label:
                        "BAI03 - Manage Solutions Identification and Build",
                    },
                    {
                      value: "BAI04",
                      label: "BAI04 - Manage Availability and Capacity",
                    },
                    {
                      value: "BAI05",
                      label: "BAI05 - Manage Organisational Change Enablement",
                    },
                    { value: "BAI06", label: "BAI06 - Manage Changes" },
                    {
                      value: "BAI07",
                      label:
                        "BAI07 - Manage Change Acceptance and Transitioning",
                    },
                    { value: "BAI08", label: "BAI08 - Manage Knowledge" },
                    { value: "BAI09", label: "BAI09 - Manage Assets" },
                    { value: "BAI10", label: "BAI10 - Manage Configuration" },
                  ],
                },
                {
                  label: "MEA (Monitor, Evaluate and Assess)",
                  options: [
                    {
                      value: "MEA01",
                      label:
                        "MEA01 - Monitor, Evaluate and Assess Performance and Conformance",
                    },
                    {
                      value: "MEA02",
                      label:
                        "MEA02 - Monitor, Evaluate and Assess the System of Internal Controls",
                    },
                    {
                      value: "MEA03",
                      label:
                        "MEA03 - Monitor, Evaluate and Assess Compliance with External Requirements",
                    },
                  ],
                },
                {
                  label: "EDM (Evaluate, Direct and Monitor)",
                  options: [
                    {
                      value: "EDM01",
                      label:
                        "EDM01 - Ensure Governance Framework Setting and Maintenance",
                    },
                    {
                      value: "EDM02",
                      label: "EDM02 - Ensure Benefits Delivery",
                    },
                    {
                      value: "EDM03",
                      label: "EDM03 - Ensure Risk Optimisation",
                    },
                    {
                      value: "EDM04",
                      label: "EDM04 - Ensure Resource Optimisation",
                    },
                    {
                      value: "EDM05",
                      label: "EDM05 - Ensure Stakeholder Transparency",
                    },
                  ],
                },
              ]}
              isSearchable={true}
              isClearable={true}
              placeholder="-- Pilih Proses --"
              className="w-full"
              isDisabled={loading}
            />
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
