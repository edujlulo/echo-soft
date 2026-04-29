import { Suspense } from "react";
import AcceptInviteClient from "./AcceptInviteClient";

function Spinner() {
  return (
    <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-700 border-t-transparent" />
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-center justify-center px-4">
          <div className="bg-blue-200 shadow-lg rounded-xl px-10 py-8 w-full max-w-md text-center">
            <div className="mb-5 flex justify-center">
              <Spinner />
            </div>

            <h1 className="text-3xl font-bold text-blue-900 mb-3">Cargando</h1>

            <p className="text-blue-800">Por favor, espere un momento.</p>
          </div>
        </div>
      }
    >
      <AcceptInviteClient />
    </Suspense>
  );
}
