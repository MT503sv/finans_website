"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExpenses() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  return await prisma.outflows.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });
}

export async function addExpense(data: {
  category: string;
  amount: number;
  date: string;
  description?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.outflows.create({
    data: {
      outflow_type: data.category,
      amount: data.amount,
      date: new Date(data.date),
      description: data.description ?? "",
      user_id: userId,
    },
  });

  revalidatePath("/expenses");
}

export async function deleteExpense(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  // Verifica que el expense pertenece al usuario
  const expense = await prisma.outflows.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!expense || expense.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.outflows.delete({
    where: { id },
  });

  revalidatePath("/expenses");
}

export async function clearAllExpenses() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.outflows.deleteMany({
    where: { user_id: userId },
  });

  revalidatePath("/expenses");
}