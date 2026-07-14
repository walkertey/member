'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { SupportedLang } from './raymondTranslations';
import { STORAGE_KEY } from './raymondTranslations';

interface I18nContextValue { lang: SupportedLang; setLang: (lang: SupportedLang) => void; toggleLang: () => void; }
const LANG_ORDER: SupportedLang[] = ['en', 'zh', 'ms'];
const I18nContext = createContext<I18nContextValue | null>(null);
const isSupportedLang = (value: string | null): value is SupportedLang => value === 'en' || value === 'zh' || value === 'ms';

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within <RaymondI18nProvider>');
  return ctx;
}

export default function RaymondI18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isSupportedLang(stored)) queueMicrotask(() => setLangState(stored));
    } catch {}
  }, []);

  useEffect(() => { document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang; }, [lang]);

  const setLang = useCallback((next: SupportedLang) => {
    setLangState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((previous) => {
      const next = LANG_ORDER[(LANG_ORDER.indexOf(previous) + 1) % LANG_ORDER.length];
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const value = useMemo(() => ({ lang, setLang, toggleLang }), [lang, setLang, toggleLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
