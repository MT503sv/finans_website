import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DashboardCards } from "./DashboardCards";

export default async function Data() {
  const { userId } = await auth();
  
  if (!userId) return <div>Not authenticated</div>;

  // ── Fecha actual en El Salvador (UTC-6) ───────────────────────
  // El servidor Next.js corre en UTC. Si son las 18:00 SV, el servidor
  // ya marcará el día siguiente. Ajustamos manualmente a UTC-6.
  const nowUTC = new Date();
  const nowSV  = new Date(nowUTC.getTime() - 6 * 60 * 60 * 1000);

  const svY = nowSV.getUTCFullYear();
  const svM = nowSV.getUTCMonth();
  const svD = nowSV.getUTCDate();

  // Rangos en UTC puro (medianoche a medianoche UTC) usando la fecha SV.
  // Las ventas se guardan a 00:00 UTC (antiguas) o 12:00 UTC (nuevas) —
  // ambas caen dentro del mismo día UTC, así que este rango las captura.
  const todayStart = new Date(Date.UTC(svY, svM, svD,  0,  0,  0,   0));
  const todayEnd   = new Date(Date.UTC(svY, svM, svD, 23, 59, 59, 999));

  // Semana: domingo→sábado usando la fecha SV
  const weekDay       = nowSV.getUTCDay();
  const weekStart     = new Date(Date.UTC(svY, svM, svD - weekDay,      0,  0,  0,   0));
  const weekEnd       = new Date(Date.UTC(svY, svM, svD - weekDay + 6, 23, 59, 59, 999));
  const prevWeekStart = new Date(Date.UTC(svY, svM, svD - weekDay - 7,      0,  0,  0,   0));
  const prevWeekEnd   = new Date(Date.UTC(svY, svM, svD - weekDay - 1,     23, 59, 59, 999));

  // Mes usando la fecha SV
  const thisMonthStart = new Date(Date.UTC(svY, svM,     1,  0,  0,  0,   0));
  const thisMonthEnd   = new Date(Date.UTC(svY, svM + 1, 0, 23, 59, 59, 999));
  const lastMonthStart = new Date(Date.UTC(svY, svM - 1, 1,  0,  0,  0,   0));
  const lastMonthEnd   = new Date(Date.UTC(svY, svM,     0, 23, 59, 59, 999));

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

  const sumUnits = (s: { quantity_of_sold_items: number | null }[]) =>
    s.reduce((acc, x) => acc + (x.quantity_of_sold_items ?? 0), 0);

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
        totalSales:   sumUnits(todaySalesRaw),
        incomePct:    null,
        expensePct:   null,
        salesPct:     null,
      }}
      weekly={{
        totalIncome:  weekIncome,
        totalExpense: weekExpense,
        totalProfit:  weekIncome - weekExpense,
        totalSales:   sumUnits(weekSalesRaw),
        incomePct:    pct(weekIncome, prevWeekIncome),
        expensePct:   pct(weekExpense, prevWeekExpense),
        salesPct:     sumUnits(weekSalesRaw) - sumUnits(prevWeekSalesRaw),
      }}
      monthly={{
        totalIncome:  monthIncome,
        totalExpense: monthExpense,
        totalProfit:  monthIncome - monthExpense,
        totalSales:   sumUnits(thisMonthSalesRaw),
        incomePct:    pct(monthIncome, lastIncome),
        expensePct:   pct(monthExpense, lastExpense),
        salesPct:     sumUnits(thisMonthSalesRaw) - sumUnits(lastMonthSalesRaw),
      }}
    />
  );
}