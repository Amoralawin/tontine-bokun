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

  useEffect(() => {
    // Check saved preference
    const saved = localStorage.getItem("tb_lang") as LanguageCode;
    if (saved && TRANSLATIONS[saved]) {
      setLanguageState(saved);
    } else {
      setLanguageState("fr");
    }
  }, []);

  const setLanguage = (lang: LanguageCode | "auto") => {
    if (lang === "auto") {
      localStorage.removeItem("tb_lang");
      setLanguageState("fr");
      setIsAutoDetected(false);
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
