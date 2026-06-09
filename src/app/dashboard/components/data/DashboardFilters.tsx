"use client";

export type Period = "Today" | "Weekly" | "Monthly";

type Props = {
  activePeriod: Period;
  onPeriodChange: (period: Period) => void;
};

export function DashboardFilters({ activePeriod, onPeriodChange }: Props) {
  return (
    <div className="flex gap-0.5 sm:gap-1 bg-gray-100 rounded-lg p-1">
      {(["Today", "Weekly", "Monthly"] as Period[]).map((p) => (
        <button
          key={p}
          onClick={() => onPeriodChange(p)}
          className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium capitalize transition-colors ${
            activePeriod === p
              ? "bg-slate-900 text-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}