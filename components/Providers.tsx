"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/lib/LanguageContext";
import { UserRoleProvider } from "@/lib/UserRoleContext";
import { GroupProvider } from "@/lib/GroupContext";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.update();
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // Nouveau code PWA disponible, rafraîchissement automatique
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((err) => console.warn("Erreur PWA Service Worker :", err));
    }
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <LanguageProvider>
        <UserRoleProvider>
          <GroupProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </GroupProvider>
        </UserRoleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
