"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const chartConfig = {
  total: { label: "Income + Sales", color: "#bfdbfe" },
};

type DataPoint = { label: string; income: number; sales: number };

type Props = {
  monthlyData: DataPoint[];
  weeklyData: DataPoint[];
};

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        padding: "8px 12px",
        zIndex: 50,
      }}
    >
      <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>{label}</p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "2px",
            backgroundColor: "#bfdbfe",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "13px", color: "#374151" }}>Income + Sales</span>
      </div>
      <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", marginTop: "4px", paddingLeft: "18px" }}>
        {fmt(payload[0].value)}
      </p>
    </div>
  );
}

export function IncomesChart({ monthlyData, weeklyData }: Props) {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  const data = view === "monthly" ? monthlyData : weeklyData;

  const chartData = data.map(d => ({
    label: d.label,
    total: d.income + d.sales,
  }));

  const total = chartData.reduce((sum, d) => sum + d.total, 0);

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

      {/* Chart + Card */}
      <div className="flex flex-col sm:flex-row sm:gap-6 sm:items-start gap-4">
        <ChartContainer config={chartConfig} className="flex-1 h-64 sm:h-80 w-full">
          <BarChart
            data={chartData}
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
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickFormatter={(v) => `$${v.toLocaleString("en-US")}`}
              width={60}
              className="hidden sm:block"
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ zIndex: 50 }}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Card */}
        <div className="bg-indigo-50 rounded-xl p-4 sm:w-40 sm:shrink-0 flex sm:flex-col items-center sm:items-start justify-between sm:justify-start">
          <p className="text-xs text-gray-500 font-medium">Total Income</p>
          <p className="text-xl font-bold text-gray-900 sm:mt-1">{fmt(total)}</p>
        </div>
      </div>
    </div>
  );
}