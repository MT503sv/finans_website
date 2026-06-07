"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSales() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  return await prisma.sales.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });
}

export async function addSale(data: {
  product: string;
  quantity: number;
  unitPrice: number;
  date: string;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.sales.create({
    data: {
      item_sold: data.product,
      quantity_of_sold_items: data.quantity,
      price_of_item: data.unitPrice,
      date: new Date(data.date),
      user_id: userId,
    },
  });

  revalidatePath("/sales");
}

export async function deleteSale(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  // Verifica que la venta pertenece al usuario
  const sale = await prisma.sales.findUnique({
    where: { id },
    select: { user_id: true },
  });

  if (!sale || sale.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.sales.delete({
    where: { id },
  });

  revalidatePath("/sales");
}

export async function clearAllSales() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await prisma.sales.deleteMany({
    where: { user_id: userId },
  });

  revalidatePath("/sales");
}