"use client";

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

type Props = {
  nextDebt: { debt_bank: string; amount: number; due_date: Date } | null;
  monthDebtsCount: number;
  monthDebtsTotal: number;
};

export function DebtsCards({ nextDebt, monthDebtsCount, monthDebtsTotal }: Props) {
  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#010221] sm:text-2xl">Debts Overview</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

        {/* Próxima Debt */}
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <h2 className="font-semibold text-xs text-gray-500">Next Debt</h2>
          {nextDebt ? (
            <>
              <h2 className="font-bold text-lg mt-1 truncate">{nextDebt.debt_bank}</h2>
              <p className="text-xl font-bold text-gray-900 mt-2">{fmt(nextDebt.amount)}</p>
              <p className="text-xs text-gray-400 mt-2">
                Due: {formatDate(nextDebt.due_date)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400 mt-2">No pending debts</p>
          )}
        </div>

        {/* Debts Agregadas en el Mes */}
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <h2 className="font-semibold text-xs text-gray-500">Debts Added</h2>
          <h2 className="font-bold text-2xl mt-1">{monthDebtsCount}</h2>
          <p className="text-xs text-gray-400 mt-2">This month</p>
        </div>

        {/* Total Gastado en Debts - Centrado en Mobile */}
        <div className="bg-slate-950 shadow-lg rounded-lg p-4 col-span-2 lg:col-span-1 mx-auto w-full lg:w-auto lg:mx-0 border border-slate-800">
          <h2 className="font-bold text-xs text-slate-400">Total Debts</h2>
          <h2 className="font-bold text-2xl text-white mt-1">{fmt(monthDebtsTotal)}</h2>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>

      </div>
    </div>
  );
}