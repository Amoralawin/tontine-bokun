import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { OfflineStatusBanner } from "@/components/OfflineStatusBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        {/* OpenGraph / Facebook / Instagram / WhatsApp / Telegram */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tontine bɔkun" />
        <meta property="og:title" content="Tontine bɔkun — Tontine 2.0 Africa" />
        <meta property="og:description" content="Digitalisez et sécurisez vos tontines en toute confiance. 100% Hors-ligne et Mobile Money." />
        <meta property="og:image" content="https://tontine-bokun-universal.vercel.app/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://tontine-bokun-universal.vercel.app/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Tontine bɔkun Logo et Plateforme" />
        <meta property="og:url" content="https://tontine-bokun-universal.vercel.app" />

        {/* Twitter / X Large Summary Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tontine bɔkun — Tontine 2.0 Africa" />
        <meta name="twitter:description" content="Digitalisez et sécurisez vos tontines en toute confiance. 100% Hors-ligne et Mobile Money." />
        <meta name="twitter:image" content="https://tontine-bokun-universal.vercel.app/og-image.jpg" />
        <meta name="twitter:image:alt" content="Tontine bɔkun" />

        {/* Snapchat / SMS iMessage / Apple Rich Link Previews */}
        <link rel="image_src" href="https://tontine-bokun-universal.vercel.app/og-image.jpg" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-title" content="Tontine bɔkun" />
        <meta name="application-name" content="Tontine bɔkun" />
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
