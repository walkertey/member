import LanguageSwitcher from "@/components/LanguageSwitcher";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { ReactNode } from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#00162E] via-[#032344] to-[#00172F] px-4 py-6 text-[#F6F3EC]">
      <div className="mx-auto max-w-md">
        <header className="mb-6">
          <div className="mb-5 flex items-center justify-between">
            <Link
              href="/"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(235,203,131,0.25)] bg-[rgba(35,61,86,0.65)]"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <LanguageSwitcher />
          </div>

          <div>
            <h1 className="font-serif text-3xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-[#A9B6CB]">{subtitle}</p>
          </div>
        </header>

        {children}
      </div>
    </main>
  );
}

export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[rgba(235,203,131,0.22)] bg-[rgba(24,54,82,0.78)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] ${className}`}
    >
      {children}
    </section>
  );
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[rgba(235,203,131,0.3)] bg-[rgba(235,203,131,0.12)] px-3 py-1 text-xs font-semibold text-[#F2D188]">
      {children}
    </span>
  );
}
