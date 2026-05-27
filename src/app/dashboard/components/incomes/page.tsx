import { prisma } from "@/lib/prisma";
import { IncomesChart } from "./IncomesChart";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default async function Incomes() {
  const year = new Date().getFullYear();
  const now = new Date();

  // Inicio de la semana actual (lunes)
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const [yearlyInflows, weeklyInflows] = await Promise.all([
    // Todos los inflows del año para monthly
    prisma.incomes.findMany({
      where: { date: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) } },
      select: { amount: true, date: true },
    }),
    // Inflows de la semana actual para weekly
    prisma.incomes.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      select: { amount: true, date: true },
    }),
  ]);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthlyData = MONTHS.map((month, i) => ({
    label: month,
    income: yearlyInflows
      .filter(r => new Date(r.date).getMonth() === i)
      .reduce((sum, r) => sum + (r.amount ?? 0), 0),
  }));

  const weeklyData = DAYS.map((day, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return {
      label: day,
      income: weeklyInflows
        .filter(r => new Date(r.date).toDateString() === date.toDateString())
        .reduce((sum, r) => sum + (r.amount ?? 0), 0),
    };
  });

  return <IncomesChart monthlyData={monthlyData} weeklyData={weeklyData} />;
}