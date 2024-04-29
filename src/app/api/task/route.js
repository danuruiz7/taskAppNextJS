import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const dataToken = await req.headers.get("Authorization");
    const token = dataToken.split(" ")[1]; // Extraer el token de la cabecera Authorization
    console.log(token);
    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "No token provided" }),
        { status: 401 }
      );
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.TOKEN);
    if (!decoded) {
      return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
      });
    }
    const dataTask = await req.json();
    let { name, description, assignedTo } = dataTask;
    if (!name || !description) {
      return new NextResponse(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    if (!assignedTo || assignedTo === null) {
      assignedTo = decoded.id;
    }

    // Crear la tarea en la base de datos con el userId obtenido del token
    const task = await prisma.task.create({
      data: {
        name,
        description,
        createdBy: {
          connect: { id: decoded.id }, // Conectar con el creador a través del ID decodificado
        },
        assignedTo: {
          connect: { id: assignedTo }, // Conectar con el asignado, asegúrate de que assignedTo sea válido
        },
      },
    });

    return new NextResponse(JSON.stringify(task), { status: 201 });
  } catch (error) {
    console.error(error);
    // Captura errores específicos de JWT
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or expired token" }),
        { status: 403 }
      );
    }
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
