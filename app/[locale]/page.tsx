"use client";

import Button from "@/components/Button";
import LabeledInput from "@/components/LabeledInput";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const t = useTranslations("LoginPage");
  const { login } = useAuth();

  const [email, setEmail] = useState("correo@correo.com");
  const [password, setPassword] = useState("Ecosoft123.");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      setErrorMessage(t("invalidCredentials"));
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleLogin();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [email, password, isLoading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Language buttons top-right */}
      <LanguageSwitcher />

      <div className="bg-blue-200 shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">
          {t("title")}
        </h1>

        <p className="text-sm text-blue-800 mb-6 text-center">
          {t("subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            inputClassName="w-60"
            placeholder={t("emailPlaceholder")}
          >
            {t("emailLabel")}
          </LabeledInput>

          <LabeledInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputClassName="w-60"
            placeholder={t("passwordPlaceholder")}
          >
            {t("passwordLabel")}
          </LabeledInput>

          {errorMessage && (
            <p className="text-sm text-red-700 text-center">{errorMessage}</p>
          )}

          <p className="text-xs text-gray-600 mt-4 text-center">
            {t("unauthorizedMessage")}
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-600 text-blue-50 border !border-blue-900 rounded-lg shadow-md px-6 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 ease-in-out flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>

                  {t("loadingButton")}
                </>
              ) : (
                t("loginButton")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
