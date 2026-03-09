"use client";

import Button from "@/components/Button";
import LabeledInput from "@/components/LabeledInput";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // estado de carga

  const handleLogin = async () => {
    setIsLoading(true); // inicio de carga
    try {
      await login(email, password);
      // Aquí podrías redirigir a la home si es exitoso
    } catch (error) {
      // alert("Invalid credentials");
      alert("Correo o contraseña incorrectos");
    } finally {
      setIsLoading(false); // fin de carga
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-blue-200 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">
          Bienvenido a EcoSoft
        </h1>
        <p className="text-sm text-blue-800 mb-6 text-center">
          Ingrese su correo y contraseña para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          >
            Correo
          </LabeledInput>
          <LabeledInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            Contraseña
          </LabeledInput>

          <p className="text-xs text-gray-600 mt-4 text-center">
            Solo personal autorizado de la clínica puede iniciar sesión
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading} // desactiva mientras carga
              className={`
                bg-blue-600
                text-blue-50
                border !border-blue-900
                rounded-lg
                shadow-md
                px-6 py-2
                font-semibold
                hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-400
                transition-colors duration-200 ease-in-out
                flex items-center justify-center
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Cargando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
