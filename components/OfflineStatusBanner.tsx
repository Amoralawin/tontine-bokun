"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export const OfflineStatusBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Initial check
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);

      // Register Service Worker for offline PWA caching
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("Service Worker enregistré pour le mode hors-ligne :", reg.scope))
          .catch((err) => console.warn("Erreur d'enregistrement du Service Worker :", err));
      }
    }

    const handleOffline = () => {
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowOnlineToast(true);
      setTimeout(() => setShowOnlineToast(false), 4000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-900 px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-fade-down z-50 sticky top-0">
          <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
          <span>
            ⚡ Mode Hors-Ligne Actif — Vos données sont 100% sauvegardées et disponibles localement sans connexion internet.
          </span>
        </div>
      )}

      {/* Online Restored Toast */}
      {showOnlineToast && !isOffline && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-up">
          <Wifi className="w-4 h-4 text-emerald-200" />
          <span>Connexion Internet rétablie ! Synchronisation active.</span>
        </div>
      )}
    </>
  );
};
