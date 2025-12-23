"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Loader from "@/component/Loader";

export default function Hasil() {
  const [hasil, setHasil] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const { data, error: rpcError } = await supabase.rpc(
          "compute_capability"
        );
        if (rpcError) throw rpcError;
        setHasil(data || []);
      } catch (err: any) {
        setError(err.message || "Gagal memuat hasil capability.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Hasil Capability
      </h1>
      {hasil.length === 0 ? (
        <p className="text-gray-500">Tidak ada data hasil capability.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left border border-gray-300">
                Subprocess
              </th>
              <th className="p-3 text-left border border-gray-300">Score</th>
              <th className="p-3 text-left border border-gray-300">Level</th>
            </tr>
          </thead>
          <tbody>
            {hasil.map((h) => (
              <tr key={h.subprocess_id} className="hover:bg-gray-50">
                <td className="p-3 border border-gray-300">
                  {h.subprocess_code}
                </td>
                <td className="p-3 border border-gray-300">
                  {h.capability_score}%
                </td>
                <td className="p-3 border border-gray-300">
                  {h.capability_level}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
