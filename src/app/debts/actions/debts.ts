"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDebts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  return await prisma.debts.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });
}

export async function addDebt(data: {
  debt_bank: string;
  amount: number;
  due_date: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const [m, d, y] = data.due_date.split("/");
  const dueDateUTC = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0));

  await prisma.debts.create({
    data: {
      debt_name: data.debt_bank,  
      debt_bank: data.debt_bank,
      amount: data.amount,
      due_date: dueDateUTC,
      user_id: userId,
      is_paid: false,
      date: new Date(),
    },
  });

  revalidatePath("/debts");
}

export async function deleteDebt(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  // Verifica que la deuda pertenece al usuario
  const debt = await prisma.debts.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!debt || debt.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.debts.delete({
    where: { id },
  });

  revalidatePath("/debts");
}

export async function clearAllDebts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.debts.deleteMany({
    where: { user_id: userId },
  });

  revalidatePath("/debts");
}