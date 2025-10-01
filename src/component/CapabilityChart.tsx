'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type Row = {
  subprocess_id: number;
  subprocess_code: string;
  capability_score: number;
  capability_level: number;
};

export default function CapabilityChart() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Memanggil stored function compute_capability di Supabase
      const { data, error } = await supabase.rpc('compute_capability');
      if (error) {
        console.error(error);
        console.log(error);
        setRows([]);
      } else {
        // data mungkin berupa array of objects
        setRows((data as any) || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div>Loading chart...</div>;
  if (!rows.length) return <div>Tidak ada data capability.</div>;

  const categories = rows.map((r) => r.subprocess_code);
  const series = [
    {
      name: 'Capability Score',
      data: rows.map((r) => Number(r.capability_score)),
    },
  ];

  const options = {
    chart: { id: 'capability-chart', toolbar: { show: true } },
    xaxis: { categories },
    yaxis: { title: { text: 'Score (%)' }, min: 0, max: 100 },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (val: number) => `${val}%` } },
  };

  return (
    <div className='bg-white shadow rounded p-4'>
      <h2 className='text-lg font-semibold mb-4'>Capability per Subprocess</h2>
      <Chart options={options} series={series} type='bar' height={420} />
    </div>
  );
}
