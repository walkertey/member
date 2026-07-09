'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SupportedLang } from './raymondTranslations';
import { STORAGE_KEY } from './raymondTranslations';

interface I18nContextValue {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  toggleLang: () => void;
}

const LANG_ORDER: SupportedLang[] = ['en', 'zh', 'ms'];

function getInitialLang(): SupportedLang {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'zh' || stored === 'ms') return stored;
  } catch {
    // localStorage unavailable
  }
  return 'en';
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within <RaymondI18nProvider>');
  }
  return ctx;
}

export default function RaymondI18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>(() => getInitialLang());

  const setLang = useCallback((newLang: SupportedLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const idx = LANG_ORDER.indexOf(prev);
      const next = LANG_ORDER[(idx + 1) % LANG_ORDER.length];
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const value: I18nContextValue = { lang, setLang, toggleLang };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
