"use client";

import { useState } from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";

const COLORS = ["#2d2f6b", "#3d3f8f", "#5a5ca8", "#8b8dc4", "#c0c2e0"];
const chartConfig = { amount: { label: "Amount" } };
const fmt = (n: number) => "$" + n.toLocaleString("en-US");

type DataPoint = { category: string; amount: number };

type Props = {
  monthlyData: DataPoint[];
  weeklyData: DataPoint[];
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const color = item.payload?.fill ?? COLORS[0];

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
      <p style={{ fontSize: "11px", color: "#6b7280", marginBottom: "6px" }}>Amount</p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "2px",
            backgroundColor: color,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "13px", color: "#374151" }}>{item.name}</span>
      </div>
      <p style={{ fontSize: "13px", fontWeight: 600, color: "#111827", marginTop: "4px", paddingLeft: "18px" }}>
        {fmt(item.value)}
      </p>
    </div>
  );
}

export function ExpensesChart({ monthlyData, weeklyData }: Props) {
  const [view, setView] = useState<"monthly" | "weekly">("monthly");

  const data  = view === "monthly" ? monthlyData : weeklyData;
  const total = data.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold text-gray-900">Expenses Overview</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("monthly")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "monthly" ? "bg-slate-900 text-white" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setView("weekly")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "weekly" ? "bg-slate-900 text-white" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col sm:flex-row items-start gap-8">

        {/* Donut */}
        <div className="relative w-48 h-48 shrink-0 mx-auto sm:mx-0">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                innerRadius={55}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 50 }}
              />
            </PieChart>
          </ChartContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
            <span className="text-lg font-bold text-gray-900">{fmt(total)}</span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 w-full min-w-0">
          {data.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              No expenses this {view === "monthly" ? "month" : "week"}
            </p>
          )}

          {data.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 py-2.5 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 truncate">{item.category}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {fmt(item.amount)}
              </span>
            </div>
          ))}

          {data.length > 0 && (
            <div className="flex justify-between items-center pt-3 mt-1">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className="text-sm font-semibold text-gray-900">{fmt(total)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}