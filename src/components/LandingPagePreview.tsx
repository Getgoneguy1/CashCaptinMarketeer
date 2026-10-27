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
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import { sendPurchaseAlertToOwner, OWNER_NOTIFICATION_EMAIL } from '../services/emailReportService';

interface LandingPagePreviewProps {
  onEnterApp?: () => void;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ onEnterApp }) => {
  const [affiliateName, setAffiliateName] = useState('');
  const [affiliateEmail, setAffiliateEmail] = useState('');
  const [affiliatePayPal, setAffiliatePayPal] = useState('');
  const [affiliateRewardChoice, setAffiliateRewardChoice] = useState<'cash_40' | 'cash_25_license'>('cash_40');
  const [affiliateRegistered, setAffiliateRegistered] = useState(false);
  const [assignedPartnerId] = useState<number>(() => Math.floor(101 + Math.random() * 899));
  const [partnerReferral] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('ref') || null;
    }
    return null;
  });

  // Direct PayPal Checkout URLs for Y.W.G.T Online! / Virbis.com LLC
  const PAYPAL_STARTER_URL =
    'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=tybirchfield42@gmail.com&item_name=Cash+Captain+Marketeer+Starter+License&amount=47.00&currency_code=USD';
  const PAYPAL_PRO_URL =
    'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=tybirchfield42@gmail.com&item_name=Cash+Captain+Marketeer+Captain+Pro+License&amount=97.00&currency_code=USD';
  const PAYPAL_LIFETIME_URL =
    'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=tybirchfield42@gmail.com&item_name=Cash+Captain+Marketeer+Founder+Lifetime+License&amount=197.00&currency_code=USD';

  // Stripe Checkout URLs
  const STRIPE_STARTER_URL = 'https://buy.stripe.com/ty_cashcaptain_starter_47';
  const STRIPE_PRO_URL = 'https://buy.stripe.com/ty_cashcaptain_pro_97';
  const STRIPE_LIFETIME_URL = 'https://buy.stripe.com/ty_cashcaptain_lifetime_197';

  const handleRegisterAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateName.trim() || !affiliateEmail.trim() || !affiliatePayPal.trim()) return;
    setAffiliateRegistered(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-blue-600 text-slate-950 px-4 py-2 text-center text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 flex-wrap">
        <span>⚔️ Cash Captain: All in One, Cash for All!</span>
        {partnerReferral && (
          <span className="px-2 py-0.5 rounded-full bg-slate-950/90 text-emerald-300 text-[10px] font-mono border border-emerald-400/50 shadow">
            Affiliate Partner Ref #{partnerReferral}
          </span>
        )}
        {onEnterApp && (
          <button
            onClick={onEnterApp}
            className="ml-3 px-3 py-0.5 rounded bg-slate-950 text-amber-300 text-[11px] font-bold hover:bg-slate-900 transition cursor-pointer"
          >
            Open App Dashboard &rarr;
          </button>
        )}
      </div>

      {/* Header */}
      <header className="border-b border-[#334155]/80 bg-[#1e293b]/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              ⚔️
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Cash Captain Marketeer™</span>
              </h1>
              <p className="text-[11px] text-amber-300 font-semibold">
                Y.W.G.T Online! • A Virbis.com Company
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#pricing"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Get License
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 bg-gradient-to-b from-[#1e293b]/60 via-slate-950 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30">
            <span>🔥 Autonomous AI Buyer Radar &bull; Zero-Ban Compliance Engine</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Turn 1 Affiliate Link Into A <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-blue-400">24/7 Buyer Army.</span>
          </h1>

          <p className="text-sm sm:text-lg text-[#94a3b8] max-w-2xl mx-auto leading-relaxed">
            Stop pasting links manually and getting banned. Cash Captain Marketeer is the autonomous AI agent that scrapes live Reddit & Quora buyer threads and auto-places your links on 100% autopilot.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#pricing"
              className="py-4 px-8 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] font-black text-base transition shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer ring-2 ring-amber-400/40"
            >
              <span className="font-extrabold italic text-lg text-[#003087]">Pay</span><span className="font-extrabold italic text-lg text-[#0079c1]">Pal</span>
              <span className="border-l border-[#003087]/30 pl-2 font-bold text-sm text-[#003087]">Claim Your License Now</span>
              <ArrowRight className="w-4 h-4 text-[#003087]" />
            </a>
          </div>

          <div className="pt-2 text-xs font-mono text-amber-300">
            Master Company Link: <strong className="text-white">https://ccm.app/go</strong>
          </div>
        </div>
      </section>

      {/* 3 Pricing Options */}
      <section id="pricing" className="py-16 px-4 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black text-white">Choose Your Commercial License</h2>
          <p className="text-xs sm:text-sm text-[#94a3b8]">
            Instant automated key delivery upon secure PayPal or Stripe checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 1: Starter */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] flex flex-col justify-between space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-extrabold text-blue-400 uppercase tracking-wider block mb-1">
                Starter Marketeer
              </span>
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
                className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition text-center flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <span className="font-extrabold italic text-sm text-[#003087]">Pay</span><span className="font-extrabold italic text-sm text-[#0079c1]">Pal</span>
                <span>Pay $47 with PayPal</span>
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
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition text-center flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-200" />
                <span>Pay $47 with Stripe</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
              </a>
            </div>
          </div>

          {/* Tier 2: Captain Pro */}
          <div className="bg-gradient-to-b from-[#1e293b] via-[#1e293b] to-blue-950/90 p-6 rounded-2xl border-2 border-amber-500 shadow-2xl flex flex-col justify-between space-y-6 relative transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-lg">
              ⭐ Most Popular &bull; Captain Pro
            </div>
            <div>
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block mb-1 mt-2">
                Captain Pro License
              </span>
              <div className="text-4xl font-black text-white mb-2">
                $97<span className="text-xs text-[#94a3b8] font-normal"> / full license</span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Unlimited automated buyer placement, micro-search utilities, and full auto-pilot.
              </p>
              <ul className="text-xs text-slate-200 space-y-2.5 mt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Unlimited</strong> Active Offers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>100% Hands-Free Auto-Placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Interactive Micro-Search Hubs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Social Blast Suite</span>
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
                className="w-full py-3.5 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition text-center flex items-center justify-center gap-2 shadow-lg cursor-pointer ring-2 ring-amber-400/50"
              >
                <span className="font-extrabold italic text-base text-[#003087]">Pay</span><span className="font-extrabold italic text-base text-[#0079c1]">Pal</span>
                <span>Pay $97 with PayPal</span>
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
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition text-center flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-indigo-200" />
                <span>Pay $97 with Stripe</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
              </a>
            </div>
          </div>

          {/* Tier 3: Founder Lifetime */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] flex flex-col justify-between space-y-6 shadow-xl">
            <div>
              <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider block mb-1">
                Founder Lifetime Pass
              </span>
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
                  <span>VIP Founder Support</span>
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
                className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition text-center flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <span className="font-extrabold italic text-sm text-[#003087]">Pay</span><span className="font-extrabold italic text-sm text-[#0079c1]">Pal</span>
                <span>Pay $197 Lifetime via PayPal</span>
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
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition text-center flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-indigo-200" />
                <span>Pay $197 with Stripe</span>
                <ExternalLink className="w-3.5 h-3.5 text-indigo-200" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Partner Program Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-blue-950/80 via-[#1e293b] to-amber-950/80 p-6 sm:p-10 rounded-3xl border-2 border-blue-500/40 shadow-2xl space-y-6">
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
                Earn 40% cash commission on all Lifetime Pass ($197) referrals, and 25% on Starter ($47) & Pro ($97) tiers, paid direct via PayPal.
              </p>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-xl border border-[#334155] space-y-2">
              <span className="text-blue-400 font-bold block text-sm">🎁 25% + Free App License Option</span>
              <p className="text-[#94a3b8] leading-relaxed">
                Choose 25% commission plus a **Free Basic App License** for your own automated marketing campaigns.
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
          <div className="bg-[#0f172a] p-6 rounded-xl border border-blue-500/30 space-y-4">
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
              <div className="bg-[#1e293b] p-5 rounded-xl border border-emerald-500/50 space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Affiliate Partnership Active for {affiliateName}!</span>
                </div>
                <p className="text-xs text-slate-300">
                  Assigned Partner ID: <strong className="text-amber-400">Ref #{assignedPartnerId}</strong> &bull; Tier: <strong className="text-amber-300">{affiliateRewardChoice === 'cash_40' ? '40% Lifetime Cash' : '25% Cash + Free License'}</strong>
                </p>
                <div className="bg-[#0f172a] p-3 rounded-lg border border-[#475569] font-mono text-xs text-sky-400 select-all">
                  https://ccm.app/ref{assignedPartnerId}
                </div>
                <p className="text-[11px] text-slate-400">
                  Share this short numbered link anywhere! All sales route commission to your PayPal ({affiliatePayPal}) and the balance to Y.W.G.T Online! / Virbis.com LLC.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#334155] bg-slate-950 py-8 text-xs text-[#94a3b8] text-center space-y-2">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">⚔️ Cash Captain Marketeer™</span>
            <span>&bull;</span>
            <span className="text-slate-300">Y.W.G.T Online! • A Virbis.com Company</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Secure PayPal & Stripe Checkout &bull; All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};
