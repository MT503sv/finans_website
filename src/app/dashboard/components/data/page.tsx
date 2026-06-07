import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DashboardCards } from "./DashboardCards";

export default async function Data() {
  const { userId } = await auth();
  
  if (!userId) return <div>Not authenticated</div>;

  const now = new Date();

  // ── Rangos ────────────────────────────────────────────────────
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const weekDay       = now.getDay();
  const weekStart     = new Date(now); weekStart.setDate(now.getDate() - weekDay); weekStart.setHours(0, 0, 0, 0);
  const weekEnd       = new Date(now); weekEnd.setDate(weekStart.getDate() + 6);   weekEnd.setHours(23, 59, 59, 999);
  const prevWeekStart = new Date(weekStart); prevWeekStart.setDate(weekStart.getDate() - 7);
  const prevWeekEnd   = new Date(weekEnd);   prevWeekEnd.setDate(weekEnd.getDate() - 7);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // ── Queries ───────────────────────────────────────────────────
  const [
    todayIncomes, todayExpenses, todaySalesRaw,
    weekIncomes, prevWeekIncomes, weekExpenses, prevWeekExpenses, weekSalesRaw, prevWeekSalesRaw,
    thisMonthIncomes, lastMonthIncomes, thisMonthExpenses, lastMonthExpenses, thisMonthSalesRaw, lastMonthSalesRaw,
  ] = await Promise.all([
    prisma.incomes.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: todayStart, lte: todayEnd } } }),
    prisma.outflows.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: todayStart, lte: todayEnd } } }),
    prisma.sales.findMany({ where: { user_id: userId, date: { gte: todayStart, lte: todayEnd } }, select: { quantity_of_sold_items: true, price_of_item: true } }),

    prisma.incomes.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: weekStart, lte: weekEnd } } }),
    prisma.incomes.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: prevWeekStart, lte: prevWeekEnd } } }),
    prisma.outflows.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: weekStart, lte: weekEnd } } }),
    prisma.outflows.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: prevWeekStart, lte: prevWeekEnd } } }),
    prisma.sales.findMany({ where: { user_id: userId, date: { gte: weekStart, lte: weekEnd } }, select: { quantity_of_sold_items: true, price_of_item: true } }),
    prisma.sales.findMany({ where: { user_id: userId, date: { gte: prevWeekStart, lte: prevWeekEnd } }, select: { quantity_of_sold_items: true, price_of_item: true } }),

    prisma.incomes.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.incomes.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.outflows.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: thisMonthStart, lte: thisMonthEnd } } }),
    prisma.outflows.aggregate({ _sum: { amount: true }, where: { user_id: userId, date: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.sales.findMany({ where: { user_id: userId, date: { gte: thisMonthStart, lte: thisMonthEnd } }, select: { quantity_of_sold_items: true, price_of_item: true } }),
    prisma.sales.findMany({ where: { user_id: userId, date: { gte: lastMonthStart, lte: lastMonthEnd } }, select: { quantity_of_sold_items: true, price_of_item: true } }),
  ]);

  // ── Helpers ───────────────────────────────────────────────────
  const sumSales = (s: { quantity_of_sold_items: number | null; price_of_item: number | null }[]) =>
    s.reduce((acc, x) => acc + (x.quantity_of_sold_items ?? 0) * (x.price_of_item ?? 0), 0);

  const pct = (current: number, prev: number) =>
    prev > 0 ? Math.round(((current - prev) / prev) * 100) : null;

  // ── Cálculos ──────────────────────────────────────────────────
  const todayIncome  = (todayIncomes._sum.amount ?? 0) + sumSales(todaySalesRaw);
  const todayExpense = todayExpenses._sum.amount ?? 0;

  const weekIncome      = (weekIncomes._sum.amount ?? 0) + sumSales(weekSalesRaw);
  const prevWeekIncome  = (prevWeekIncomes._sum.amount ?? 0) + sumSales(prevWeekSalesRaw);
  const weekExpense     = weekExpenses._sum.amount ?? 0;
  const prevWeekExpense = prevWeekExpenses._sum.amount ?? 0;

  const monthIncome  = (thisMonthIncomes._sum.amount ?? 0) + sumSales(thisMonthSalesRaw);
  const lastIncome   = (lastMonthIncomes._sum.amount ?? 0) + sumSales(lastMonthSalesRaw);
  const monthExpense = thisMonthExpenses._sum.amount ?? 0;
  const lastExpense  = lastMonthExpenses._sum.amount ?? 0;

  return (
    <DashboardCards
      today={{
        totalIncome:  todayIncome,
        totalExpense: todayExpense,
        totalProfit:  todayIncome - todayExpense,
        totalSales:   todaySalesRaw.length,
        incomePct:    null,
        expensePct:   null,
        salesPct:     null,
      }}
      weekly={{
        totalIncome:  weekIncome,
        totalExpense: weekExpense,
        totalProfit:  weekIncome - weekExpense,
        totalSales:   weekSalesRaw.length,
        incomePct:    pct(weekIncome, prevWeekIncome),
        expensePct:   pct(weekExpense, prevWeekExpense),
        salesPct:     weekSalesRaw.length - prevWeekSalesRaw.length,
      }}
      monthly={{
        totalIncome:  monthIncome,
        totalExpense: monthExpense,
        totalProfit:  monthIncome - monthExpense,
        totalSales:   thisMonthSalesRaw.length,
        incomePct:    pct(monthIncome, lastIncome),
        expensePct:   pct(monthExpense, lastExpense),
        salesPct:     thisMonthSalesRaw.length - lastMonthSalesRaw.length,
      }}
    />
  );
}