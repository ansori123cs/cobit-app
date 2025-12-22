"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RiskPage() {
  const [area, setArea] = useState("");
  const [desc, setDesc] = useState("");

  const saveRisk = async () => {
    await supabase.from("risk_register").insert({
      area_control: area,
      risk_description: desc,
    });
    alert("Risiko disimpan");
  };

  return (
    <div>
      <h1>Identifikasi Risiko TI</h1>
      <input
        placeholder="Area Kontrol"
        onChange={(e) => setArea(e.target.value)}
      />
      <textarea
        placeholder="Deskripsi Risiko"
        onChange={(e) => setDesc(e.target.value)}
      />
      <button onClick={saveRisk}>Simpan</button>
    </div>
  );
}
