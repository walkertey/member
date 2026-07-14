import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "zh" | "ms";

const STORAGE_KEY = "raymond-language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  cycleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "zh" || saved === "ms" || saved === "en"
      ? saved
      : "en";
  });

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const cycleLanguage = () => {
    const languages: Language[] = ["en", "zh", "ms"];
    const index = languages.indexOf(language);
    setLanguage(languages[(index + 1) % languages.length]);
  };

  useEffect(() => {
    document.documentElement.lang =
      language === "zh" ? "zh-CN" : language === "ms" ? "ms" : "en";
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, cycleLanguage }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
