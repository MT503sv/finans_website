"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900">Income</h2>

        {/* Botones */}
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

      <div className="flex gap-6 items-start">
        <ChartContainer config={chartConfig} className="flex-1 h-80">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
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
            <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>

        {/* Card lateral */}
        <div className="bg-indigo-50 rounded-xl p-4 w-40 shrink-0">
          <p className="text-xs text-gray-500 font-medium">Total Income</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{fmt(total)}</p>
        </div>
      </div>
    </div>
  );
}