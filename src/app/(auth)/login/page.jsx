"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Lock, Mail } from "@/icons/Icons";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [serverError, setServerError] = useState("");
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  // console.log(errors);
  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/login",
        data
      );
      console.log(response.data);
      setServerError("");
      clearTimeout(timer); // Limpia el timer si el login es exitoso o se intenta de nuevo
    } catch (error) {
      setServerError(
        error.response.data.message || "Un error ocurrió durante el login"
      );
      if (timer) clearTimeout(timer); // Limpia cualquier timer existente antes de establecer uno nuevo
      setTimer(
        setTimeout(() => {
          setServerError("");
        }, 5000)
      ); // Establece que el mensaje de error se limpie después de 5 segundos
    } finally {
      setLoading(false); // Desactivar el loader independientemente del resultado
    }
  });

  return (
    <div className="max-w-[85%] mx-auto bg-gray-500 mt-10 p-4 rounded-3xl shadow-inner shadow-gray-300">
      <h1 className="text-4xl mb-4 font-bold text-white text-center">Login</h1>

      <form onSubmit={onSubmit} className="" method="POST">
        <div className="flex flex-col gap-2 text-center justify-center mb-2 ">
          <label
            htmlFor="email"
            className="text-start px-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            <span className="flex items-center gap-1">
              <Mail /> Correo Electronico:
            </span>
          </label>
          <input
            type="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Escriba su correo electronico"
            {...register("email", {
              required: {
                value: true,
                message: "El correo es requerido",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Correo no válido",
              },
            })}
          />
          {errors.email && (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
              {errors.email.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 text-center justify-center mb-2 ">
          <label
            htmlFor="password"
            className="text-start px-1 text-sm font-medium text-gray-900 dark:text-white"
          >
            <span className="flex items-center gap-1">
              <Lock /> Contraseña:
            </span>
          </label>
          <input
            type="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Contraseña"
            {...register("password", {
              required: {
                value: true,
                message: "Contraseña es requerida",
              },
            })}
          />
          {errors.password && (
            <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
              {errors.password.message}
            </span>
          )}
        </div>

        {serverError && (
          <div className="bg-red-100 text-red-800 text-center text-xs font-medium px-4 py-2 rounded dark:bg-red-900 dark:text-red-300">
            {serverError}
          </div>
        )}

        <p class="text-gray-100 dark:text-gray-100 mt-4 mb-2 text-sm">
          No tienes cuentas?{" "}
          <Link
            href="signin"
            class="inline-flex items-center font-bold text-blue-300 hover:underline"
          >
            Registrate
            <svg
              class="w-4 h-4 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
        </p>

        {loading ? (
          <button
            disabled
            type="button"
            className="mt-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full"
          >
            <svg
              aria-hidden="true"
              role="status"
              className="inline w-4 h-4 me-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            className="mt-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-full "
          >
            Login
          </button>
        )}
      </form>
    </div>
  );
}
