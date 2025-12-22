"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ChangeControlPage() {
  const [exist, setExist] = useState(false);
  const [effective, setEffective] = useState(false);
  const [notes, setNotes] = useState("");

  const save = async () => {
    await supabase.from("general_controls").insert({
      control_area: "Change Management",
      control_name: "Pengelolaan perubahan sistem",
      is_exist: exist,
      is_effective: effective,
      notes,
    });
    alert("Change Management disimpan");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-xl font-bold mb-4">
        General Control – Change Management
      </h1>
      <input type="checkbox" onChange={(e) => setExist(e.target.checked)} />{" "}
      Kontrol tersedia
      <br />
      <input
        type="checkbox"
        onChange={(e) => setEffective(e.target.checked)}
      />{" "}
      Kontrol efektif
      <br />
      <textarea
        className="border w-full p-2 mt-2"
        onChange={(e) => setNotes(e.target.value)}
      />
      <button
        onClick={save}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Simpan
      </button>
    </div>
  );
}
