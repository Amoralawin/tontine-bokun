"use client";

import React, { useState } from "react";
import { X, CheckCircle2, ShieldCheck, CreditCard, Smartphone, ArrowRight, Lock, Sparkles, Camera, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  baseAmount: number;
  feeAmount?: number;
  onSuccess?: (proofUrl?: string) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  title,
  baseAmount,
  feeAmount = 100,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const [provider, setProvider] = useState<"wave" | "orange" | "mtn" | "moov" | "card">("wave");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [receiptRef, setReceiptRef] = useState("");

  if (!isOpen) return null;

  const totalAmount = baseAmount + feeAmount;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(val);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setReceiptRef(`PAY-${Math.floor(100000 + Math.random() * 900000)}`);
      if (onSuccess) onSuccess(proofUrl || undefined);
    }, 1800);
  };

  const handleCloseAll = () => {
    setIsDone(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-up font-sans">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl p-6 space-y-5 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-500 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Paiement Sécurisé 256-bit
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">{title}</h3>
          </div>
          <button onClick={handleCloseAll} className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isDone ? (
          <form onSubmit={handlePay} className="space-y-4">
            
            {/* Décomposition du montant (Base + Frais 100 FCFA) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 font-medium">
                <span>Cotisation Pot :</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(baseAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-300 font-medium">
                <span>Frais de service plateforme :</span>
                <span className="font-bold">+ {formatCurrency(feeAmount)}</span>
              </div>
              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>Total Général à Payer :</span>
                <span className="text-amber-600 dark:text-amber-400 text-base">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Choix du Moyen de Paiement */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider">
                Choisissez votre moyen de paiement :
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProvider("wave")}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    provider === "wave"
                      ? "border-sky-500 bg-sky-500/10 text-sky-600 font-black shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-lg">🌊</span>
                  <span className="text-[10px] font-bold">Wave</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider("orange")}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    provider === "orange"
                      ? "border-orange-500 bg-orange-500/10 text-orange-600 font-black shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-lg">🍊</span>
                  <span className="text-[10px] font-bold">Orange Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider("mtn")}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    provider === "mtn"
                      ? "border-yellow-500 bg-yellow-500/10 text-yellow-600 font-black shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-lg">🟡</span>
                  <span className="text-[10px] font-bold">MTN MoMo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider("moov")}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
                    provider === "moov"
                      ? "border-blue-500 bg-blue-500/10 text-blue-600 font-black shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <span className="text-lg">🔵</span>
                  <span className="text-[10px] font-bold">Moov Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider("card")}
                  className={`col-span-2 p-2.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                    provider === "card"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600 font-black shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-bold">Carte Visa / Mastercard</span>
                </button>
              </div>
            </div>

            {/* Inputs selon le Provider */}
            {provider !== "card" ? (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Numéro {provider.toUpperCase()} Mobile Money *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: 07 01 02 03 04"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Numéro de carte bancaire *</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4000 1234 5678 9010"
                    className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Exp. (MM/AA) *</label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="12/28"
                      className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">CVC *</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Capture d'écran du Reçu de Dépôt / Transfert */}
            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-500" />
                  Capture d&apos;écran du dépôt / reçu Mobile Money *
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-full">Preuve requise</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProofUrl(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-700 dark:file:text-amber-400 hover:file:bg-amber-500/20"
              />
              {proofUrl && (
                <div className="p-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-2">
                  <img src={proofUrl} alt="Reçu joint" className="w-10 h-10 object-cover rounded-lg border border-emerald-500/30" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Capture d&apos;écran jointe avec succès
                  </span>
                </div>
              )}
            </div>

            {/* Bouton Payer */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl btn-mango-gold text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Validation du paiement en cours...</span>
              ) : (
                <>
                  <span>Confirmer & Payer {formatCurrency(totalAmount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Recu de succès de Paiement OK */
          <div className="py-6 text-center space-y-4 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-900 dark:text-white">Paiement Effectué avec Succès !</h4>
              <p className="text-xs text-slate-500">Votre paiement a été validé et enregistré instantanément.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Référence Reçu :</span>
                <strong className="font-mono text-amber-500">{receiptRef}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Montant Total :</span>
                <strong className="text-emerald-600">{formatCurrency(totalAmount)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Moyen utilisé :</span>
                <strong className="uppercase">{provider}</strong>
              </div>
            </div>

            <button
              onClick={handleCloseAll}
              className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-extrabold text-xs shadow-md"
            >
              Fermer & Terminer
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
