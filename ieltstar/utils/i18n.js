import { createContext, useContext, useState, useEffect, useCallback } from "react";
import zh from "../locales/zh";
import en from "../locales/en";

const dictionaries = { zh, en };
const I18nContext = createContext();

// Detect browser language, prefer stored preference
function detectLanguage() {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("ieltstar_lang");
  if (stored && dictionaries[stored]) return stored;
  const navLang = navigator.language?.slice(0, 2);
  return navLang === "zh" ? "zh" : "en";
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    setLangState(detectLanguage());
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem("ieltstar_lang", l);
  }, []);

  const t = useCallback((key, fallback) => {
    return dictionaries[lang]?.[key] || dictionaries.en?.[key] || fallback || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export default useI18n;
