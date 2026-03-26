"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Locale, Translations } from "./types";
import en from "./en";
import uk from "./uk";
import ru from "./ru";
import es from "./es";

const translations: Record<Locale, Translations> = { en, uk, ru, es };

const STORAGE_KEY = "anonboard-locale";
const DEFAULT_LOCALE: Locale = "en";

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && stored in translations) return stored as Locale;
  const browserLang = navigator.language.split("-")[0];
  if (browserLang in translations) return browserLang as Locale;
  return DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getInitialLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
    }
  }, [locale, mounted]);

  const value: I18nContextValue = {
    locale,
    t: translations[locale],
    setLocale,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslations(): Translations {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslations must be used within an I18nProvider");
  }
  return context.t;
}

export function useLocale(): { locale: Locale; setLocale: (locale: Locale) => void } {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useLocale must be used within an I18nProvider");
  }
  return { locale: context.locale, setLocale: context.setLocale };
}
