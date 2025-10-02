'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'; // ✅ gunakan icon lucide-react

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
      const { data, error } = await supabase.from('questions').select(`
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
            code: q.subprocess?.code ?? '',
            domain: q.subprocess?.domain ?? { code: '', name: '' },
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
    if (!user) return alert('Harus login dulu');

    const payload = Object.entries(answers).map(([qid, val]) => ({
      user_id: user.id,
      question_id: parseInt(qid),
      answer_value: val,
    }));
    await supabase.from('answers').insert(payload);
    alert('Jawaban tersimpan!');
  };

  // ✅ Grouping pertanyaan per domain
  const grouped = useMemo(() => {
    return questions.reduce((acc, q) => {
      const d = `${q.subprocess.domain.code} - ${q.subprocess.domain.name}`;
      if (!acc[d]) acc[d] = [];
      acc[d].push(q);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [questions]);

  // ✅ cek apakah semua pertanyaan di domain sudah terjawab
  const isDomainComplete = (qs: Question[]) => qs.every((q) => answers[q.id] !== undefined && answers[q.id] !== null);

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {Object.entries(grouped).map(([domain, qs]) => {
        const complete = isDomainComplete(qs);
        const isOpen = openDomain === domain;

        return (
          <div key={domain} className='border rounded shadow bg-white'>
            {/* Header Accordion */}
            <div className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100' onClick={() => setOpenDomain(isOpen ? null : domain)}>
              <h2 className='text-lg font-bold flex items-center gap-2'>
                {domain}
                {complete && <CheckCircle className='text-green-500 w-5 h-5' />}
              </h2>
              {isOpen ? <ChevronUp className='w-5 h-5 text-gray-600' /> : <ChevronDown className='w-5 h-5 text-gray-600' />}
            </div>

            {/* Body Accordion */}
            {isOpen && (
              <div className='p-4 space-y-3 border-t'>
                {qs.map((q) => (
                  <div key={q.id} className='mb-3'>
                    <p className='font-medium'>
                      {q.subprocess.code} (Level {q.level}): {q.text}
                    </p>
                    <input
                      type='number'
                      min={0}
                      max={100}
                      className='border p-2 rounded w-24'
                      value={answers[q.id] ?? ''}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [q.id]: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button className='bg-green-600 text-white px-4 py-2 rounded'>Kirim</button>
    </form>
  );
}
