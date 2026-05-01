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

  const DEMO_EMAIL = "email@email.com";
  const DEMO_PASSWORD = "Ecosoft123.";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleDemoLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      await login(DEMO_EMAIL, DEMO_PASSWORD);
    } catch (error) {
      setErrorMessage(t("invalidCredentials"));
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
        <h1 className="text-3xl font-bold text-blue-950 text-center">
          {t("productName")}
        </h1>

        <p className="text-sm text-blue-700 text-center mt-1 mb-8 max-w-xs mx-auto leading-relaxed">
          {t("productDescription")}
        </p>

        <h2 className="text-2xl font-semibold text-blue-900 mb-2 text-center">
          {t("title")}
        </h2>

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
              className={`bg-blue-100 text-blue-900 border border-blue-300 rounded-lg shadow-sm px-6 py-2 font-semibold hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out flex items-center justify-center ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-blue-900"
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

          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-blue-300" />
            <span className="text-xs text-blue-700">{t("or")}</span>
            <div className="flex-1 h-px bg-blue-300" />
          </div>

          <div className="text-center">
            <p className="mb-3 text-sm text-blue-900">{t("demoText")}</p>

            <Button
              type="button"
              disabled={isLoading}
              onClick={handleDemoLogin}
              className={`bg-blue-950 text-white border border-blue-950 rounded-lg shadow-lg px-6 py-2.5 font-semibold hover:bg-blue-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 ease-in-out ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {t("demoButton")}
            </Button>

            <p className="text-xs text-blue-600 mt-2 tracking-wide">
              {t("noSignupRequired")}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
