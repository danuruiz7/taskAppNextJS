import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      created_at: true,
      updated_at: true,
      role: true,
      // Especifica explícitamente que no quieres incluir la contraseña
      password: false,
    },
  });

  return NextResponse.json(users);
}
