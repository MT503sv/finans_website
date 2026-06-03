"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getIncomes() {
  return await prisma.incomes.findMany({
    orderBy: { date: "desc" },
  });
}

export async function addIncome(data: {
  income_type: string;
  amount: number;
  date: string;
  description?: string;
}) {
  await prisma.incomes.create({
    data: {
      income_type: data.income_type,
      amount: data.amount,
      date: new Date(data.date),
      description: data.description ?? "",
      user_id: 1,
    },
  });

  revalidatePath("/incomes");
}

export async function deleteIncome(id: number) {
  await prisma.incomes.delete({
    where: { id },
  });

  revalidatePath("/incomes");
}

export async function clearAllIncomes() {
  await prisma.incomes.deleteMany();
  revalidatePath("/incomes");
}