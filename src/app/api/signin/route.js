import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    // Parsea el JSON del cuerpo de la solicitud
    const data = await req.json();
    const { email, name, password } = data;
    console.log(email, name, password);
    // Validación básica (puedes extenderla según necesites)
    if (!email || !name || !password) {
      return new NextResponse("Campo vacio", { status: 400 });
    }

    // Hashear la contraseña antes de almacenarla en la base de datos
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Crear un nuevo usuario en la base de datos utilizando Prisma
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Usa la contraseña hasheada
      },
    });

    // Devuelve el usuario creado con un estado HTTP 201
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    // Captura cualquier error que ocurra durante el proceso de creación
    return NextResponse.json(error, { status: 500 });
  }
}
