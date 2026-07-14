import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { translations } from "@/i18n/translations";
import { AlertCircle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const { language } = useLanguage();
  const t = translations[language];
  const [, setLocation] = useLocation();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#00162E] via-[#032344] to-[#00172F] px-4 py-8 text-[#F6F3EC]">
      <section className="w-full max-w-md rounded-3xl border border-[rgba(235,203,131,0.24)] bg-[rgba(24,54,82,0.82)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mb-8 flex justify-end">
          <LanguageSwitcher />
        </div>

        <div className="text-center">
          <div className="mb-5 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(235,203,131,0.35)] bg-[rgba(235,203,131,0.12)]">
              <AlertCircle className="h-12 w-12 text-[#F2D188]" />
            </div>
          </div>

          <p className="font-serif text-6xl font-bold text-[#F2D188]">404</p>
          <h1 className="mt-4 font-serif text-2xl font-semibold">
            {t.pageNotFound}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#A9B6CB]">
            {t.notFoundMessage}
          </p>

          <button
            type="button"
            onClick={() => setLocation("/")}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C89448] to-[#F2D188] px-5 py-3 font-bold text-[#001733] shadow-lg transition active:scale-[0.98]"
          >
            <Home className="h-5 w-5" />
            {t.goHome}
          </button>
        </div>
      </section>
    </main>
  );
}
