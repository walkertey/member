import { Globe2 } from "lucide-react";
import { useLanguage, type Language } from "@/i18n/LanguageContext";

const options: { value: Language; label: string; ariaLabel: string }[] = [
  { value: "en", label: "EN", ariaLabel: "Switch to English" },
  { value: "zh", label: "中文", ariaLabel: "切换到中文" },
  { value: "ms", label: "BM", ariaLabel: "Tukar kepada Bahasa Melayu" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex h-11 shrink-0 items-center gap-0.5 rounded-full border border-[rgba(235,203,131,0.25)] bg-[rgba(35,61,86,0.72)] p-1">
      <Globe2 className="ml-1 mr-0.5 h-4 w-4 shrink-0 text-[#EBCB83]" aria-hidden="true" />

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.ariaLabel}
          aria-pressed={language === option.value}
          onClick={() => setLanguage(option.value)}
          className={`flex h-8 min-w-8 items-center justify-center rounded-full px-1.5 text-[11px] font-bold leading-none transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EBCB83] ${
            language === option.value
              ? "bg-[#EBCB83] text-[#001733]"
              : "text-[#A9B6CB] hover:text-[#F6F3EC]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
