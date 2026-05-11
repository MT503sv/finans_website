"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { category: "Commodity",       amount: 1060 },
  { category: "Basic services",  amount: 381  },
  { category: "Incidentals",     amount: 254  },
  { category: "Marketing",       amount: 212  },
  { category: "Rent",            amount: 212  },
];

const COLORS = ["#2d2f6b", "#3d3f8f", "#5a5ca8", "#8b8dc4", "#c0c2e0"];

const total = data.reduce((sum, d) => sum + d.amount, 0);

const chartConfig = {
  amount: { label: "Amount" },
};

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

export default function ExpensesOverview() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-5xl">
      <h2 className="text-base font-bold text-gray-900 mb-4">Expenses Overview</h2>

      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Donut chart */}
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
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>

          {/* Texto del centro */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-bold text-gray-900">{fmt(total)}</span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
        </div>

        {/* Tabla de categorías */}
        <div className="flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i] }}
                />
                <span className="text-sm text-gray-600">{item.category}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{fmt(item.amount)}</span>
            </div>
          ))}

          {/* Total row */}
          <div className="flex justify-between pt-2 mt-1">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className="text-sm font-semibold text-gray-900">{fmt(total)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}