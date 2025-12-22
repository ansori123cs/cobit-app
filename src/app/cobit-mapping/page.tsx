"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function CobitMapping() {
  const [riskId, setRiskId] = useState("");
  const [domain, setDomain] = useState("");
  const [process, setProcess] = useState("");

  const saveMapping = async () => {
    await supabase.from("cobit_mapping").insert({
      risk_id: riskId,
      domain,
      process,
    });
    alert("Mapping COBIT disimpan");
  };

  return (
    <div>
      <h1>Pemetaan COBIT 2019</h1>
      <input
        placeholder="Risk ID"
        onChange={(e) => setRiskId(e.target.value)}
      />
      <input
        placeholder="Domain (DSS/APO/...)"
        onChange={(e) => setDomain(e.target.value)}
      />
      <input
        placeholder="Proses COBIT"
        onChange={(e) => setProcess(e.target.value)}
      />
      <button onClick={saveMapping}>Simpan</button>
    </div>
  );
}
