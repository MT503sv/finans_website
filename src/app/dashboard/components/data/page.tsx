import { prisma } from "@/lib/prisma";

export default async function Data() {
  const now = new Date();

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const [
    thisMonthIncomes,
    lastMonthIncomes,
    thisMonthExpenses,
    lastMonthExpenses,
    todaySales,
  ] = await Promise.all([
    prisma.incomes.aggregate({
      _sum: { amount: true },
      where: { date: { gte: thisMonthStart, lte: thisMonthEnd } },
    }),
    prisma.incomes.aggregate({
      _sum: { amount: true },
      where: { date: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.outflows.aggregate({
      _sum: { amount: true },
      where: { date: { gte: thisMonthStart, lte: thisMonthEnd } },
    }),
    prisma.outflows.aggregate({
      _sum: { amount: true },
      where: { date: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.sales.findMany({
      where: { date: { gte: todayStart, lte: todayEnd } },
      select: { quantity_of_sold_items: true, price_of_item: true },
    }),
  ]);

  const totalIncomeThis  = thisMonthIncomes._sum.amount  ?? 0;
  const totalIncomeLast  = lastMonthIncomes._sum.amount  ?? 0;
  const totalExpenseThis = thisMonthExpenses._sum.amount ?? 0;
  const totalExpenseLast = lastMonthExpenses._sum.amount ?? 0;
  const totalProfit      = totalIncomeThis - totalExpenseThis;
  const totalSalesToday  = todaySales.reduce(
    (sum, s) => sum + (s.quantity_of_sold_items ?? 0) * (s.price_of_item ?? 0), 0
  );

  
  const incomePct  = totalIncomeLast  > 0 ? Math.round(((totalIncomeThis  - totalIncomeLast)  / totalIncomeLast)  * 100) : null;
  const expensePct = totalExpenseLast > 0 ? Math.round(((totalExpenseThis - totalExpenseLast) / totalExpenseLast) * 100) : null;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  const pctLabel = (pct: number | null, inverse = false) => {
    if (pct === null) return <span className="text-xs text-gray-400">No data last month</span>;
    const positive = inverse ? pct < 0 : pct >= 0;
    return (
      <span className={`text-xs font-medium ${positive ? "text-green-500" : "text-red-500"}`}>
        {pct >= 0 ? "+$" : ""}{pct} vs last month
      </span>
    );
  };

  return (
    <div className="text-black font-sans">
      <div className="mb-4 mt-3">
        <h1 className="text-2xl font-bold text-[#010221]">Dashboard</h1>
      </div>
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">

        
        <div className="bg-white shadow-lg rounded-lg p-5">
          <h2 className="font-semibold text-xs text-gray-500">Sales today</h2>
          <h2 className="font-bold text-2xl mt-1">{fmt(totalSalesToday)}</h2>
        </div>

        
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="font-semibold text-xs text-gray-500">Income</h2>
          <h2 className="font-bold text-2xl mt-1">{fmt(totalIncomeThis)}</h2>
          <div className="mt-2">
            {pctLabel(incomePct)}
            <div className="mt-1 h-1 bg-gray-100 rounded-full">
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${Math.min(Math.abs(incomePct ?? 0), 100)}%`,
                  backgroundColor: (incomePct ?? 0) >= 0 ? "#22c55e" : "#ef4444",
                }}
              />
            </div>
          </div>
        </div>

        
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="font-semibold text-xs text-gray-500">Expenses</h2>
          <h2 className="font-bold text-2xl mt-1">{fmt(totalExpenseThis)}</h2>
          <div className="mt-2">
            {pctLabel(expensePct, true)}
            <div className="mt-1 h-1 bg-gray-100 rounded-full">
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${Math.min(Math.abs(expensePct ?? 0), 100)}%`,
                  backgroundColor: (expensePct ?? 0) <= 0 ? "#22c55e" : "#ef4444",
                }}
              />
            </div>
          </div>
        </div>

        
        <div className="bg-slate-950 shadow-lg rounded-lg p-4">
          <h2 className="font-bold text-xs text-slate-400">Profit</h2>
          <h2 className="font-bold text-2xl text-white mt-1">{fmt(totalProfit)}</h2>
          <p className="text-xs text-slate-400 mt-2">This month</p>
        </div>

      </div>
    </div>
  );
}