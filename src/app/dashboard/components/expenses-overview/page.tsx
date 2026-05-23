import { prisma } from "@/lib/prisma";
import { ExpensesChart } from "./ExpensesChart";

export default async function ExpensesOverview() {
  const now = new Date();

  // Rango mes actual
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Rango semana actual (lunes a domingo)
  const dayOfWeek  = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const weekStart  = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const [monthlyOutflows, weeklyOutflows] = await Promise.all([
    prisma.outflows.groupBy({
      by: ["outflow_type"],
      _sum: { amount: true },
      where: { date: { gte: monthStart, lte: monthEnd } },
      orderBy: { _sum: { amount: "desc" } },
    }),
    prisma.outflows.groupBy({
      by: ["outflow_type"],
      _sum: { amount: true },
      where: { date: { gte: weekStart, lte: weekEnd } },
      orderBy: { _sum: { amount: "desc" } },
    }),
  ]);

  const toData = (rows: typeof monthlyOutflows) =>
    rows.map(r => ({ category: r.outflow_type, amount: r._sum.amount ?? 0 }));

  return (
    <ExpensesChart
      monthlyData={toData(monthlyOutflows)}
      weeklyData={toData(weeklyOutflows)}
    />
  );
}