"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { LanguageCode, LANGUAGES, TRANSLATIONS } from "./i18n";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode | "auto") => void;
  t: (key: string) => string;
  detectedRegionName?: string;
  isAutoDetected: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: (key: string) => key,
  isAutoDetected: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>("fr");
  const [detectedRegionName, setDetectedRegionName] = useState<string>("");
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(false);

  const detectLanguage = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes("Abidjan") || tz.includes("Ivory") || tz.includes("Yamoussoukro")) {
        setLanguageState("bci"); // Baoulé (Côte d'Ivoire)
        setDetectedRegionName("Abidjan, Côte d'Ivoire (Baoulé)");
        setIsAutoDetected(true);
      } else if (tz.includes("Porto-Novo") || tz.includes("Cotonou") || tz.includes("Benin")) {
        setLanguageState("fon"); // Fon (Bénin)
        setDetectedRegionName("Cotonou / Bénin (Fon)");
        setIsAutoDetected(true);
      } else if (navigator.language.startsWith("en")) {
        setLanguageState("en");
        setIsAutoDetected(true);
        setDetectedRegionName("Région Anglophone");
      } else {
        setLanguageState("fr");
        setIsAutoDetected(true);
        setDetectedRegionName("Région Francophone");
      }
    } catch {
      setLanguageState("fr");
      setIsAutoDetected(false);
    }
  };

  useEffect(() => {
    // Check saved preference
    const saved = localStorage.getItem("tb_lang") as LanguageCode;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
      return;
    }

    // Auto-detect based on timezone or browser language
    detectLanguage();
  }, []);

  const setLanguage = (lang: LanguageCode | "auto") => {
    if (lang === "auto") {
      localStorage.removeItem("tb_lang");
      detectLanguage();
    } else {
      setLanguageState(lang);
      localStorage.setItem("tb_lang", lang);
      setIsAutoDetected(false);
    }
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.fr;
    return dict[key] || TRANSLATIONS.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, detectedRegionName, isAutoDetected }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
