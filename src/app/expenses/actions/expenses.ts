"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
  return await prisma.outflows.findMany({
    orderBy: { date: "desc" },
  });
}

export async function addExpense(data: {
  category: string;
  amount: number;
  date: string;
  description?: string;
}) {
  await prisma.outflows.create({
    data: {
      outflow_type: data.category,
      amount: data.amount,
      date: new Date(data.date),
      description: data.description ?? "",
      user_id: 1,
    },
  });

  revalidatePath("/expenses");
}

export async function deleteExpense(id: number) {
  await prisma.outflows.delete({
    where: { id },
  });

  revalidatePath("/expenses");
}

export async function clearAllExpenses() {
  await prisma.outflows.deleteMany();
  revalidatePath("/expenses");
}