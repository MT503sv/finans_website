"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getIncomes() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  return await prisma.incomes.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });
}

export async function addIncome(data: {
  income_type: string;
  amount: number;
  date: string;
  description?: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.incomes.create({
    data: {
      income_type: data.income_type,
      amount: data.amount,
      date: new Date(data.date),
      description: data.description ?? "",
      user_id: userId,
    },
  });

  revalidatePath("/incomes");
  revalidatePath("/dashboard"); // ✅ actualiza el dashboard
}

export async function deleteIncome(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const income = await prisma.incomes.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!income || income.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.incomes.delete({
    where: { id },
  });

  revalidatePath("/incomes");
  revalidatePath("/dashboard"); // ✅ actualiza el dashboard
}

export async function clearAllIncomes() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.incomes.deleteMany({
    where: { user_id: userId },
  });

  revalidatePath("/incomes");
  revalidatePath("/dashboard"); // ✅ actualiza el dashboard
}