"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSales() {
  return await prisma.sales.findMany({
    orderBy: { date: "desc" },
  });
}

export async function addSale(data: {
  product: string;
  quantity: number;
  unitPrice: number;
  date: string;
}) {
  await prisma.sales.create({
    data: {
      item_sold: data.product,
      quantity_of_sold_items: data.quantity,
      price_of_item: data.unitPrice,
      date: new Date(data.date),
      user_id: 1,
    },
  });

  revalidatePath("/sales");
}

export async function deleteSale(id: number) {
  await prisma.sales.delete({
    where: { id },
  });

  revalidatePath("/sales");
}

export async function clearAllSales() {
  await prisma.sales.deleteMany();
  revalidatePath("/sales");
}