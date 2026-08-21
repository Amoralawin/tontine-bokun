"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Calculator, 
  WifiOff, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Users, 
  Crown, 
  UserCheck, 
  Sparkles, 
  Trophy, 
  Receipt, 
  Volume2, 
  Play, 
  HelpCircle,
  TrendingUp,
  HeartHandshake
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { LogoIcon } from "./LogoIcon";
import { CreateGroupModal } from "./CreateGroupModal";
import { JoinGroupModal } from "./JoinGroupModal";
import { TTSVoiceReader } from "./TTSVoiceReader";
import { useGroups } from "@/lib/GroupContext";
import { toast } from "sonner";

// Traductions complètes pour la page de Première Utilisation
const ONBOARDING_I18N: Record<string, Record<string, string>> = {
  fr: {
    heroTag: "🌟 NOUVEAU SUR TONTINE BƆKUN ?",
    heroTitle: "La Tontine Moderne, Sécurisée & 100% Transparente",
    heroSubtitle: "Digitalisez et simplifiez la gestion de vos réunions de cotisations, vos cagnottes et la réputation de vos membres, même sans connexion internet.",
    listenBtn: "Écouter les explications (Audio)",
    
    // À quoi sert l'application ?
    whatIsItTitle: "À quoi sert Tontine bɔkun ?",
    whatIsItSub: "Pourquoi remplacer les vieux cahiers de tontine par notre application ?",
    
    p1Title: "1. Zéro Litige & Transparence Totale",
    p1Desc: "Fini les cahiers tachés, égarés ou contestés. Chaque membre a son reçu visuel et voit exactement qui a payé et qui attend son tour.",
    
    p2Title: "2. Calcul Automatique des Cagnottes",
    p2Desc: "Plus d'erreurs de calcul ! L'application calcule les montants collectés, les retards et attribue le pot au bénéficiaire du jour avec son trophée.",
    
    p3Title: "3. 100% Fonctionnel Hors-Ligne",
    p3Desc: "Pas de connexion internet au marché ou au village ? L'application fonctionne parfaitement hors-ligne et synchronise tout dès que le réseau revient.",
    
    p4Title: "4. Compatible Mobile Money & WhatsApp",
    p4Desc: "Enregistrez facilement les paiements Wave, MTN, Orange, Moov et envoyez des reçus officiels et rappels directement sur WhatsApp.",
    
    // Comment l'utiliser ?
    howToTitle: "Comment utiliser l'application ?",
    howToSub: "Un fonctionnement simple en 3 étapes adaptées à votre profil",
    
    step1Tag: "Étape 1",
    step1Title: "Choisissez votre Rôle",
    step1AdminTitle: "👑 Vous êtes Responsable / Président(e) ?",
    step1AdminDesc: "Créez votre groupe en 30 secondes, fixez le montant (ex: 5 000 FCFA), la périodicité (hebdomadaire/mensuel) et enregistrez vos membres.",
    step1MemberTitle: "👥 Vous êtes Simple Membre ?",
    step1MemberDesc: "Rejoignez votre groupe pour suivre vos versements, consulter vos reçus et connaître la date exacte de votre tour de cagnotte.",
    
    step2Tag: "Étape 2",
    step2Title: "Pointez les Cotisations en Réunion",
    step2Desc: "Lors de chaque rencontre, cochez en un clic les membres présents qui ont versé leur cotisation. Ajoutez une photo du reçu ou du transfert Mobile Money.",
    
    step3Tag: "Étape 3",
    step3Title: "Célébrez la Remise de la Cagnotte",
    step3Desc: "L'application génère automatiquement le Trophée du Bénéficiaire avec le montant total collecté, prêt à être partagé avec fierté au groupe !",
    
    // Call to Action
    ctaTitle: "Prêt à démarrer l'aventure ?",
    ctaSub: "Choisissez votre point de départ en un clic :",
    btnCreate: "Créer mon premier groupe (Je suis Responsable)",
    btnJoin: "Rejoindre un groupe existant (Je suis Membre)",
    btnDemo: "🎯 Découvrir avec un exemple de démonstration",
    
    offlineNotice: "💡 Fonctionne partout en Afrique : Côte d'Ivoire, Bénin, Togo, Sénégal, Cameroun, Mali, Burkina Faso..."
  },
  en: {
    heroTag: "🌟 NEW TO TONTINE BƆKUN?",
    heroTitle: "Modern, Secure & 100% Transparent Tontine",
    heroSubtitle: "Digitize and simplify your savings group meetings, pots and member reputation, even without internet access.",
    listenBtn: "Listen to explanation (Audio)",
    
    whatIsItTitle: "What is Tontine bɔkun for?",
    whatIsItSub: "Why replace traditional paper notebooks with our app?",
    
    p1Title: "1. Zero Disputes & Full Transparency",
    p1Desc: "No more lost, torn or disputed notebooks. Every member gets a clear receipt and sees exactly who paid and who gets the pot.",
    
    p2Title: "2. Automatic Pot Calculation",
    p2Desc: "No math mistakes! The app calculates collected amounts, dues, and awards the pot to the scheduled beneficiary with a trophy.",
    
    p3Title: "3. 100% Offline Functional",
    p3Desc: "No internet at the market or village? The app runs smoothly offline and syncs automatically when network returns.",
    
    p4Title: "4. Mobile Money & WhatsApp Ready",
    p4Desc: "Easily track Wave, MTN, Orange, Moov payments and send official receipts & reminders straight to WhatsApp.",
    
    howToTitle: "How to use the application?",
    howToSub: "A simple 3-step guide tailored to your profile",
    
    step1Tag: "Step 1",
    step1Title: "Choose your Role",
    step1AdminTitle: "👑 Are you Manager / President?",
    step1AdminDesc: "Create your group in 30 seconds, set the amount (e.g. 5,000 FCFA), frequency (weekly/monthly) and add members.",
    step1MemberTitle: "👥 Are you a Member?",
    step1MemberDesc: "Join your group to track contributions, view receipts, and know your exact pot payout date.",
    
    step2Tag: "Step 2",
    step2Title: "Record Contributions at Meetings",
    step2Desc: "At each meeting, check off present members who contributed with 1 click. Add a photo proof or Mobile Money screenshot.",
    
    step3Tag: "Step 3",
    step3Title: "Celebrate the Pot Payout",
    step3Desc: "The app instantly generates the Beneficiary Trophy with the total collected pot, ready to share with pride to your group!",
    
    ctaTitle: "Ready to get started?",
    ctaSub: "Choose your starting point in 1 click:",
    btnCreate: "Create my first group (I am Manager)",
    btnJoin: "Join an existing group (I am Member)",
    btnDemo: "🎯 Explore with a demo example",
    
    offlineNotice: "💡 Works everywhere in Africa: Côte d'Ivoire, Benin, Togo, Senegal, Cameroon, Mali, Burkina Faso..."
  },
  bci: {
    heroTag: "🌟 MO WUO BA TONTINE BƆKUN NUN ?",
    heroTitle: "Sika Akpasua Kpa, 100% Nuanwlɛ nun",
    heroSubtitle: "Fa sika akpasua siesie kpa su telefon nun, sran kwlaa nian nuanwlɛ nun, ngbanyi su.",
    listenBtn: "Tie ndɛ mun (Audio)",
    
    whatIsItTitle: "Ngue ti yɛ be fa Tontine bɔkun yo azɔ ?",
    whatIsItSub: "Ngue ti yɛ e kaci wema buki kpa sika app liɛ nun ?",
    
    p1Title: "1. Sika Fuan Nun Nuanwlɛ",
    p1Desc: "Wema bo o mlin nun nyo le fiɛ. Sran kwlaa nian sika foto kpa su.",
    
    p2Title: "2. Sika Kplikpli Di Kpa",
    p2Desc: "App kpa di sika kplikpli nun kpa man sran bo o ko fa sika kpli lɔ.",
    
    p3Title: "3. Ngbanyi nun Awlosu",
    p3Desc: "Internet man lɔ ? App yo azɔ kpa awlosu nun nian.",
    
    p4Title: "4. Wave / MoMo kodo WhatsApp",
    p4Desc: "Fa Wave kodo MoMo sika to nun, o ko man WhatsApp wema ndɛ.",
    
    howToTitle: "Wafa bo be fa yo azɔ ?",
    howToSub: "Kwan nsan bo o ti felefle kpa :",
    
    step1Tag: "Kwan 1",
    step1Title: "Fa sran wun kpa",
    step1AdminTitle: "👑 A ti Admin / Sran kpli ?",
    step1AdminDesc: "Yi akpasua mɔyo fuan, fa sika bue (ex: 5 000 FCFA) kodo sran mun to nun.",
    step1MemberTitle: "👥 A ti Akpasua Membre ?",
    step1MemberDesc: "Wlu nun akpasua nun o ko nian sika nuanwlɛ kodo cɛn bo a ko fa sika.",
    
    step2Tag: "Kwan 2",
    step2Title: "Kplé cɛn sika siesie",
    step2Desc: "Kplé cɛn nun, to nian sran bo be man sika mun.",
    
    step3Tag: "Kwan 3",
    step3Title: "Sika Kpli Trophy Fite",
    step3Desc: "App fa Trophy kpa man sran bo o nyan sika kpli cɛn lɔ.",
    
    ctaTitle: "A siesie wun kpa ?",
    ctaSub: "Fa kwan kun di azɔ :",
    btnCreate: "Yi akpasua mɔyo (Admin)",
    btnJoin: "Wlu nun akpasua nun (Membre)",
    btnDemo: "🎯 Nian Demo kpa",
    
    offlineNotice: "💡 Di azɔ Afrika kwlaa : Côte d'Ivoire, Bénin, Togo, Sénégal..."
  },
  fon: {
    heroTag: "🌟 A BYƆ TONTINE BƆKUN MƐ YƆYƆ́ A ?",
    heroTitle: "Tontine ɖagbe, Akwɛ kplé kpo nǔgbo kpo",
    heroSubtitle: "Sɔ́ akwɛ kplé towe lɛ bi do alokan mɛ, kpo gbɛtɔ́ lɛ bi tɔn nǔgbo kpo, fǐ e internet ma ɖee lɔ.",
    listenBtn: "Se xó lɛ (Audio)",
    
    whatIsItTitle: "Etɛ́ azɔ̌ Tontine bɔkun nɔ wà ?",
    whatIsItSub: "Etɛ́wutu wɛ e na ɖyɔ wema xóxó lɛ kpo azɔ̌wema yɔyɔ́ é lɔ kpo ?",
    
    p1Title: "1. Hwɛ ɖě mǎ ɖee & Nǔgbo bi",
    p1Desc: "Wema bu e nɔ gblé é vɔ. Mɛ ɖókpó ɖókpó nɔ mɔ akwɛ yiyi wema tɔn ganji.",
    
    p2Title: "2. Akwɛ kplékplé jije tɔn",
    p2Desc: "Mɛɖé sɔ nɔ bló nùwanyido lǎ ! Azɔ̌wema nɔ lɛ́n akwɛ bi kpo nǔgbo kpo.",
    
    p3Title: "3. Internet ma ɖee lɔ é nɔ w'azɔ̌",
    p3Desc: "A ɖo axi mɛ alǒ gletoxo mɛ internet ma ɖee a ? É nɔ w'azɔ̌ bɔ nǔ bi nɔ sɔgbe.",
    
    p4Title: "4. Wave / MoMo kpo WhatsApp kpo",
    p4Desc: "Bɔwú nú akwɛ sɔ́ d'emɛ kpo Wave kpo MTN kpo, bo nɔ sɛ́ wema do WhatsApp mɛ.",
    
    howToTitle: "Nɛ̌ wɛ e nɔ zán gbɔ ?",
    howToSub: "Afɔɖiɖe 3 bɔwú nú mɛ bi :",
    
    step1Tag: "Afɔ 1",
    step1Title: "Sɔ́ tɛn towe",
    step1AdminTitle: "👑 A nyí Gán tɔn wɛ a ?",
    step1AdminDesc: "Blo gbɛ́tán towe mɛ azɔ̌n ɖókpó, sɔ́ akwɛ (ex: 5 000 FCFA) bo ylɔ́ gbɛtɔ́ lɛ.",
    step1MemberTitle: "👥 A nyí Gbɛtɔ́ kpaà wɛ a ?",
    step1MemberDesc: "Byɔ gbɛ́tán towe mɛ bo nɔ kpɔ́n hwenu e a na yí akwɛ towe é.",
    
    step2Tag: "Afɔ 2",
    step2Title: "Akwɛ kplékplé hwenu",
    step2Desc: "Hwenu e mi kplé é, tɛ́ mɛ e su akwɛ lɛ bi tɔn.",
    
    step3Tag: "Afɔ 3",
    step3Title: "Akwɛ yíyí Trophée",
    step3Desc: "Azɔ̌wema nɔ na Trophée ɖagbe nú mɛ e yí akwɛ bi é.",
    
    ctaTitle: "A sɔgbe na bɛ́ azɔ̌ a ?",
    ctaSub: "Sɔ́ afɔɖiɖe towe :",
    btnCreate: "Blo gbɛ́tán yɔyɔ́ (Gán)",
    btnJoin: "Byɔ gbɛ́tán ɖe mɛ (Gbɛtɔ́)",
    btnDemo: "🎯 Kpɔ́n Demo",
    
    offlineNotice: "💡 É nɔ w'azɔ̌ ɖo Afrika bi : Bénin, Côte d'Ivoire, Togo, Sénégal..."
  },
  gux: {
    heroTag: "🌟 A BYƆ TONTINE BƆKUN MƐ YƆYƆ́ A ?",
    heroTitle: "Tontine ɖagbe, Akwɛ kplé kpo nǔgbo kpo",
    heroSubtitle: "Sɔ́ akwɛ kplé towe lɛ bi do alokan mɛ, kpo gbɛtɔ́ lɛ bi tɔn nǔgbo kpo, fǐ e internet ma ɖee lɔ.",
    listenBtn: "Se xó lɛ (Audio)",
    whatIsItTitle: "Etɛ́ azɔ̌ Tontine bɔkun nɔ wà ?",
    whatIsItSub: "Etɛ́wutu wɛ e na ɖyɔ wema xóxó lɛ kpo azɔ̌wema yɔyɔ́ é lɔ kpo ?",
    p1Title: "1. Hwɛ ɖě mǎ ɖee & Nǔgbo bi",
    p1Desc: "Wema bu e nɔ gblé é vɔ. Mɛ ɖókpó ɖókpó nɔ mɔ akwɛ yiyi wema tɔn ganji.",
    p2Title: "2. Akwɛ kplékplé jije tɔn",
    p2Desc: "Mɛɖé sɔ nɔ bló nùwanyido lǎ ! Azɔ̌wema nɔ lɛ́n akwɛ bi kpo nǔgbo kpo.",
    p3Title: "3. Internet ma ɖee lɔ é nɔ w'azɔ̌",
    p3Desc: "A ɖo axi mɛ alǒ gletoxo mɛ internet ma ɖee a ? É nɔ w'azɔ̌ bɔ nǔ bi nɔ sɔgbe.",
    p4Title: "4. Wave / MoMo kpo WhatsApp kpo",
    p4Desc: "Bɔwú nú akwɛ sɔ́ d'emɛ kpo Wave kpo MTN kpo, bo nɔ sɛ́ wema do WhatsApp mɛ.",
    howToTitle: "Nɛ̌ wɛ e nɔ zán gbɔ ?",
    howToSub: "Afɔɖiɖe 3 bɔwú nú mɛ bi :",
    step1Tag: "Afɔ 1",
    step1Title: "Sɔ́ tɛn towe",
    step1AdminTitle: "👑 A nyí Gán tɔn wɛ a ?",
    step1AdminDesc: "Blo gbɛ́tán towe mɛ azɔ̌n ɖókpó, sɔ́ akwɛ (ex: 5 000 FCFA) bo ylɔ́ gbɛtɔ́ lɛ.",
    step1MemberTitle: "👥 A nyí Gbɛtɔ́ kpaà wɛ a ?",
    step1MemberDesc: "Byɔ gbɛ́tán towe mɛ bo nɔ kpɔ́n hwenu e a na yí akwɛ towe é.",
    step2Tag: "Afɔ 2",
    step2Title: "Akwɛ kplékplé hwenu",
    step2Desc: "Hwenu e mi kplé é, tɛ́ mɛ e su akwɛ lɛ bi tɔn.",
    step3Tag: "Afɔ 3",
    step3Title: "Akwɛ yíyí Trophée",
    step3Desc: "Azɔ̌wema nɔ na Trophée ɖagbe nú mɛ e yí akwɛ bi é.",
    ctaTitle: "A sɔgbe na bɛ́ azɔ̌ a ?",
    ctaSub: "Sɔ́ afɔɖiɖe towe :",
    btnCreate: "Blo gbɛ́tán yɔyɔ́ (Gán)",
    btnJoin: "Byɔ gbɛ́tán ɖe mɛ (Gbɛtɔ́)",
    btnDemo: "🎯 Kpɔ́n Demo",
    offlineNotice: "💡 É nɔ w'azɔ̌ ɖo Afrika bi : Bénin, Côte d'Ivoire, Togo, Sénégal..."
  },
  ajg: {
    heroTag: "🌟 A BYƆ TONTINE BƆKUN MƐ YƆYƆ́ A ?",
    heroTitle: "Tontine nywi, Eho kplékplé kodo gbesisɔ kpo",
    heroSubtitle: "Sɔ́ eho kplékplé towe lɛ bi do alokan mɛ, kpo gbɛtɔ́ lɛ bi tɔn nywi kpo, fin e internet ma ɖee lɔ.",
    listenBtn: "Se enu lɛ (Audio)",
    whatIsItTitle: "Nyi azɔ̌ Tontine bɔkun nɔ wà ?",
    whatIsItSub: "Nyiŋuti wɛ e na ɖyɔ wema xóxó lɛ kpo azɔ̌wema yɔyɔ́ é lɔ kpo ?",
    p1Title: "1. Hwɛ ɖě mǎ ɖee & Gbesisɔ bi",
    p1Desc: "Wema bu e nɔ gblé é vɔ. Mɛ ɖókpó ɖókpó nɔ mɔ eho yiyi wema tɔn nywi.",
    p2Title: "2. Eho kplékplé jije tɔn",
    p2Desc: "Mɛɖé sɔ nɔ bló nùwanyido lǎ ! Azɔ̌wema nɔ lɛ́n eho bi kpo gbesisɔ kpo.",
    p3Title: "3. Internet ma ɖee lɔ é nɔ w'azɔ̌",
    p3Desc: "A ɖo axi mɛ alǒ gletoxo mɛ internet ma ɖee a ? É nɔ w'azɔ̌ bɔ nǔ bi nɔ sɔgbe.",
    p4Title: "4. Wave / MoMo kpo WhatsApp kpo",
    p4Desc: "Bɔwú nú eho sɔ́ d'emɛ kpo Wave kpo MTN kpo, bo nɔ sɛ́ wema do WhatsApp mɛ.",
    howToTitle: "Leké wɛ e nɔ zán gbɔ ?",
    howToSub: "Afɔɖiɖe 3 bɔwú nú mɛ bi :",
    step1Tag: "Afɔ 1",
    step1Title: "Sɔ́ tɛn towe",
    step1AdminTitle: "👑 A nyí Gán tɔn wɛ a ?",
    step1AdminDesc: "Blo gbɛ́tán towe mɛ azɔ̌n ɖókpó, sɔ́ eho (ex: 5 000 FCFA) bo ylɔ́ gbɛtɔ́ lɛ.",
    step1MemberTitle: "👥 A nyí Gbɛtɔ́ kpaà wɛ a ?",
    step1MemberDesc: "Byɔ gbɛ́tán towe mɛ bo nɔ kpɔ́n hwenu e a na yí eho towe é.",
    step2Tag: "Afɔ 2",
    step2Title: "Eho kplékplé hwenu",
    step2Desc: "Hwenu e mi kplé é, tɛ́ mɛ e su eho lɛ bi tɔn.",
    step3Tag: "Afɔ 3",
    step3Title: "Eho yíyí Trophée",
    step3Desc: "Azɔ̌wema nɔ na Trophée nywi nú mɛ e yí eho bi é.",
    ctaTitle: "A sɔgbe na bɛ́ azɔ̌ a ?",
    ctaSub: "Sɔ́ afɔɖiɖe towe :",
    btnCreate: "Blo gbɛ́tán yɔyɔ́ (Gán)",
    btnJoin: "Byɔ gbɛ́tán ɖe mɛ (Gbɛtɔ́)",
    btnDemo: "🎯 Kpɔ́n Demo",
    offlineNotice: "💡 É nɔ w'azɔ̌ ɖo Afrika bi : Bénin, Côte d'Ivoire, Togo, Sénégal..."
  }
};

export const FirstTimeOnboardingView: React.FC = () => {
  const { language } = useLanguage();
  const { groups, setActiveGroupId } = useGroups();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState<"admin" | "member">("admin");

  const ot = (key: string): string => {
    const dict = ONBOARDING_I18N[language] || ONBOARDING_I18N.fr;
    return dict[key] || ONBOARDING_I18N.fr[key] || key;
  };

  const fullAudioDescription = `${ot("heroTitle")}. ${ot("heroSubtitle")}. ${ot("whatIsItTitle")}. ${ot("p1Title")}: ${ot("p1Desc")}. ${ot("p2Title")}: ${ot("p2Desc")}. ${ot("p3Title")}: ${ot("p3Desc")}. ${ot("p4Title")}: ${ot("p4Desc")}. ${ot("howToTitle")}. ${ot("step1Title")}. ${ot("step2Title")}. ${ot("step3Title")}.`;

  const handleLoadDemo = () => {
    toast.success("Mode Découverte activé ! Création d'un groupe d'exemple.");
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-10 pb-16 font-sans animate-fade-up">
      
      {/* 1. HERO BANNER CHALEUREUX AVEC LOGO ET BOUTON AUDIO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b132b] to-slate-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl text-white">
        {/* Cercles décoratifs d'arrière-plan */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{ot("heroTag")}</span>
          </div>

          <div className="flex justify-center">
            <div className="p-3 bg-slate-950/80 rounded-3xl border border-amber-500/30 shadow-2xl inline-flex items-center gap-3">
              <LogoIcon size={48} />
              <div className="text-left">
                <span className="text-2xl font-black tracking-tight text-white block">
                  Tontine <span className="text-amber-500">bɔkun</span>
                </span>
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-widest block">
                  Tontine 2.0 Africa
                </span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {ot("heroTitle")}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            {ot("heroSubtitle")}
          </p>

          {/* Bouton de Lecture Audio Vocale Directe */}
          <div className="pt-2 flex justify-center">
            <TTSVoiceReader 
              textToRead={fullAudioDescription}
              label={ot("listenBtn")}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-2xl shadow-xl shadow-amber-500/20 text-xs transition-all hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 2. SECTION 1 : À QUOI SERT L'APPLICATION ? (4 PILIERS) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <span>{ot("whatIsItTitle")}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {ot("whatIsItSub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Pilier 1 : Zéro Litige */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 group hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {ot("p1Title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {ot("p1Desc")}
            </p>
          </div>

          {/* Pilier 2 : Calcul Automatique */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 group hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {ot("p2Title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {ot("p2Desc")}
            </p>
          </div>

          {/* Pilier 3 : 100% Hors-Ligne */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 group hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📡
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {ot("p3Title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {ot("p3Desc")}
            </p>
          </div>

          {/* Pilier 4 : Mobile Money & WhatsApp */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 group hover:border-amber-500/40">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📲
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {ot("p4Title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {ot("p4Desc")}
            </p>
          </div>

        </div>
      </section>

      {/* 3. SECTION 2 : COMMENT UTILISER L'APPLICATION ? (GUIDE ÉTAPE PAR ÉTAPE) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase">
            Guide pas-à-pas
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {ot("howToTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {ot("howToSub")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Étape 1 : Choisir son Rôle */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-sm">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {ot("step1Title")}
            </h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 font-semibold text-amber-800 dark:text-amber-300">
                {ot("step1AdminTitle")}
                <p className="font-normal text-[11px] mt-1 text-slate-600 dark:text-slate-300">{ot("step1AdminDesc")}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 font-semibold text-blue-800 dark:text-blue-300">
                {ot("step1MemberTitle")}
                <p className="font-normal text-[11px] mt-1 text-slate-600 dark:text-slate-300">{ot("step1MemberDesc")}</p>
              </div>
            </div>
          </div>

          {/* Étape 2 : Enregistrer les Cotisations */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-sm">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {ot("step2Title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {ot("step2Desc")}
            </p>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Reçu visuel généré automatiquement !</span>
            </div>
          </div>

          {/* Étape 3 : Célébrer la Cagnotte */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 relative shadow-sm">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {ot("step3Title")}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {ot("step3Desc")}
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Trophée WhatsApp du bénéficiaire !</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ACTIONS DIRECTES DE DÉMARRAGE (CTA) */}
      <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/30 text-center space-y-6 shadow-xl">
        
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {ot("ctaTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            {ot("ctaSub")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          
          {/* Bouton 1 : Créer un groupe (Responsable) */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl btn-mango-gold text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
          >
            <Crown className="w-5 h-5 text-slate-950" />
            <span>{ot("btnCreate")}</span>
          </button>

          {/* Bouton 2 : Rejoindre un groupe (Membre) */}
          <button
            onClick={() => setIsJoinOpen(true)}
            className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-500 text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-md transition-all hover:scale-105"
          >
            <Users className="w-5 h-5 text-amber-500" />
            <span>{ot("btnJoin")}</span>
          </button>

        </div>

        <div className="pt-2">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            {ot("offlineNotice")}
          </p>
        </div>
      </section>

      {/* Modals de Démarrage */}
      <CreateGroupModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <JoinGroupModal group={null} isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />

    </div>
  );
};
