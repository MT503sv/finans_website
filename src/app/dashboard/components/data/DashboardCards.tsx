"use client";

import { useState } from "react";
import { DashboardFilters, Period } from "./DashboardFilters";

export type PeriodData = {
    totalIncome: number;
    totalExpense: number;
    totalProfit: number;
    totalSales: number;
    incomePct: number | null;
    expensePct: number | null;
    salesPct: number | null;
};

type Props = {
    today: PeriodData;
    weekly: PeriodData;
    monthly: PeriodData;
};

export function DashboardCards({ today, weekly, monthly }: Props) {
    const [period, setPeriod] = useState<Period>("Today");

    const data = period === "Today" ? today : period === "Weekly" ? weekly : monthly;

    const fmt = (n: number) => "$" + n.toLocaleString("en-US");

    const pctLabel = (pct: number | null, inverse = false, isSalesDiff = false) => {
        if (pct === null)
            return <span className="text-xs text-gray-400">No prev data</span>;
        
        // Para diferencia de ventas
        if (isSalesDiff) {
            const positive = pct >= 0;
            return (
                <span className={`text-xs font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
                    {pct >= 0 ? "+" : ""}{pct} ventas vs prev period
                </span>
            );
        }
        
        // Para porcentajes
        const positive = inverse ? pct < 0 : pct >= 0;
        return (
            <span className={`text-xs font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
                {pct >= 0 ? "+" : ""}{pct}% vs prev period
            </span>
        );
    };

    return (
        <div className="text-black font-sans">
            <div className="flex items-center justify-between mb-4 mt-3">
                <h1 className="text-2xl font-bold text-[#010221]">Dashboard</h1>
                <DashboardFilters activePeriod={period} onPeriodChange={setPeriod} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">

                <div className="bg-slate-950 shadow-lg rounded-lg p-4">
                    <h2 className="font-bold text-xs text-slate-400">Profit</h2>
                    <h2 className="font-bold text-2xl text-white mt-1">{fmt(data.totalProfit)}</h2>
                    <p className="text-xs text-slate-400 mt-2 capitalize">{period}</p>
                </div>
                

                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h2 className="font-semibold text-xs text-gray-500">Income</h2>
                    <h2 className="font-bold text-2xl mt-1">{fmt(data.totalIncome)}</h2>
                    <div className="mt-2">
                        {pctLabel(data.incomePct)}
                        <div className="mt-1 h-1 bg-gray-100 rounded-full">
                            <div
                                className="h-1 rounded-full"
                                style={{
                                    width: `${Math.min(Math.abs(data.incomePct ?? 0), 100)}%`,
                                    backgroundColor: (data.incomePct ?? 0) >= 0 ? "#22c55e" : "#ef4444",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-4">
                    <h2 className="font-semibold text-xs text-gray-500">Expenses</h2>
                    <h2 className="font-bold text-2xl mt-1">{fmt(data.totalExpense)}</h2>
                    <div className="mt-2">
                        {pctLabel(data.expensePct, true)}
                        <div className="mt-1 h-1 bg-gray-100 rounded-full">
                            <div
                                className="h-1 rounded-full"
                                style={{
                                    width: `${Math.min(Math.abs(data.expensePct ?? 0), 100)}%`,
                                    backgroundColor: (data.expensePct ?? 0) <= 0 ? "#22c55e" : "#ef4444",
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="animated-border shadow-lg p-0">
                    <div className="animated-border-inner p-5">
                        <h2 className="font-semibold text-xs text-gray-500">Sales</h2>
                        <h2 className="font-bold text-2xl mt-1">{data.totalSales}</h2>
                        <div className="mt-2">
                            {pctLabel(data.salesPct, false, true)}
                            <div className="mt-1 h-1 bg-gray-100 rounded-full">
                                <div
                                    className="h-1 rounded-full"
                                    style={{
                                        width: `${Math.min(Math.abs(data.salesPct ?? 0), 100)}%`,
                                        backgroundColor: (data.salesPct ?? 0) >= 0 ? "#22c55e" : "#ef4444",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}