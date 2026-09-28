import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { translations } from "@/i18n/translations";

const LANG_KEY = "agrolink_lang";
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === "en" || stored === "pt" ? stored : "pt";
  });

  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === "pt" ? "pt" : "en";
  }, [lang]);

  const t = useCallback(
    (key) => {
      const parts = key.split(".");
      let node = translations[lang];
      for (const p of parts) {
        if (node == null) break;
        node = node[p];
      }
      if (node == null) {
        let fallback = translations.en;
        for (const p of parts) {
          if (fallback == null) break;
          fallback = fallback[p];
        }
        return fallback ?? key;
      }
      return node;
    },
    [lang]
  );

  // localized field helper for DB-driven bilingual content: lf(product, 'name') -> name_pt / name_en
  const lf = useCallback(
    (obj, field) => {
      if (!obj) return "";
      return obj[`${field}_${lang}`] || obj[`${field}_en`] || obj[`${field}_pt`] || "";
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, lf }), [lang, t, lf]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
