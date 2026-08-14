import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { OfflineStatusBanner } from "@/components/OfflineStatusBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://tontine-bokun-universal.vercel.app"),
  title: "Tontine bɔkun — Tontine 2.0 Africa | Gestion 100% Hors-Ligne",
  description: "Plateforme intelligente de gestion des réunions, cotisations, cagnottes et réputation pour tontines en Afrique. 100% utilisable avec ou sans connexion internet.",
  manifest: "/manifest.json",
  keywords: ["tontine", "Afrique", "cotisation", "épargne", "Wave", "Mobile Money", "Abidjan", "Cotonou", "Lomé", "Dakar", "tontine en ligne"],
  authors: [{ name: "Tontine bɔkun" }],
  openGraph: {
    title: "Tontine bɔkun — Tontine 2.0 Africa",
    description: "Digitalisez et sécurisez vos tontines en toute confiance. Calcul automatique des cagnottes, rappels WhatsApp et transparence totale.",
    url: "https://tontine-bokun-universal.vercel.app",
    siteName: "Tontine bɔkun",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tontine bɔkun - Tontine 2.0 Africa",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tontine bɔkun — Tontine 2.0 Africa",
    description: "Digitalisez et sécurisez vos tontines en toute confiance. 100% Hors-ligne et Mobile Money.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon-192.png",
    shortcut: "/icon-192.png",
    apple: "/icon-192.png",
  },
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
