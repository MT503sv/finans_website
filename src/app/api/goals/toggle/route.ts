import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const { id } = await req.json();

  const goal = await prisma.financial_goals.findUnique({ where: { id } });
  if (!goal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.financial_goals.update({
    where: { id },
    data: { is_completed: !goal.is_completed },
  });

  return NextResponse.json({ ok: true });
}