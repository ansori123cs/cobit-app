"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AccessControlPage() {
  const [exist, setExist] = useState(false);
  const [effective, setEffective] = useState(false);
  const [notes, setNotes] = useState("");

  const save = async () => {
    const { error } = await supabase.from("general_controls").insert({
      control_area: "Kontrol Akses",
      control_name: "Pembatasan hak akses pengguna",
      is_exist: exist,
      is_effective: effective,
      notes,
    });

    if (!error) alert("Kontrol Akses berhasil disimpan");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h1 className="text-xl font-bold mb-4">
        General Control – Kontrol Akses
      </h1>

      <div className="space-y-3">
        <label className="block">
          <input type="checkbox" onChange={(e) => setExist(e.target.checked)} />{" "}
          Kontrol tersedia
        </label>

        <label className="block">
          <input
            type="checkbox"
            onChange={(e) => setEffective(e.target.checked)}
          />{" "}
          Kontrol efektif
        </label>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Catatan audit"
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={save}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}
