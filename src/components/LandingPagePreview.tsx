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
  Target,
  Clock,
  Video,
  Layers,
  Activity,
  FileText,
  BadgePercent,
  Copy,
  FolderGit2,
  Mail,
  TrendingUp,
  Crosshair
} from 'lucide-react';
import { sendPurchaseAlertToOwner, OWNER_NOTIFICATION_EMAIL } from '../services/emailReportService';
import { getLiveAppOrigin } from '../services/masterAuthService';
import { activateLicenseKey } from '../services/userLicenseService';
import { CashCaptainLogo } from './CashCaptainLogo';

interface LandingPagePreviewProps {
  onEnterApp?: () => void;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ onEnterApp }) => {
  // Affiliate state
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

  // 15 Beta Testers Cohort state
  const [betaName, setBetaName] = useState('');
  const [betaEmail, setBetaEmail] = useState('');
  const [betaProductType, setBetaProductType] = useState('Any Product / Physical Good');
  const [betaKeyClaimed, setBetaKeyClaimed] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ccm_beta_trial_key') || null;
    }
    return null;
  });
  const [betaCopied, setBetaCopied] = useState(false);
  const [betaSubmitting, setBetaSubmitting] = useState(false);

  const paypalRecipient = 'yeahwegotthat@proton.me';

  const PAYPAL_STARTER_URL =
    `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalRecipient)}&item_name=Cash+Captain+Marketeer+Starter+License&amount=47.00&currency_code=USD${partnerReferral ? `&custom=${encodeURIComponent(partnerReferral)}` : ''}`;
  const PAYPAL_PRO_URL =
    `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalRecipient)}&item_name=Cash+Captain+Marketeer+Captain+Pro+License&amount=97.00&currency_code=USD${partnerReferral ? `&custom=${encodeURIComponent(partnerReferral)}` : ''}`;
  const PAYPAL_LIFETIME_URL =
    `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(paypalRecipient)}&item_name=Cash+Captain+Marketeer+Founder+Lifetime+License&amount=197.00&currency_code=USD${partnerReferral ? `&custom=${encodeURIComponent(partnerReferral)}` : ''}`;

  // Stripe Checkout URLs
  const STRIPE_STARTER_URL = 'https://buy.stripe.com/ty_cashcaptain_starter_47';
  const STRIPE_PRO_URL = 'https://buy.stripe.com/ty_cashcaptain_pro_97';
  const STRIPE_LIFETIME_URL = 'https://buy.stripe.com/ty_cashcaptain_lifetime_197';

  const handleRegisterAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affiliateName.trim() || !affiliateEmail.trim() || !affiliatePayPal.trim()) return;
    setAffiliateRegistered(true);
  };

  // Claim Beta Tester Spot (10-Day All-Access Trial + Future License Discount)
  const handleClaimBetaTesterSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!betaName.trim() || !betaEmail.trim()) return;

    setBetaSubmitting(true);

    const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedKey = `CCM-BETA-TRIAL-10D-${rand1}-${rand2}`;

    // Activate the license key in app state
    activateLicenseKey(generatedKey, betaEmail);

    try {
      localStorage.setItem('ccm_beta_trial_key', generatedKey);
      localStorage.setItem('ccm_beta_tester_email', betaEmail);
      localStorage.setItem('ccm_beta_tester_name', betaName);
      localStorage.setItem('ccm_beta_discount_code', 'BETA50');
    } catch (err) {
      console.warn('Could not save beta trial locally', err);
    }

    // Send owner notification
    sendPurchaseAlertToOwner({
      tierName: `15-Beta-Tester Cohort (10-Day Free All-Access Pass) - ${betaName} (${betaEmail}) [${betaProductType}]`,
      amount: 0,
      timestamp: new Date().toLocaleString()
    });

    setBetaKeyClaimed(generatedKey);
    setBetaSubmitting(false);
  };

  const copyBetaKey = () => {
    if (!betaKeyClaimed) return;
    navigator.clipboard.writeText(betaKeyClaimed);
    setBetaCopied(true);
    setTimeout(() => setBetaCopied(false), 2500);
  };

  const liveBaseUrl = getLiveAppOrigin();

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Announcement Bar */}
      <div className="bg-[#0c1222] border-b border-slate-800 text-slate-200 px-4 py-2.5 text-center text-xs font-bold tracking-wider flex items-center justify-center gap-2.5 flex-wrap">
        <span className="text-[#39ff14] font-black">⚔️ CASH CAPTAIN:</span>
        <span className="text-slate-300">Will Work With Any Product or Service — You Can Sell Anything With This!</span>
        <a
          href="#beta-cohort"
          className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-black border border-amber-400/50 hover:bg-amber-500/30 transition flex items-center gap-1"
        >
          <span>🚀 15 Beta Testers Wanted (10-Day Free Trial)</span>
        </a>
        {partnerReferral && (
          <span className="px-2 py-0.5 rounded-full bg-[#060913] text-emerald-300 text-[10px] font-mono border border-emerald-400/40 shadow">
            Partner Ref #{partnerReferral}
          </span>
        )}
        {onEnterApp && (
          <button
            onClick={onEnterApp}
            className="ml-2 px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition cursor-pointer shadow-md shadow-emerald-500/20"
          >
            Launch Workstation &rarr;
          </button>
        )}
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0c1222]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-5">
            <CashCaptainLogo className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 drop-shadow-[0_4px_24px_rgba(57,255,20,0.35)]" />
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline tracking-tight select-none">
                <span className="text-2xl sm:text-3xl font-black text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.6)] leading-none">C</span>
                <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 mr-2 leading-none">ash</span>
                <span className="text-2xl sm:text-3xl font-black text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.6)] leading-none">C</span>
                <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-300 leading-none">aptain</span>
              </div>
              <div className="pl-4 sm:pl-6 mt-0.5 flex flex-col items-start">
                <span className="text-sm sm:text-base font-black tracking-wide text-[#39ff14] drop-shadow-[0_0_10px_rgba(57,255,20,0.5)] italic">
                  Marketeer!™
                </span>
                <svg className="w-28 sm:w-32 h-2 text-[#39ff14] -mt-0.5 overflow-visible" viewBox="0 0 140 10" fill="none">
                  <path d="M 2,3 C 35,8 90,9 135,2 C 120,4 90,7 45,5" fill="#39ff14" className="drop-shadow-[0_0_4px_rgba(57,255,20,0.8)]" />
                </svg>
              </div>
              <p className="text-[11px] text-slate-300 font-medium pl-4 sm:pl-6 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_5px_#39ff14]"></span>
                <span>Yeah We Got That Online • A Virbis.com Company</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#beta-cohort"
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer border-2 border-amber-300"
            >
              15 Beta Testers
            </a>
            <a
              href="#pricing"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition shadow-md shadow-emerald-500/20 cursor-pointer border-2 border-emerald-300"
            >
              Buy License
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-20 px-4 bg-gradient-to-b from-[#1e293b]/70 via-slate-950 to-slate-950 text-center">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="flex justify-center mb-1">
            <CashCaptainLogo className="w-20 h-20 sm:w-28 sm:h-28 drop-shadow-[0_8px_30px_rgba(57,255,20,0.35)]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-black border-2 border-emerald-400/50 shadow-md">
            <span>🔥 Autonomous AI Buyer Radar &bull; Zero-Ban Compliance &bull; 8 Dedicated Stations</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Will Work With Any Product or Service —{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] via-emerald-300 to-amber-300">
              You Can Sell Anything With This!
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop spamming links manually and getting banned. Cash Captain Marketeer autonomous AI radar monitors real-time want-ads, ISO posts, buyer discussions, and daily search trends — automatically generating viral video blueprints, contextual forum recommendations, and placing your link where ready-to-buy customers are looking today.
          </p>

          {/* Quick CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a
              href="#beta-cohort"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Claim Free 10-Day Beta Tester Pass (15 Spots)</span>
            </a>

            <a
              href="#pricing"
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] font-black text-sm transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-400"
            >
              <span className="font-extrabold italic text-[#003087]">Pay</span><span className="font-extrabold italic text-[#0079c1]">Pal</span>
              <span className="border-l border-[#003087]/30 pl-2">Purchase License</span>
              <ArrowRight className="w-4 h-4 text-[#003087]" />
            </a>

            {onEnterApp && (
              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border-2 border-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Open Workstation &rarr;
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 🚀 15 BETA TESTERS COHORT SECTION (Requested by User) */}
      <section id="beta-cohort" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-20">
        <div className="relative bg-gradient-to-br from-amber-950/70 via-[#0d1627] to-emerald-950/70 p-6 sm:p-10 rounded-3xl border-2 border-amber-400/60 shadow-2xl space-y-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Heading Bar */}
          <div className="space-y-3 text-center max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Special Cohort Invitation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              🚀 We Need 15 Beta Testers!
            </h2>
            <p className="text-xs sm:text-base text-slate-200 leading-relaxed">
              Help us test the newly upgraded autonomous marketing engine with your own product, service, physical good, or affiliate offer.
            </p>
          </div>

          {/* Spot Counter Bar */}
          <div className="bg-[#060913]/90 p-4 rounded-2xl border border-amber-500/30 max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-300 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Limited Cohort: Only 4 of 15 Spots Remaining Today</span>
              </span>
              <span className="font-mono text-emerald-400">11 Claimed / 15 Total</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div className="bg-gradient-to-r from-amber-500 via-emerald-400 to-[#39ff14] h-full rounded-full transition-all duration-1000 w-[73%]"></div>
            </div>
          </div>

          {/* 3 Core Beta Perks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs relative z-10">
            <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-emerald-500/40 space-y-2 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black text-base border border-emerald-400/40">
                1
              </div>
              <h3 className="font-black text-emerald-300 text-sm">Free 10-Day All-Access Trial</h3>
              <p className="text-slate-300 leading-relaxed">
                Enjoy 100% full, unrestricted access to all 8 tactical marketing stations, real-time web scraping, viral video blueprints, and auto-placements. Zero credit card required.
              </p>
            </div>

            <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-amber-500/40 space-y-2 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black text-base border border-amber-400/40">
                2
              </div>
              <h3 className="font-black text-amber-300 text-sm">Grandfathered Future Discount</h3>
              <p className="text-slate-300 leading-relaxed">
                As an official beta tester, you lock in a guaranteed 50% lifetime discount code on all future commercial software licensing renewals or lifetime ownership passes.
              </p>
            </div>

            <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-sky-500/40 space-y-2 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-black text-base border border-sky-400/40">
                3
              </div>
              <h3 className="font-black text-sky-300 text-sm">Instant Key & Direct Station Launch</h3>
              <p className="text-slate-300 leading-relaxed">
                Upon submitting the simple form below, your dedicated 10-day trial key is generated instantly. One click launches you right into your active workstation!
              </p>
            </div>
          </div>

          {/* Form or Claimed Card */}
          <div className="max-w-2xl mx-auto relative z-10">
            {!betaKeyClaimed ? (
              <form onSubmit={handleClaimBetaTesterSpot} className="bg-[#060913] p-6 sm:p-8 rounded-2xl border-2 border-amber-400/50 space-y-4 shadow-xl">
                <div className="text-center pb-2">
                  <h4 className="text-base font-black text-white">Apply for 1 of the 15 Beta Tester Spots</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Instant key generated immediately — start using the software in seconds.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Sarah Jenkins"
                      value={betaName}
                      onChange={(e) => setBetaName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Your Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., sarah@example.com"
                      value={betaEmail}
                      onChange={(e) => setBetaEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">What Product or Service Will You Test?</label>
                    <select
                      value={betaProductType}
                      onChange={(e) => setBetaProductType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                    >
                      <option value="Any Product / Physical Good">Physical Goods (Gear, Apparel, Equipment, Gold Paydirt, Crafts)</option>
                      <option value="SaaS or Digital Product">SaaS Software, Apps, Tools, or Digital Templates</option>
                      <option value="Local Trade or Consulting">Local Services, Contractor, Agency, or Consulting</option>
                      <option value="Affiliate Marketing Offer">Affiliate Marketing (ClickBank, WarriorPlus, CJ, etc.)</option>
                      <option value="Course or E-Learning">Online Course, Membership, Coaching, or Community</option>
                      <option value="Other Product / Service">Other Product or Service</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={betaSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm transition shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer border-2 border-amber-300"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{betaSubmitting ? 'Activating Pass...' : 'Claim My Free 10-Day All-Access Pass & Key'}</span>
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  🔒 No credit card needed. Instant software pass activation with guaranteed future licensing discount.
                </p>
              </form>
            ) : (
              <div className="bg-[#060913] p-6 sm:p-8 rounded-2xl border-2 border-emerald-400 space-y-5 shadow-2xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>10-Day All-Access Beta Membership Active!</span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xl font-black text-white">Welcome to the Cash Captain Beta Cohort!</h4>
                  <p className="text-xs text-slate-300">
                    Your account has been granted 100% unlocked usage for 10 full days across all 8 dedicated marketing stations.
                  </p>
                </div>

                {/* Key Display Box */}
                <div className="p-4 rounded-xl bg-[#0d1627] border-2 border-emerald-500/50 space-y-2 max-w-lg mx-auto">
                  <span className="text-[11px] uppercase tracking-wider font-mono text-emerald-400 font-bold block">
                    Your Official 10-Day Beta License Key:
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-sm sm:text-base font-black text-white select-all bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                      {betaKeyClaimed}
                    </span>
                    <button
                      onClick={copyBetaKey}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1 cursor-pointer"
                    >
                      {betaCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{betaCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Discount Voucher */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 max-w-lg mx-auto flex items-center justify-between text-xs">
                  <span className="text-amber-200 font-medium">Grandfathered Discount Code:</span>
                  <span className="font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40">
                    BETA50 (50% Off Future Licensing)
                  </span>
                </div>

                {/* Launch Station Button */}
                {onEnterApp && (
                  <button
                    onClick={onEnterApp}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 inline-flex items-center justify-center gap-2 cursor-pointer border-2 border-emerald-300"
                  >
                    <span>🚀 Launch Your 10-Day All-Access Station Now</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive: 8 Dedicated Marketing Stations */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 text-xs font-black border border-sky-400/30">
            <span>⚡ Complete Marketing Command Center</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            All 8 Dedicated Tactical Workstations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Clean, modular stations replace cluttered screens. Switch effortlessly between discovery, content, and tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Station 1: AI Auto-Pilot */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-emerald-500/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-sm">
              <Crosshair className="w-4 h-4" />
              <span>1. ⚡ AI Auto-Pilot</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Consolidated single-box workflow: Product &rarr; Description & Tags &rarr; Link &rarr; Picture & Video attachments with instant viral 0-3s hook blueprints.
            </p>
          </div>

          {/* Station 2: My Offers */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-blue-500/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-blue-400 font-black text-sm">
              <FileText className="w-4 h-4" />
              <span>2. 📁 My Offers</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Review saved campaigns, active syndication links, video asset blueprints, and launch live buyer updates on demand.
            </p>
          </div>

          {/* Station 3: Search Hubs */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-sky-400/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-sky-300 font-black text-sm">
              <FolderGit2 className="w-4 h-4" />
              <span>3. 🔍 Search Hubs</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Live radar scraping Reddit, Quora, Craigslist ISO, Facebook want-ads, and review sites for shoppers asking where to buy.
            </p>
          </div>

          {/* Station 4: Social Blast Hub */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-purple-400/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-purple-300 font-black text-sm">
              <Share2 className="w-4 h-4" />
              <span>4. 📢 Social Blast</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tailored syndication copy for TikTok, YouTube Shorts, X/Twitter, Instagram Reels, Pinterest, and community forums.
            </p>
          </div>

          {/* Station 5: Email Updates */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-rose-400/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-rose-300 font-black text-sm">
              <Mail className="w-4 h-4" />
              <span>5. 📬 Email Updates</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dedicated screen for scheduling sales alerts, weekly campaign briefings, buyer trend notifications, and email reports.
            </p>
          </div>

          {/* Station 6: 3-in-1 AI Suite */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-amber-400/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
              <Sparkles className="w-4 h-4" />
              <span>6. ✨ 3-in-1 Suite</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Triple-threat marketing engine: Angles Strategy Blueprint, High-Conversion Copywriter, and Distribution Syndication.
            </p>
          </div>

          {/* Station 7: Tracking & Ledger */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-teal-400/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-teal-300 font-black text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>7. 📈 Tracking &amp; Ledger</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time incoming click tracking with status indicators (Status: Live in green), conversion ledger, and revenue totals.
            </p>
          </div>

          {/* Station 8: Partner Program (40%) */}
          <div className="bg-[#0c1424] p-5 rounded-2xl border-2 border-emerald-400/40 space-y-2 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
              <Users className="w-4 h-4" />
              <span>8. 🤝 Partner (40%)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn 40% lifetime cash commissions or 25% + free software license with simple numbered short links (`ccm.app/ref101`).
            </p>
          </div>
        </div>
      </section>

      {/* "Sell Anything With This" - Use Cases */}
      <section className="py-12 px-4 max-w-5xl mx-auto space-y-6">
        <div className="bg-[#080d1a] p-8 rounded-3xl border-2 border-slate-800 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              Universal Application
            </span>
            <h3 className="text-2xl font-black text-white">
              What Can You Sell With Cash Captain?
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              If someone anywhere on the web is searching for it, Cash Captain will find them and recommend your link.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-amber-400 font-bold block text-sm">📦 Physical Goods</span>
              <p className="text-slate-300">
                Gold paydirt, camping gear, electronics, apparel, car parts, handmade crafts, tools, or collectibles.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-sky-400 font-bold block text-sm">💻 SaaS &amp; Digital Tools</span>
              <p className="text-slate-300">
                AI software, productivity tools, Notion templates, web apps, WordPress plugins, or digital downloads.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-emerald-400 font-bold block text-sm">🔗 Affiliate Offers</span>
              <p className="text-slate-300">
                ClickBank, JVZoo, CJ Affiliate, WarriorPlus, Amazon Associates, Digistore24, or private affiliate networks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-purple-400 font-bold block text-sm">🔧 Local Services &amp; Trades</span>
              <p className="text-slate-300">
                Contractors, mechanics, cleaning services, accounting, real estate, personal training, or consulting.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-rose-400 font-bold block text-sm">🎓 Courses &amp; Coaching</span>
              <p className="text-slate-300">
                E-learning courses, Masterclasses, group coaching, paid newsletters, webinars, and memberships.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
              <span className="text-teal-400 font-bold block text-sm">🛡️ Zero-Ban Compliance</span>
              <p className="text-slate-300">
                AI crafts authentic answers that provide genuine value first, ensuring compliance with forum moderators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pricing Options */}
      <section id="pricing" className="py-16 px-4 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-black border border-emerald-500/30">
            <span>💳 Commercial Licensing</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Choose Your Software License</h2>
          <p className="text-xs sm:text-sm text-slate-300">
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
                Ideal for solo marketers launching their first automated campaigns.
              </p>
              <ul className="text-xs text-slate-200 space-y-2.5 mt-5">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Up to 5 Active Product Offers</span>
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
                className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition text-center flex items-center justify-center gap-2 shadow cursor-pointer border-2 border-amber-400"
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
                  <span>Social Blast Suite &amp; Video Scripts</span>
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
                className="w-full py-3 px-4 rounded-xl bg-[#ffc439] hover:bg-[#f6bb32] text-[#003087] text-xs font-black transition text-center flex items-center justify-center gap-2 shadow cursor-pointer border-2 border-amber-400"
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
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
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
                  Share this link anywhere! All sales route commission to your PayPal ({affiliatePayPal}) and the balance to Y.W.G.T Online! / Virbis.com LLC.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#334155] bg-slate-950 py-8 text-xs text-[#94a3b8] text-center space-y-2">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CashCaptainLogo className="w-8 h-8 shrink-0 drop-shadow-[0_2px_8px_rgba(57,255,20,0.3)]" />
            <div className="flex items-baseline tracking-tight">
              <span className="font-black text-[#39ff14] text-sm drop-shadow-[0_0_6px_rgba(57,255,20,0.6)]">C</span>
              <span className="font-bold text-slate-200 text-xs mr-1">ash</span>
              <span className="font-black text-[#39ff14] text-sm drop-shadow-[0_0_6px_rgba(57,255,20,0.6)]">C</span>
              <span className="font-bold text-slate-200 text-xs mr-1">aptain</span>
              <span className="font-extrabold text-[#39ff14] text-xs italic">Marketeer!™</span>
            </div>
            <span>&bull;</span>
            <span className="text-slate-300">Yeah We Got That Online • A Virbis.com Company</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Secure PayPal & Stripe Checkout &bull; All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
};
