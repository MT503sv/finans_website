import { auth } from "@clerk/nextjs/server";
import { getDebts } from "./actions/debts";
import Debts from "./component/debts";
import { DebtsCards } from "./component/DebtsCards";
import { prisma } from "@/lib/prisma";

export default async function DebtsPage() {
  const { userId } = await auth();
  
  if (!userId) return <div>Not authenticated</div>;

  const initialDebts = await getDebts();
  
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [nextDebtData, monthDebtsData] = await Promise.all([
    // Próxima deuda no pagada CON DUE_DATE EN EL FUTURO
    prisma.debts.findFirst({
      where: {
        user_id: userId,
        is_paid: false,
        due_date: { gte: todayStart },
      },
      select: { debt_bank: true, amount: true, due_date: true },
      orderBy: { due_date: "asc" },
    }),
    // Deudas del mes actual
    prisma.debts.findMany({
      where: {
        user_id: userId,
        date: { gte: thisMonthStart, lte: thisMonthEnd },
      },
      select: { amount: true },
    }),
  ]);

  const monthDebtsCount = monthDebtsData.length;
  const monthDebtsTotal = monthDebtsData.reduce((sum, d) => sum + (d.amount ?? 0), 0);

  return (
    <>
      <DebtsCards
        nextDebt={nextDebtData}
        monthDebtsCount={monthDebtsCount}
        monthDebtsTotal={monthDebtsTotal}
      />
      <Debts initialDebts={initialDebts} />
    </>
  );
}