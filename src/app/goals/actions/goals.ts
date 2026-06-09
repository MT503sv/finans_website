"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGoals() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  return await prisma.financial_goals.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });
}

export async function addGoal(data: {
  goal_name: string;
  due_date: string;
  target_amount: number;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  // ✅ Retornamos el goal creado para obtener el ID real de la DB
  const goal = await prisma.financial_goals.create({
    data: {
      goal_name: data.goal_name,
      goal_type: "personal",
      due_date: new Date(data.due_date),
      target_amount: data.target_amount,
      is_completed: false,
      user_id: userId,
      date: new Date(),
    },
  });

  revalidatePath("/goals");
  return goal;
}

export async function updateGoal(
  id: number,
  data: { goal_name: string; due_date: string; target_amount: number }
) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const goal = await prisma.financial_goals.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!goal || goal.user_id !== userId) throw new Error("Unauthorized");

  await prisma.financial_goals.update({
    where: { id },
    data: {
      goal_name: data.goal_name,
      due_date: new Date(data.due_date),
      target_amount: data.target_amount,
    },
  });

  revalidatePath("/goals");
}

export async function toggleGoal(id: number, is_completed: boolean) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const goal = await prisma.financial_goals.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!goal || goal.user_id !== userId) throw new Error("Unauthorized");

  await prisma.financial_goals.update({
    where: { id },
    data: { is_completed },
  });

  revalidatePath("/goals");
}

export async function deleteGoal(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const goal = await prisma.financial_goals.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!goal || goal.user_id !== userId) throw new Error("Unauthorized");

  await prisma.financial_goals.delete({ where: { id } });

  revalidatePath("/goals");
}