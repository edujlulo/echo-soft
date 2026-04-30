"use client";

import { usePathname, useRouter } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  function changeLanguage(locale: "es" | "en") {
    router.replace(pathname, { locale });
  }

  return (
    <div>
      <div className="fixed top-4 right-4 flex gap-2 text-sm">
        <button
          onClick={() => changeLanguage("es")}
          className="bg-blue-300 cursor-pointer flex items-center gap-1 px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-400 transition"
        >
          <span role="img" aria-label="Spain Flag">
            <img
              src="https://flagcdn.com/es.svg"
              alt="United Kingdom"
              width={30}
              height={18}
            />
          </span>
          Español
        </button>
        <button
          onClick={() => changeLanguage("en")}
          className="bg-blue-300 cursor-pointer flex items-center gap-1 px-3 py-1 rounded-md border border-blue-600 hover:bg-blue-400 transition"
        >
          <span role="img" aria-label="UK Flag">
            <img
              src="https://flagcdn.com/gb.svg"
              alt="United Kingdom"
              width={30}
              height={18}
            />
          </span>
          English
        </button>
      </div>
    </div>
  );
}
