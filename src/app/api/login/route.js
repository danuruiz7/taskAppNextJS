import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize as serializeCookie } from "cookie";

export async function POST(req) {
  try {
    // Parsea el JSON del cuerpo de la solicitud
    const data = await req.json();
    const { email, password } = data;
    console.log(email, password);
    // Validación básica
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "Email y password son requeridos" }),
        { status: 400 }
      );
    }

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      // Si no se encuentra el usuario, devuelve un error
      return new NextResponse(
        JSON.stringify({ message: "Email y Contraseñan incorrecta" }),
        {
          status: 404,
        }
      );
    }

    // Comparar la contraseña enviada con la contraseña hash almacenada
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      // Si la contraseña no coincide, devuelve un error
      return new NextResponse(
        JSON.stringify({ message: "Email y Contraseñan incorrecta" }),
        {
          status: 401,
        }
      );
    }

    // Datos para incluir en el token
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.TOKEN, {
      expiresIn: "1h",
    });

    // Crear la cookie
    const cookie = serializeCookie("token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // Solo se envía en HTTPS
      maxAge: 3600, // 1 hora de validez
    });

    const response = new NextResponse(
      JSON.stringify({ message: "Login successful" }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );

    return response;
  } catch (error) {
    // Captura cualquier otro error
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
