"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type SeriesData = {
  name: string;
  data: number[];
};

type Props = {
  series: SeriesData[];
  categories: string[];
};

export default function DashboardChart({ series, categories }: Props) {
  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`,
    },
    xaxis: {
      categories,
    },
  };

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  );
}
