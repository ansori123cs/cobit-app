"use client";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function AssessmentPage() {
  const { id } = useParams();
  const [impact, setImpact] = useState(1);
  const [likelihood, setLikelihood] = useState(1);

  const assess = async () => {
    await supabase.from("risk_assessment").insert({
      risk_id: id,
      impact,
      likelihood,
    });
    alert("Penilaian risiko tersimpan");
  };

  return (
    <div>
      <h1>Penilaian Risiko</h1>
      <input
        type="number"
        min={1}
        max={5}
        onChange={(e) => setImpact(+e.target.value)}
      />
      <input
        type="number"
        min={1}
        max={5}
        onChange={(e) => setLikelihood(+e.target.value)}
      />
      <button onClick={assess}>Hitung Risiko</button>
    </div>
  );
}
