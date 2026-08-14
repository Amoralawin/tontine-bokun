"use client";

import React from "react";
import { Globe, Shield, Sparkles, TrendingUp } from "lucide-react";
import { LogoIcon } from "./LogoIcon";
import { useLanguage } from "@/lib/LanguageContext";

const FOOTER_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    desc: "La plateforme intelligente qui digitalise, sécurise et simplifie la gestion des tontines en Afrique.",
    secured: "Sécurisé",
    voice: "IA Vocale",
    languages: "6 langues",
    regions: "Langues & Régions",
    features: "Fonctionnalités Clés",
    featureVoice: "Lecture Vocale (Français / Anglais)",
    featureRep: "Réputation inter-groupes",
    featurePenalty: "Pénalités automatiques",
    featureTranslation: "Traduction automatique",
    rights: "Tous droits réservés.",
    tagline: "La tontine, réinventée pour l'Afrique de demain."
  },
  en: {
    desc: "The intelligent platform that digitizes, secures and simplifies the management of tontines in Africa.",
    secured: "Secured",
    voice: "Voice AI",
    languages: "6 languages",
    regions: "Languages & Regions",
    features: "Key Features",
    featureVoice: "Voice Reading (French / English)",
    featureRep: "Inter-group reputation",
    featurePenalty: "Automatic penalties",
    featureTranslation: "Automatic translation",
    rights: "All rights reserved.",
    tagline: "Tontine, reinvented for tomorrow's Africa."
  },
  bci: {
    desc: "Nyan miɛn tontine sika siesie kpa koto wun, sran kun nian be sika fatɔ.",
    secured: "Sika asiese",
    voice: "IA Ndɛ kan",
    languages: "Anian 6",
    regions: "Ndɛ & Awiɛ",
    features: "Mɔyo mun kpa",
    featureVoice: "Ndɛ kan (Français / English)",
    featureRep: "Sran nian nian",
    featurePenalty: "Ho mɔyo mun",
    featureTranslation: "Ndɛ kpɛlɛ mɔyo",
    rights: "Sran fiɛ kpli kwan.",
    tagline: "Tontine, awiɛ kpa man Africa klɔ."
  },
  fon: {
    desc: "Gbɛtɔ́ nǔ gbe ee kpɔn hwangbɛ tontine towe ganji mɛ.",
    secured: "Akwɛ jije",
    voice: "IA voice gbe",
    languages: "Gbe 6",
    regions: "Gbe lɛ & Gbɛ",
    features: "Nǔ ɖagbe e blo lɛ",
    featureVoice: "Gbe yiyi (Français / English)",
    featureRep: "Gbɛtɔ́ sɔgbe towe",
    featurePenalty: "Ho nǔ gbe",
    featureTranslation: "Gbe lɛ lilɛ",
    rights: "Nǔ bi ganji mɛ.",
    tagline: "Tontine, azɔ̌ yɔyɔ́ nú Africa sɔgbe."
  },
  gux: {
    desc: "Gbɛtɔ́ nǔ gbe ee kpɔn hwangbɛ tontine towe ganji mɛ.",
    secured: "Akwɛ jije",
    voice: "IA voice gbe",
    languages: "Gbe 6",
    regions: "Gbe lɛ & Gbɛ",
    features: "Nǔ ɖagbe e blo lɛ",
    featureVoice: "Gbe yiyi (Français / English)",
    featureRep: "Gbɛtɔ́ sɔgbe towe",
    featurePenalty: "Ho nǔ gbe",
    featureTranslation: "Gbe lɛ lilɛ",
    rights: "Nǔ bi ganji mɛ.",
    tagline: "Tontine, azɔ̌ yɔyɔ́ nú Africa sɔgbe."
  },
  ajg: {
    desc: "Gbɛ́ tontine ciwo gbeɖewhe sɔgbɛ bi.",
    secured: "Ho asiese",
    voice: "IA Voice",
    languages: "Gbɛ́ 6",
    regions: "Gbɛ́ & Gbɛtɔ",
    features: "Enu kpa lɛ",
    featureVoice: "Voix (Français / English)",
    featureRep: "Agbetan nɔnɔmɛ",
    featurePenalty: "Ho lɔ bi",
    featureTranslation: "Gbɛ́ lilɛ",
    rights: "Enu bi te.",
    tagline: "Tontine, ho yɔyɔ́ do Africa."
  }
};

export const Footer: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => {
    const dict = FOOTER_TRANSLATIONS[language] || FOOTER_TRANSLATIONS.fr;
    return dict[key] || FOOTER_TRANSLATIONS.fr[key];
  };

  return (
    <footer className="border-t border-amber-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={36} />
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Tontine <span className="text-amber-500">bɔkun</span>
                </span>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Tontine 2.0 Africa
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              {t("desc")}
            </p>
            {/* Trust badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                <Shield className="w-3 h-3" /> {t("secured")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold border border-amber-500/20">
                <Sparkles className="w-3 h-3" /> {t("voice")}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold border border-blue-500/20">
                <Globe className="w-3 h-3" /> {t("languages")}
              </span>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t("regions")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <li>🇨🇮 Baoulé (Abidjan, Côte d&apos;Ivoire)</li>
              <li>🇧🇯 Fon (Cotonou, Abomey, Bénin)</li>
              <li>🇧🇯 Goun (Porto-Novo, Bénin)</li>
              <li>🇧🇯 Adja (Couffo, Bénin)</li>
              <li>🇫🇷 Français (Afrique Francophone)</li>
              <li>🇬🇧 English (Global)</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t("features")}
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{t("featureVoice")}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t("featureRep")}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{t("featurePenalty")}</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>{t("featureTranslation")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>© {new Date().getFullYear()} Tontine bɔkun. {t("rights")}</div>
          <div className="flex items-center gap-2">
            <span className="text-amber-500">✦</span>
            <span className="font-semibold text-slate-500 dark:text-slate-400 italic">
              {t("tagline")}
            </span>
            <span className="text-emerald-500">✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
