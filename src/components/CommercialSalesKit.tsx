import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  DollarSign,
  Check,
  Flame,
  Award,
  ExternalLink,
  Crown,
  CheckCircle2,
  Lock,
  CreditCard,
  Users,
  Send,
  Share2,
  Eye,
  Copy,
  Download
} from 'lucide-react';
import { sendPurchaseAlertToOwner, OWNER_NOTIFICATION_EMAIL } from '../services/emailReportService';
import { getLiveAppOrigin } from '../services/masterAuthService';
import { MasterAppSettings } from '../types';
import { LandingPagePreview } from './LandingPagePreview';
import { CashCaptainLogo } from './CashCaptainLogo';

interface CommercialSalesKitProps {
  appSettings?: MasterAppSettings;
}

export const CommercialSalesKit: React.FC<CommercialSalesKitProps> = ({ appSettings }) => {
  const [showFullLandingPage, setShowFullLandingPage] = useState(false);
  const [copiedAdUrl, setCopiedAdUrl] = useState(false);
  const [copiedShortUrl, setCopiedShortUrl] = useState(false);
  const [affiliateName, setAffiliateName] = useState('');
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [affiliatePayPal, setAffiliatePayPal] = useState('');
  const [affiliateRewardChoice, setAffiliateRewardChoice] = useState<'cash_40' | 'cash_25_license'>('cash_40');
  const [affiliateRegistered, setAffiliateRegistered] = useState(false);
  const [assignedPartnerId] = useState<number>(() => Math.floor(101 + Math.random() * 899));

  // Use configured liveDomain from settings or active live origin
  const liveBaseUrl = appSettings?.liveDomain || getLiveAppOrigin();
  const landingPageUrl = `${liveBaseUrl}/?page=landing`;
  const appUrl = liveBaseUrl;

  const paypalRecipient = appSettings?.paypalEmail || 'yeahwegotthat@proton.me';

  // Direct PayPal Checkout URLs for Y.W.G.T Online! / Virbis.com LLC
  const PAYPAL_STARTER_URL =
    `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalRecipient)}&item_name=Cash+Captain+Marketeer+Starter+License&amount=47.00&currency_code=USD`;
  const PAYPAL_PRO_URL =
    `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalRecipient)}&item_name=Cash+Captain+Marketeer+Captain+Pro+License&amount=97.00&currency_code=USD`;
  const PAYPAL_LIFETIME_URL =
    `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalRecipient)}&item_name=Cash+Captain+Marketeer+Founder+Lifetime+License&amount=197.00&currency_code=USD`;

  // Stripe Checkout URLs (Y.W.G.T Online! / Virbis.com LLC Stripe Business Checkout)
  const STRIPE_STARTER_URL = 'https://buy.stripe.com/ty_cashcaptain_starter_47';
  const STRIPE_PRO_URL = 'https://buy.stripe.com/ty_cashcaptain_pro_97';
  const STRIPE_LIFETIME_URL = 'https://buy.stripe.com/ty_cashcaptain_lifetime_197';

  const handleRegisterAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateName.trim() || !affiliateEmail.trim() || !affiliatePayPal.trim()) return;
    setAffiliateRegistered(true);
  };

  if (showFullLandingPage) {
    return <LandingPagePreview onEnterApp={() => setShowFullLandingPage(false)} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header & Branding */}
      <div className="bg-[#0c1222] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4">
        <div className="inline-flex items-center justify-center mb-2">
          <CashCaptainLogo className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_6px_28px_rgba(57,255,20,0.35)]" />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-baseline tracking-tight select-none">
            <span className="text-4xl sm:text-6xl font-black text-[#39ff14] drop-shadow-[0_0_14px_rgba(57,255,20,0.7)] leading-none">C</span>
            <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 mr-2 sm:mr-3 leading-none">ash</span>
            <span className="text-4xl sm:text-6xl font-black text-[#39ff14] drop-shadow-[0_0_14px_rgba(57,255,20,0.7)] leading-none">C</span>
            <span className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 leading-none">aptain</span>
          </div>
          <div className="pl-6 sm:pl-10 mt-1 flex flex-col items-center">
            <span className="text-2xl sm:text-4xl font-black tracking-wide text-[#39ff14] drop-shadow-[0_0_12px_rgba(57,255,20,0.6)] italic">
              Marketeer!™
            </span>
            <svg className="w-40 sm:w-52 h-2.5 text-[#39ff14] mt-0.5 overflow-visible" viewBox="0 0 160 12" fill="none">
              <path d="M 2,4 C 40,10 110,11 155,2 C 140,5 110,9 55,7" fill="#39ff14" className="drop-shadow-[0_0_5px_rgba(57,255,20,0.9)]" />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-[#39ff14] font-semibold mt-2.5">
            Y.W.G.T Online! • A Virbis.com Company &bull; <span className="text-amber-300">"All for Cash, and Cash for All!"</span>
          </p>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Unlock the ultimate autonomous AI buyer radar, zero-ban compliance engine, and hands-free affiliate traffic placement platform. Choose your license below for instant access.
        </p>
      </div>

      {/* Quick Master Link Box for Company Use & Ad Campaigns */}
      <div className="bg-[#0c1222] p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block">
              🎯 Dedicated Ad Campaign Landing Page (For Ads & Traffic Blasts)
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              Send potential buyers directly to your verified active live sales landing page:
            </p>
          </div>
          <button
            onClick={() => setShowFullLandingPage(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto shrink-0 shadow shadow-emerald-500/20"
            title="Open Standalone External Sales Landing Page"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Landing Page</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Direct Live Ad URL */}
          <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Direct Live Ad URL (For Facebook / Google / TikTok / Solo Ads):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={landingPageUrl}
                className="w-full bg-slate-950 px-3 py-1.5 rounded-lg text-xs text-emerald-400 font-mono border border-slate-800 select-all"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(landingPageUrl);
                  setCopiedAdUrl(true);
                  setTimeout(() => setCopiedAdUrl(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1 cursor-pointer"
              >
                {copiedAdUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAdUrl ? 'Copied!' : 'Copy'}</span>
              </button>
              <a
                href={landingPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold shrink-0 transition"
                title="Open Live Link to Verify"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Master Short URL */}
          <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Official Master Branded Link (For bios, posts, and ads):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full bg-slate-950 px-3 py-1.5 rounded-lg text-xs text-emerald-400 font-mono border border-slate-800 select-all"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(appUrl);
                  setCopiedShortUrl(true);
                  setTimeout(() => setCopiedShortUrl(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold shrink-0 transition flex items-center gap-1 cursor-pointer"
              >
                {copiedShortUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShortUrl ? 'Copied!' : 'Copy'}</span>
              </button>
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold shrink-0 transition"
                title="Open Live Link to Verify"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* 1-Click Download Playbook Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-emerald-400">📥 Ty's Master Marketing Playbook:</span> Download complete ad copy, TikTok scripts, Reddit posts, solo ad swipes & objection FAQs.
          </div>
          <a
            href="/CashCaptain_Marketeer_Master_Sales_Kit.txt"
            download="CashCaptain_Marketeer_Master_Sales_Kit.txt"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer shadow shrink-0"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Marketing Kit (.TXT)</span>
          </a>
        </div>
      </div>

      {/* 3 Pricing Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Starter */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] flex flex-col justify-between space-y-6 shadow-xl hover:border-slate-400 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider">
                Starter Marketeer
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                Beginner Friendly
              </span>
            </div>
            <div className="text-4xl font-black text-white mb-2">
              $47<span className="text-xs text-[#94a3b8] font-normal"> / one-time</span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Ideal for solo marketers launching their first automated affiliate campaigns.
            </p>
            <ul className="text-xs text-slate-200 space-y-2.5 mt-5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Up to 5 Active Affiliate Offers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Autonomous AI Web Scraping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Ban Compliance Copy</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant License Activation</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#334155]">
            <a
              href={PAYPAL_STARTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                sendPurchaseAlertToOwner({
                  tierName: 'Starter Marketeer ($47)',
                  amount: 47,
                  timestamp: new Date().toLocaleString()
                });
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition-all text-center flex items-center justify-center gap-2 shadow cursor-pointer transform hover:-translate-y-0.5"
            >
              <span className="font-extrabold italic text-sm text-[#003087]">Pay</span><span className="font-extrabold italic text-sm text-[#0079c1]">Pal</span>
              <span className="border-l border-[#003087]/30 pl-2 font-bold text-xs text-[#003087]">Pay $47 with PayPal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#003087]" />
            </a>

            <a
              href={STRIPE_STARTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                sendPurchaseAlertToOwner({
                  tierName: 'Starter Marketeer ($47)',
                  amount: 47,
                  timestamp: new Date().toLocaleString()
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-200" />
              <span>Pay $47 with Stripe (Card)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
            </a>
            <p className="text-[10px] text-center text-slate-400">🔒 Secure Checkout &bull; Zero Monthly Fees</p>
          </div>
        </div>

        {/* Tier 2: Captain Pro (Most Popular) */}
        <div className="bg-slate-900/95 p-6 rounded-2xl border-2 border-emerald-400 shadow-2xl shadow-emerald-500/15 flex flex-col justify-between space-y-6 relative transform md:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-400 text-slate-950 text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-lg">
            ⭐ Most Popular &bull; Captain Pro
          </div>
          <div>
            <div className="flex items-center justify-between mb-2 mt-2">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                Captain Pro License
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                Best Value
              </span>
            </div>
            <div className="text-4xl font-black text-white mb-2">
              $97<span className="text-xs text-[#94a3b8] font-normal"> / full license</span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Unlimited automated buyer placement, micro-search utilities, and full auto-pilot.
            </p>
            <ul className="text-xs text-slate-200 space-y-2.5 mt-5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>Unlimited</strong> Active Offers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Hands-Free Auto-Placement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Interactive Micro-Search Hubs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Social Blast Multi-Platform Suite</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Priority Support & Updates</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#334155]">
            <a
              href={PAYPAL_PRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                sendPurchaseAlertToOwner({
                  tierName: 'Captain Pro License ($97)',
                  amount: 97,
                  timestamp: new Date().toLocaleString()
                });
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transform hover:-translate-y-0.5 ring-2 ring-amber-400/50"
            >
              <span className="font-extrabold italic text-base text-[#003087]">Pay</span><span className="font-extrabold italic text-base text-[#0079c1]">Pal</span>
              <span className="border-l border-[#003087]/30 pl-2 font-bold text-xs text-[#003087]">Pay $97 with PayPal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#003087]" />
            </a>

            <a
              href={STRIPE_PRO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                sendPurchaseAlertToOwner({
                  tierName: 'Captain Pro License ($97)',
                  amount: 97,
                  timestamp: new Date().toLocaleString()
                });
              }}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition-all text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-indigo-200" />
              <span>Pay $97 with Stripe (Card)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
            </a>
            <p className="text-[10px] text-center text-amber-300 font-semibold">⚡ Instant Automated Key Delivery</p>
          </div>
        </div>

        {/* Tier 3: Founder Lifetime */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] flex flex-col justify-between space-y-6 shadow-xl hover:border-slate-400 transition">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">
                Founder Lifetime Pass
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                VIP Access
              </span>
            </div>
            <div className="text-4xl font-black text-white mb-2">
              $197<span className="text-xs text-[#94a3b8] font-normal"> / lifetime</span>
            </div>
            <p className="text-xs text-[#94a3b8]">
              Pay once, own Cash Captain Marketeer forever with all future AI engine updates.
            </p>
            <ul className="text-xs text-slate-200 space-y-2.5 mt-5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Lifetime Software Ownership</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>All Future AI Engine Upgrades</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>VIP Founder Support & Strategy</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Zero Recurring Fees Ever</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#334155]">
            <a
              href={PAYPAL_LIFETIME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                sendPurchaseAlertToOwner({
                  tierName: 'Founder Lifetime Pass ($197)',
                  amount: 197,
                  timestamp: new Date().toLocaleString()
                });
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition-all text-center flex items-center justify-center gap-2 shadow cursor-pointer transform hover:-translate-y-0.5"
            >
              <span className="font-extrabold italic text-sm text-[#003087]">Pay</span><span className="font-extrabold italic text-sm text-[#0079c1]">Pal</span>
              <span className="border-l border-[#003087]/30 pl-2 font-bold text-xs text-[#003087]">Pay $197 Lifetime via PayPal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#003087]" />
            </a>

            <a
              href={STRIPE_LIFETIME_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                sendPurchaseAlertToOwner({
                  tierName: 'Founder Lifetime Pass ($197)',
                  amount: 197,
                  timestamp: new Date().toLocaleString()
                });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-indigo-200" />
              <span>Pay $197 with Stripe (Card)</span>
              <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
            </a>
            <p className="text-[10px] text-center text-slate-400">🔒 Secure Checkout &bull; Lifetime Access</p>
          </div>
        </div>
      </div>

      {/* SCALED AFFILIATE PARTNER PROGRAM SECTION */}
      <div className="bg-gradient-to-r from-blue-950/80 via-[#1e293b] to-amber-950/80 p-6 sm:p-8 rounded-2xl border-2 border-blue-500/40 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black shadow-lg text-xl">
              🤝
            </div>
            <div>
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider block">
                Partner Affiliate Program
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Earn 40% Lifetime Commission or 25% + Free App License!
              </h2>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/40 shrink-0">
            Numbered Short Links (`ccm.app/ref101`)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#0f172a] p-4 rounded-xl border border-[#334155] space-y-2">
            <span className="text-amber-400 font-bold block text-sm">💎 40% Lifetime Commission</span>
            <p className="text-[#94a3b8] leading-relaxed">
              Earn a robust 40% cash commission on all Lifetime Pass ($197) referrals, and 25% on Starter ($47) & Pro ($97) tiers, paid direct via PayPal.
            </p>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-xl border border-[#334155] space-y-2">
            <span className="text-blue-400 font-bold block text-sm">🎁 25% + Free App License Option</span>
            <p className="text-[#94a3b8] leading-relaxed">
              Prefer software access over higher cash? Choose 25% commission plus a **Free Basic App License** for your own automated marketing campaigns.
            </p>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-xl border border-[#334155] space-y-2">
            <span className="text-purple-400 font-bold block text-sm">⚡ Numbered Short Tracking</span>
            <p className="text-[#94a3b8] leading-relaxed">
              Every affiliate receives a short, clean numbered link (`ccm.app/ref101`) that is easy to remember and perfect for social posting.
            </p>
          </div>
        </div>

        {/* Affiliate Sign-Up / Generator Form */}
        <div className="bg-[#0f172a] p-5 rounded-xl border border-blue-500/30 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>Join the Cash Captain Partner Network &bull; Get Your Numbered Short Link</span>
          </h3>

          {!affiliateRegistered ? (
            <form onSubmit={handleRegisterAffiliate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={affiliateName}
                  onChange={(e) => setAffiliateName(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#1e293b] border border-[#475569] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Contact Email"
                  value={affiliateEmail}
                  onChange={(e) => setAffiliateEmail(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#1e293b] border border-[#475569] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <input
                  type="email"
                  required
                  placeholder="Your PayPal Email (for Payouts)"
                  value={affiliatePayPal}
                  onChange={(e) => setAffiliatePayPal(e.target.value)}
                  className="px-3.5 py-2.5 bg-[#1e293b] border border-[#475569] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-300 font-bold">Commission Preference:</span>
                  <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                    <input
                      type="radio"
                      name="rewardChoice"
                      checked={affiliateRewardChoice === 'cash_40'}
                      onChange={() => setAffiliateRewardChoice('cash_40')}
                      className="accent-amber-500"
                    />
                    <span>40% Lifetime Cash Split</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-blue-300 cursor-pointer">
                    <input
                      type="radio"
                      name="rewardChoice"
                      checked={affiliateRewardChoice === 'cash_25_license'}
                      onChange={() => setAffiliateRewardChoice('cash_25_license')}
                      className="accent-blue-500"
                    />
                    <span>25% Cash + Free Basic License</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs transition shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Numbered Short Link</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#0c1222] p-5 rounded-2xl border border-emerald-500/40 space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Affiliate Partnership Active for {affiliateName}!</span>
              </div>
              <p className="text-xs text-slate-300">
                Assigned Partner ID: <strong className="text-emerald-400">Ref #{assignedPartnerId}</strong> &bull; Tier: <strong className="text-amber-300">{affiliateRewardChoice === 'cash_40' ? '40% Lifetime Cash' : '25% Cash + Free License'}</strong>
              </p>
              <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
                <div className="bg-[#060913] px-3.5 py-2 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 select-all flex-1 truncate">
                  {`${liveBaseUrl}/?ref=${assignedPartnerId}`}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${liveBaseUrl}/?ref=${assignedPartnerId}`);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <a
                  href={`${liveBaseUrl}/?ref=${assignedPartnerId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition"
                  title="Open Link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[11px] text-slate-400">
                Share this link anywhere! All sales automatically track your partner ID and commission.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security & Guarantee Footer */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-white">100% Secure Encrypted Checkout</h4>
            <p className="text-xs text-[#94a3b8]">
              Payments are processed securely through PayPal & Stripe for Y.W.G.T Online! / Virbis.com LLC. Instant automated key delivery upon checkout.
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-amber-300 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/30 shrink-0">
          Support: {OWNER_NOTIFICATION_EMAIL}
        </div>
      </div>
    </div>
  );
};
