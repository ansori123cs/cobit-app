"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function RecommendationPage() {
  const [riskId, setRiskId] = useState("");
  const [rec, setRec] = useState("");

  const saveRec = async () => {
    await supabase.from("governance_recommendations").insert({
      risk_id: riskId,
      recommendation: rec,
    });
    alert("Rekomendasi disimpan");
  };

  return (
    <div>
      <h1>Rekomendasi Tata Kelola TI</h1>
      <input
        placeholder="Risk ID"
        onChange={(e) => setRiskId(e.target.value)}
      />
      <textarea
        placeholder="Rekomendasi"
        onChange={(e) => setRec(e.target.value)}
      />
      <button onClick={saveRec}>Simpan</button>
    </div>
  );
}
