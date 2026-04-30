"use client";

import Button from "@/components/Button";
import LabeledInput from "@/components/LabeledInput";
import { supabase } from "@/lib/supabase/client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function AcceptInviteClient() {
  const t = useTranslations("AcceptInvitePage");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useParams();
  const locale = params.locale as string;

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isCheckingInvite, setIsCheckingInvite] = useState(true);
  const [isValidInvite, setIsValidInvite] = useState(false);

  const Spinner = ({ className = "" }: { className?: string }) => (
    <span
      className={`inline-block animate-spin rounded-full border-4 border-current border-t-transparent ${className}`}
    />
  );

  useEffect(() => {
    const prepareAuthSession = async () => {
      setIsCheckingInvite(true);

      const code = searchParams.get("code");

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        setEmail(user.email);
        setIsValidInvite(true);
      } else {
        setIsValidInvite(false);
      }

      setIsCheckingInvite(false);
    };

    prepareAuthSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const cleanPassword = password.trim();
    const cleanConfirmPassword = confirmPassword.trim();

    if (!cleanPassword || !cleanConfirmPassword) {
      setErrorMessage(t("passwordRequired"));
      return;
    }

    if (cleanPassword.length < 4) {
      setErrorMessage(t("passwordMinLengthError"));
      return;
    }

    if (cleanPassword !== cleanConfirmPassword) {
      setErrorMessage(t("passwordMismatch"));
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        throw new Error(t("inviteValidationError"));
      }

      const { error: passwordError } = await supabase.auth.updateUser({
        password: cleanPassword,
      });

      if (passwordError) {
        throw new Error(t("passwordSaveError"));
      }

      const { error: vetError } = await supabase
        .from("veterinarians")
        .update({
          user_id: user.id,
        })
        .eq("email", user.email);

      if (vetError) {
        throw new Error(t("vetConnectionError"));
      }

      setSuccessMessage(
        t("accountActivated")
      );

      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace(`/${locale}`);
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : t("genericActivationError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingInvite) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="bg-blue-200 shadow-lg rounded-xl px-10 py-8 w-full max-w-md text-center">
          <div className="mb-5 flex justify-center">
            <Spinner className="h-12 w-12 text-blue-700" />
          </div>

          <h1 className="text-3xl font-bold text-blue-900 mb-3">
            {t("validatingAccess")}
          </h1>

          <p className="text-blue-800">{t("pleaseWait")}</p>
        </div>
      </div>
    );
  }

  if (!isValidInvite) {
    return (
      <div className="flex h-full w-full items-center justify-center px-4">
        <div className="bg-blue-200 shadow-lg rounded-xl px-10 py-8 w-full max-w-md text-center">
          <p className="font-semibold text-blue-700 uppercase tracking-wide mb-2">
            {t("accessUnavailable")}
          </p>

          <h1 className="text-3xl font-bold text-blue-900 mb-4">
            {t("invalidOrExpiredLink")}
          </h1>

          <p className="text-blue-950 mb-4">
            {t("invalidInviteDescription")}
          </p>

          <p className="text-sm text-blue-900 mb-6">
            {t("expiredInviteInstruction")}
          </p>

          <Button
            type="button"
            onClick={() => router.push(`/${locale}`)}
            className="bg-blue-600 text-blue-50 border !border-blue-900 rounded-lg shadow-md px-6 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 ease-in-out"
          >
            {t("backToLogin")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center px-4">
      <div className="bg-blue-200 shadow-lg rounded-xl px-10 py-8 w-full max-w-md">
        <div className="text-center mb-6">
          <p className=" font-semibold text-blue-700 uppercase tracking-wide mb-2">
            {t("accessInvitation")}
          </p>

          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {t("welcome")}
          </h1>

          <p className=" text-blue-800">
            {t("almostReady")}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3 mb-6">
          <p className="text-sm text-blue-950 text-center">
            {t("createPasswordInstruction")}
          </p>
        </div>

        {email && (
          <p className="mb-4 text-center text-sm text-blue-900">
            {t("invitedAccount")} <span className="font-semibold">{email}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <LabeledInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            labelClassName="w-32"
            inputClassName="w-full"
            placeholder={t("passwordPlaceholder")}
          >
            {t("password")}
          </LabeledInput>

          <LabeledInput
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            labelClassName="w-32"
            inputClassName="w-full"
            placeholder={t("confirmPasswordPlaceholder")}
          >
            {t("confirmPassword")}
          </LabeledInput>

          {errorMessage && (
            <p className="text-sm text-red-700 text-center">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="text-sm text-green-700 text-center">
              {successMessage}
            </p>
          )}

          <p className="text-sm text-gray-600 mt-4 text-center">
            {t("passwordRequirement")}
          </p>

          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-blue-50 border !border-blue-900 rounded-lg shadow-md px-6 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 ease-in-out"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading && <Spinner className="h-4 w-4 border-2" />}
                {isLoading ? t("activating") : t("activateAccount")}
              </span>
            </Button>
          </div>
        </form>

        <p className="text-sm text-blue-900 mt-6 text-center">
          {t("invitedUsersOnly")}
        </p>
      </div>
    </div>
  );
}
