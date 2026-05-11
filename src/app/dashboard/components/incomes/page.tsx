// components/IncomeChart.tsx
"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { month: "Jan", income: 1000 },
  { month: "Feb", income: 2800 },
  { month: "Mar", income: 3200 },
  { month: "Apr", income: 4600 },
  { month: "May", income: 3000 },
  { month: "Jun", income: 4800 },
];

const chartConfig = {
  income: {
    label: "Income",
    color: "#bfdbfe", // azul claro como en la imagen
  },
};

export default function incomes() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full ">
      <h2 className="text-base font-bold text-gray-900 mb-4">Income</h2>

      <ChartContainer config={chartConfig} className="w-full h-80">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 13 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#6b7280", fontSize: 13 }}
            tickFormatter={(v) => `$${v.toLocaleString("en-US")}`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="income"
            fill="var(--color-income)"
            radius={[4, 4, 0, 0]} // bordes redondeados arriba
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}