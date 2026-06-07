import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { IncomesChart } from "./IncomesChart";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default async function Incomes() {
  const { userId } = await auth();
  
  if (!userId) return <div>Not authenticated</div>;

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

  const [yearlyInflows, weeklyInflows, yearlySales, weeklySales] = await Promise.all([
    // Todos los inflows del año para monthly
    prisma.incomes.findMany({
      where: { user_id: userId, date: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) } },
      select: { amount: true, date: true },
    }),
    // Inflows de la semana actual para weekly
    prisma.incomes.findMany({
      where: { user_id: userId, date: { gte: weekStart, lte: weekEnd } },
      select: { amount: true, date: true },
    }),
    // Todas las sales del año para monthly
    prisma.sales.findMany({
      where: { user_id: userId, date: { gte: new Date(`${year}-01-01`), lte: new Date(`${year}-12-31`) } },
      select: { quantity_of_sold_items: true, price_of_item: true, date: true },
    }),
    // Sales de la semana actual para weekly
    prisma.sales.findMany({
      where: { user_id: userId, date: { gte: weekStart, lte: weekEnd } },
      select: { quantity_of_sold_items: true, price_of_item: true, date: true },
    }),
  ]);

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Helper para calcular total de sales
  const calculateSalesTotal = (
    salesData: { quantity_of_sold_items: number | null; price_of_item: number | null; date: Date }[],
    dateFilter: (date: Date) => boolean
  ) => {
    return salesData
      .filter(s => dateFilter(new Date(s.date)))
      .reduce((sum, s) => sum + (s.quantity_of_sold_items ?? 0) * (s.price_of_item ?? 0), 0);
  };

  const monthlyData = MONTHS.map((month, i) => ({
    label: month,
    income: yearlyInflows
      .filter(r => new Date(r.date).getMonth() === i)
      .reduce((sum, r) => sum + (r.amount ?? 0), 0),
    sales: calculateSalesTotal(yearlySales, (date) => date.getMonth() === i),
  }));

  const weeklyData = DAYS.map((day, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return {
      label: day,
      income: weeklyInflows
        .filter(r => new Date(r.date).toDateString() === date.toDateString())
        .reduce((sum, r) => sum + (r.amount ?? 0), 0),
      sales: calculateSalesTotal(weeklySales, (d) => d.toDateString() === date.toDateString()),
    };
  });

  return <IncomesChart monthlyData={monthlyData} weeklyData={weeklyData} />;
}