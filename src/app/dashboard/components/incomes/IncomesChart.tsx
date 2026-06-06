"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  income: { label: "Income", color: "#bfdbfe" },
};

type DataPoint = { label: string; income: number };

type Props = {
  monthlyData: DataPoint[];
  weeklyData: DataPoint[];
};

export function IncomesChart({ monthlyData, weeklyData }: Props) {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  const data = view === "monthly" ? monthlyData : weeklyData;
  const total = data.reduce((sum, d) => sum + d.income, 0);
  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Income</h2>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("monthly")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "monthly"
                ? "bg-slate-900 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "weekly"
                ? "bg-slate-900 text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Chart + Card: columna en móvil, fila en sm+ */}
      <div className="flex flex-col sm:flex-row sm:gap-6 sm:items-start gap-4">
        <ChartContainer
          config={chartConfig}
          className="flex-1 h-64 sm:h-80 w-full"
        >
          <BarChart
            data={data}
            margin={{ top: 10, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            {/* YAxis oculto en móvil para ganar espacio */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickFormatter={(v) => `$${v.toLocaleString("en-US")}`}
              width={60}
              className="hidden sm:block"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Card: ancho completo en móvil, fijo en sm+ */}
        <div className="bg-indigo-50 rounded-xl p-4 sm:w-40 sm:shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start">
          <p className="text-xs text-gray-500 font-medium">Total Income</p>
          <p className="text-xl font-bold text-gray-900 sm:mt-1">{fmt(total)}</p>
        </div>
      </div>
    </div>
  );
}