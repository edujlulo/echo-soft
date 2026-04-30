import { Suspense } from "react";
import AcceptInviteClient from "./AcceptInviteClient";
import { useTranslations } from "next-intl";

function Spinner() {
  return (
    <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
  );
}

export default function AcceptInvitePage() {
  const t = useTranslations("AcceptInvitePage");

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center px-4">
          <div className="bg-blue-200 shadow-lg rounded-xl px-10 py-8 w-full max-w-md text-center">
            <div className="mb-5 flex justify-center">
              <Spinner />
            </div>

            <h1 className="text-3xl font-bold text-blue-900 mb-3">
              {t("loading")}
            </h1>

            <p className="text-blue-800">{t("pleaseWait")}</p>
          </div>
        </div>
      }
    >
      <AcceptInviteClient />
    </Suspense>
  );
}
