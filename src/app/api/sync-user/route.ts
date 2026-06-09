import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, email, name } = await req.json();
  const { userId: authUserId } = await auth();

  // Validación de seguridad
  if (authUserId !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: userId,
          email,
          name: name || "User",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}