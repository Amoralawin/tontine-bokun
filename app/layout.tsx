import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { OfflineStatusBanner } from "@/components/OfflineStatusBanner";

export const metadata: Metadata = {
  title: "Tontine bɔkun — Gestion de tontines 100% Hors-Ligne",
  description: "Plateforme intelligente de gestion des réunions, cotisations, livraisons et restitution des dûs pour tontines en Afrique. 100% utilisable sans internet.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#f59e0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
              });
              if (typeof window !== 'undefined') {
                if ('serviceWorker' in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function(regs) {
                    for (let r of regs) {
                      r.unregister();
                    }
                  });
                }
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    for (let k of keys) {
                      caches.delete(k);
                    }
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen" style={{ backgroundColor: 'var(--page-bg)', color: 'var(--foreground)' }}>
        <Providers>
          <OfflineStatusBanner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
