"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "@/component/Loader";

type Question = {
  id: number;
  text: string;
  level: number;
  subprocess: {
    code: string;
    domain: { code: string; name: string };
  };
};

export default function Kuesioner() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [openDomain, setOpenDomain] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("questions").select(`
        id, text, level,
        subprocess:subprocesses (
          code,
          domain:domains (code, name)
        )
      `);

      if (error) {
        console.error(error.message);
        setLoading(false);
        return;
      }

      if (data) {
        const normalized = data.map((q: any) => ({
          id: q.id,
          text: q.text,
          level: q.level,
          subprocess: {
            code: q.subprocess?.code ?? "",
            domain: q.subprocess?.domain ?? { code: "", name: "" },
          },
        }));
        setQuestions(normalized as Question[]);
      }
      setLoading(false);
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Harus login dulu");
      return;
    }

    const payload = Object.entries(answers).map(([qid, val]) => ({
      user_id: user.id,
      question_id: parseInt(qid),
      answer_value: val,
    }));

    try {
      const { error } = await supabase.from("answers").insert(payload);
      if (error) throw error;
      alert("Jawaban tersimpan!");
    } catch (err: any) {
      alert("Gagal menyimpan jawaban: " + err.message);
    }
  };

  // ✅ Group by domain
  const grouped = useMemo(() => {
    return questions.reduce((acc, q) => {
      const d = `${q.subprocess.domain.code} - ${q.subprocess.domain.name}`;
      if (!acc[d]) acc[d] = [];
      acc[d].push(q);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [questions]);

  // ✅ cek apakah semua pertanyaan di domain sudah terisi
  const isDomainComplete = (qs: Question[]) =>
    qs.every((q) => answers[q.id] !== undefined);

  if (loading) return <Loader />;

  return (
    <div className=" bg-white shadow rounded-lg p-6 mb-6">
      <h1 className="text-2xl font-bold flex items-center mb-3">
        Daftar Pertanyaan
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(grouped).map(([domain, qs]) => {
          const complete = isDomainComplete(qs);
          const isOpen = openDomain === domain;

          return (
            <div key={domain} className="border rounded shadow bg-white">
              {/* Accordion Header */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setOpenDomain(isOpen ? null : domain)}
              >
                <h2 className="text-lg font-bold flex items-center gap-2">
                  {domain}
                  {complete && (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  )}
                </h2>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {/* Accordion Body dengan animasi */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t p-4 space-y-4"
                  >
                    {qs.map((q) => (
                      <div key={q.id} className="mb-4">
                        <p className="font-medium mb-2">
                          <span className="font-bold">{q.subprocess.code}</span>{" "}
                          - (Level {q.level}) : {q.text}
                        </p>

                        {/* Radio buttons 0–10 */}
                        <div className="flex gap-3 flex-wrap">
                          {Array.from({ length: 11 }).map((_, val) => (
                            <label
                              key={val}
                              className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded border 
                              ${
                                answers[q.id] === val
                                  ? "bg-green-100 border-green-500"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={val}
                                checked={answers[q.id] === val}
                                onChange={() =>
                                  setAnswers({
                                    ...answers,
                                    [q.id]: val,
                                  })
                                }
                                className="hidden"
                              />
                              {val}
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        <div className="flex justify-end">
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
