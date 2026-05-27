import { prisma } from "@/lib/prisma";
import { GoalsChecklist } from "./GoalsCheckList";

export default async function GoalsWidget() {
  const goals = await prisma.financial_goals.findMany({
    orderBy: { due_date: "asc" },
    take: 5,
    select: {
      id: true,
      goal_name: true,
      due_date: true,
      is_completed: true,
    },
  });

  const serialized = goals.map(g => ({
    ...g,
    due_date: g.due_date ? g.due_date.toISOString() : null,
  }));

  return <GoalsChecklist goals={serialized} />;
}