"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDebts() {
  return await prisma.debts.findMany({
    orderBy: { date: "desc" },
  });
}

export async function addDebt(data: {
  debt_bank: string;
  amount: number;
  due_date: string;
}) {
  await prisma.debts.create({
    data: {
      debt_name: data.debt_bank,
      debt_bank: data.debt_bank,
      amount: data.amount,
      due_date: new Date(data.due_date),
      user_id: 1, // igual que goals, por ahora fijo
      is_paid: false,
      date: new Date(),
    },
  });

  revalidatePath("/debts");
}

export async function deleteDebt(id: number) {
  await prisma.debts.delete({
    where: { id },
  });

  revalidatePath("/debts");
}

export async function clearAllDebts() {
  await prisma.debts.deleteMany();
  revalidatePath("/debts");
}