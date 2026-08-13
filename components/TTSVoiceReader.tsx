"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface TTSVoiceReaderProps {
  textToRead: string;
  /** Texte français de secours */
  frenchText?: string;
  label?: string;
  variant?: "button" | "card" | "mini";
  className?: string;
}

/** Sélectionne la meilleure voix disponible pour la langue donnée */
function getBestVoice(lang: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  // Priorité : voix en ligne (Online / Natural)
  const preferred = voices.filter(
    (v) => v.lang.startsWith(lang) && v.name.toLowerCase().includes("natural")
  );
  if (preferred.length) return preferred[0];

  // Voix Microsoft haute qualité (Windows)
  const microsoft = voices.filter(
    (v) => v.lang.startsWith(lang) && v.name.toLowerCase().includes("microsoft")
  );
  if (microsoft.length) {
    const neural = microsoft.find(
      (v) =>
        v.name.toLowerCase().includes("neural") ||
        v.name.toLowerCase().includes("online")
    );
    return neural || microsoft[0];
  }

  // Voix Google
  const google = voices.filter(
    (v) => v.lang.startsWith(lang) && v.name.toLowerCase().includes("google")
  );
  if (google.length) return google[0];

  // N'importe quelle voix correspondant à la langue
  const anyMatch = voices.find((v) => v.lang.startsWith(lang));
  return anyMatch || null;
}

export const TTSVoiceReader: React.FC<TTSVoiceReaderProps> = ({
  textToRead,
  frenchText,
  label,
  variant = "button",
  className = "",
}) => {
  const { language, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Attendre que les voix soient chargées
  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      synth.getVoices();
    };
    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // La lecture à voix haute est STRICTEMENT réservée au Français et à l'Anglais.
  // Pour le Fon, le Baoulé, le Goun et l'Adja : le bouton de lecture vocale est retiré.
  if (language !== "fr" && language !== "en") {
    return null;
  }

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    synth.cancel();

    // Langue et texte exacts
    const ttsLang = language === "en" ? "en-US" : "fr-FR";
    const readText = language === "en" ? textToRead : (frenchText || textToRead);

    const utterance = new SpeechSynthesisUtterance(readText);
    utterance.lang = ttsLang;

    // Paramètres pour une voix naturelle et claire
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Sélectionner la meilleure voix disponible
    const bestVoice = getBestVoice(ttsLang.substring(0, 2));
    if (bestVoice) utterance.voice = bestVoice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = (e) => {
      console.error("TTS error:", e);
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  if (variant === "mini") {
    return (
      <button
        onClick={handleSpeak}
        title={isPlaying ? t("stopVoice") : t("listenVoice")}
        className={`inline-flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
          isPlaying
            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/40"
            : "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white dark:bg-amber-400/20 dark:text-amber-300"
        } ${className}`}
      >
        {isPlaying ? (
          <span className="flex gap-0.5 items-end h-4">
            <span className="w-1 bg-current rounded-full animate-[soundbar_0.8s_ease-in-out_infinite]" style={{height:'60%'}} />
            <span className="w-1 bg-current rounded-full animate-[soundbar_0.8s_ease-in-out_0.2s_infinite]" style={{height:'100%'}} />
            <span className="w-1 bg-current rounded-full animate-[soundbar_0.8s_ease-in-out_0.4s_infinite]" style={{height:'40%'}} />
          </span>
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500 text-white shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
              {t("voiceAccessibilityTitle")}
              <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                FR / EN
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              🔊 Lecture vocale haute qualité en Français et en Anglais.
            </p>
          </div>
        </div>

        <button
          onClick={handleSpeak}
          className={`px-4 py-2.5 rounded-lg font-medium text-xs flex items-center gap-2 transition-all duration-300 shadow-md shrink-0 ${
            isPlaying
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
          }`}
        >
          {isPlaying ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>{t("stopVoice")}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>{label || t("listenVoice")}</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Variant "button" (défaut)
  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border shadow-sm ${
        isPlaying
          ? "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
          : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-white hover:border-amber-500"
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span>{t("stopVoice")}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>{label || t("listenVoice")}</span>
        </>
      )}
    </button>
  );
};
