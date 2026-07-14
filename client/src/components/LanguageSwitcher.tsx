import { Globe2 } from "lucide-react";
import { useLanguage, type Language } from "@/i18n/LanguageContext";

const options: { value: Language; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "zh", label: "中文" },
  { value: "ms", label: "BM" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-[rgba(235,203,131,0.25)] bg-[rgba(35,61,86,0.72)] p-1">
      <Globe2 className="ml-1 h-4 w-4 text-[#EBCB83]" />

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setLanguage(option.value)}
          className={`rounded-full px-2 py-1 text-[11px] font-bold transition ${
            language === option.value
              ? "bg-[#EBCB83] text-[#001733]"
              : "text-[#A9B6CB]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
