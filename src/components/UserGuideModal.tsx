import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Crosshair,
  Sparkles,
  FolderGit2,
  Link2,
  TrendingUp,
  CreditCard,
  Share2,
  Mail,
  Flame,
  Search,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Zap,
  HelpCircle,
  Download
} from 'lucide-react';
import { CashCaptainLogo } from './CashCaptainLogo';
import { getLiveAppOrigin } from '../services/masterAuthService';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<string>('quickstart');

  if (!isOpen) return null;

  const sections = [
    { id: 'quickstart', label: '🚀 Quick-Start Checklist', icon: Zap },
    { id: 'autopilot', label: '⚡ AI Auto-Pilot Radar', icon: Crosshair },
    { id: 'offers', label: '📦 Managing Offers', icon: Sparkles },
    { id: 'copy', label: '✍️ Promo Copy & Scripts', icon: Sparkles },
    { id: 'hubs', label: '🔍 Interactive Search Hubs', icon: FolderGit2 },
    { id: 'social', label: '📣 Social Media Ads Blaster', icon: Share2 },
    { id: 'affiliate_pro', label: '🔗 Affiliate Pro & Deep Links', icon: Link2 },
    { id: 'accounting', label: '📊 Tracking & Accounting Ledger', icon: TrendingUp },
    { id: 'payments', label: '💳 PayPal Selling & Payouts', icon: CreditCard },
    { id: 'hosting', label: '☁️ Cloud Run & Firebase Setup', icon: Flame }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CashCaptainLogo className="w-12 h-12 shrink-0 drop-shadow-[0_2px_14px_rgba(57,255,20,0.35)]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Cash Captain Marketeer™ Official User Guide
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  v1.0 Production
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Official Cash Captain Operating Manual &bull; Authorized License Holders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Main Body with Sidebar Navigation */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#334155] bg-slate-900/60 p-3 overflow-y-auto space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Table of Contents
            </div>
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="truncate">{sec.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-200 text-sm leading-relaxed">
            {/* SECTION 1: QUICK START */}
            {activeSection === 'quickstart' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    5-Minute Quick-Start Checklist
                  </h3>
                  <p className="text-xs text-slate-400">
                    Follow these four simple steps to get your first campaign live and generating commissions today.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">Activate the AI Auto-Pilot Radar</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Open the <strong>⚡ AI Auto-Pilot</strong> tab. Click <em>"Run Live Scan"</em>. The engine scans high-intent discussions on Reddit, Quora, and YouTube for people asking how to solve problems that match your products.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">Generate Zero-Ban Value-First Copy</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Go to <strong>Promo Copy</strong>. Select any offer (e.g., ClickFunnels, Jasper AI, or Semrush). Copy the platform-specific scripts (Reddit, Twitter threads, email follow-ups). The AI inserts problem-solving advice first so moderators never ban your posts.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">Deploy Interactive Search Hubs</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Go to <strong>Search Hubs</strong>. Every product has an embeddable micro-search calculator widget. Instead of pasting raw affiliate links, send visitors to your interactive Hub or embed the code onto any blog, landing page, or Medium article.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/40 font-bold flex items-center justify-center shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">Blast Social Media Ads in 1-Click</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Click the pink <strong>"Social Ads Blast"</strong> button in the top navigation. Select Facebook, Instagram, TikTok, Reddit, or X. Your sales copy and public live URL are pre-filled—just click Post!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: AI AUTO-PILOT */}
            {activeSection === 'autopilot' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-blue-400 flex items-center gap-2">
                    <Crosshair className="w-5 h-5 text-amber-300" />
                    AI Auto-Pilot Radar (Autonomous Buyer Discovery)
                  </h3>
                  <p className="text-xs text-slate-400">
                    How the autonomous intelligence scans public web signals to match prospective buyers with your products.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    <strong>What it does:</strong> The AI Auto-Pilot simulates an autonomous market intelligence agent. It searches community threads across:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li><strong>Reddit:</strong> Subreddits like r/entrepreneur, r/digitalmarketing, r/SaaS, r/copywriting.</li>
                    <li><strong>Quora:</strong> High-traffic questions where users explicitly ask "What is the best tool for...".</li>
                    <li><strong>YouTube:</strong> High-intent review and tutorial comment sections.</li>
                  </ul>
                  <p>
                    <strong>Placement Confidence Score:</strong> The engine rates each prospect (90%–98% Match). If an opportunity has high intent, the autonomous poster drafts the exact non-spam response that answers their question and recommends your affiliate solution.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 3: MANAGING OFFERS */}
            {activeSection === 'offers' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Managing Your Affiliate Offers
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adding products, commissions, custom affiliate IDs, and deep links.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    <strong>Adding an Offer:</strong> Click the <strong>"+ Add Offer"</strong> or <strong>"Bulk Add"</strong> button at any time. Enter:
                  </p>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-300">
                    <li><strong>Product Name:</strong> (e.g. "Shopify", "ClickFunnels", "Canva Pro")</li>
                    <li><strong>Description:</strong> Brief summary of the core customer pain point it solves.</li>
                    <li><strong>Affiliate ID / HopLink:</strong> Your unique username or ID code provided by ClickBank, CJ, ShareASale, or PartnerStack.</li>
                    <li><strong>Target URL:</strong> The official destination where buyers check out.</li>
                  </ol>
                  <p>
                    The system immediately generates optimized keywords, multi-platform promotional copy, and an interactive micro-search widget for each offer.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 4: PROMO COPY */}
            {activeSection === 'copy' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-purple-400 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    Multi-Platform Promo Copy Center
                  </h3>
                  <p className="text-xs text-slate-400">
                    Zero-ban, contextual promotional scripts tailored for each platform.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    Different social platforms require different copy styles. Cash Captain Marketeer generates 5 distinct formats for every product:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <strong className="text-amber-300">Reddit & Forum Responses:</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">Value-first answers solving problems with organic tool mentions to avoid moderation flags.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <strong className="text-sky-300">X (Twitter) Viral Threads:</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">Hook-driven multi-tweet structures designed for high retweets and bookmarks.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <strong className="text-emerald-300">Email Newsletters:</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">Engaging storytelling copy with clear, high-click call-to-actions.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <strong className="text-rose-300">YouTube Descriptions:</strong>
                      <p className="text-slate-400 text-[11px] mt-0.5">SEO-optimized video descriptions with timestamp-ready link slots.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: SEARCH HUBS */}
            {activeSection === 'hubs' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-emerald-400 flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-emerald-400" />
                    Interactive Search Hubs & Embeddable Widgets
                  </h3>
                  <p className="text-xs text-slate-400">
                    Turn cold traffic into warm buyers with interactive problem-solver search bars.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    Direct affiliate links often get flagged or ignored. Cash Captain Marketeer solves this with <strong>Interactive Micro-Search Widgets</strong>:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    <li>Visitors type their query or problem into the interactive search bar.</li>
                    <li>The widget provides instant tailored guidance and presents your affiliate solution as the answer.</li>
                    <li>You can click <em>"Copy Embed Code"</em> to paste the widget into any website, WordPress blog, Webflow page, or custom HTML site.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION 6: SOCIAL ADS BLASTER */}
            {activeSection === 'social' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-pink-400 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-pink-400" />
                    Social Media Ads Blast Command Center
                  </h3>
                  <p className="text-xs text-slate-400">
                    Syndicate promotional campaigns across all your social channels with pre-written copy.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    Access the <strong>"📢 Social Blast Hub"</strong> tab in the main navigation to launch cross-platform syndication across all major networks.
                  </p>
                  <div className="space-y-2">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">Facebook & LinkedIn:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">Opens the native share composer with your live app link and preview description automatically pre-filled.</p>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">Instagram & TikTok:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">Provides pre-formatted caption copy, trending hashtags (#affiliatemarketing, #makemoneyonline), 30-second viral creator scripts, and visual action outlines.</p>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">X (Twitter) & Reddit:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">1-click direct link to tweet full threads or submit case study reviews to top entrepreneurial subreddits.</p>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="font-bold text-white">WhatsApp & Pinterest:</span>
                      <p className="text-slate-400 text-[11px] mt-0.5">Instantly broadcast referral messages to groups and create high-intent Rich Pins for viral Pinterest traffic.</p>
                    </div>
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-emerald-500/30">
                      <span className="font-bold text-emerald-400">🚀 Master Syndication:</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">Click "Blast To All Outlets Now" to syndicate across all 8 networks at once and save campaign records to Firebase Firestore.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 7: AFFILIATE PRO */}
            {activeSection === 'affiliate_pro' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-sky-400 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-sky-400" />
                    Affiliate Pro Connect & Deep Link Engine
                  </h3>
                  <p className="text-xs text-slate-400">
                    Connecting external tracking platforms, sub-IDs, and automated webhooks.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    If you use external affiliate software (like Post Affiliate Pro, Voluum, RedTrack, or Everflow):
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                    <li>Toggle <strong>"Enable Affiliate Pro Integration"</strong>.</li>
                    <li>Enter your Tracking Domain or Webhook URL.</li>
                    <li>The system automatically appends your dynamic tracking sub-IDs (e.g. <code className="text-amber-300 font-mono">?subid=captain_radar&source=reddit</code>) so you know exactly which thread or campaign generated each sale.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION 8: ACCOUNTING & LEDGER */}
            {activeSection === 'accounting' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-purple-400 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    Click Tracking & Accounting Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time metrics: Total clicks, conversions, EPC (earnings per click), and revenue.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    Every time a visitor clicks an affiliate link or searches on an interactive hub, the app logs:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-300">
                    <li>Timestamp, target offer, and referral source.</li>
                    <li>Calculated conversion rate and estimated earnings per click (EPC).</li>
                    <li>Permanent cloud sync to your provisioned Firebase Firestore database.</li>
                  </ul>
                  <p>
                    You can test your conversion tracker directly in the ledger using the <em>"Simulate Conversion"</em> button.
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 9: PAYPAL SELLING & PAYOUTS */}
            {activeSection === 'payments' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-amber-300 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-400" />
                    PayPal Selling & Commercial Licensing
                  </h3>
                  <p className="text-xs text-slate-400">
                    How you collect money when selling access or licenses to Cash Captain Marketeer.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    Your app is equipped with an integrated <strong>Commercial Sales Kit</strong> under the <strong>💳 Buy License (PayPal)</strong> tab:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-2">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 font-bold">Starter License</div>
                      <div className="text-lg font-black text-white my-1">$47.00</div>
                      <div className="text-[11px] text-emerald-400">1-Time Payment</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/40 text-center">
                      <div className="text-xs text-amber-300 font-bold">Captain Pro</div>
                      <div className="text-lg font-black text-amber-300 my-1">$97.00</div>
                      <div className="text-[11px] text-amber-400 font-semibold">Most Popular</div>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                      <div className="text-xs text-slate-400 font-bold">Lifetime Pass</div>
                      <div className="text-lg font-black text-white my-1">$197.00</div>
                      <div className="text-[11px] text-purple-400 font-semibold">VIP Unlimited</div>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg text-[11px] text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Privacy & Direct Deposit Guarantee:</span>
                    </div>
                    <p>
                      - When buyers click any PayPal button, payments go directly into your verified business PayPal account.
                    </p>
                    <p>
                      - Your email address is protected and encrypted to prevent unsolicited spam.
                    </p>
                    <p>
                      - Customer support and license inquiries are handled via <strong>yeahwegotthat@proton.me</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 10: HOSTING & CLOUD */}
            {activeSection === 'hosting' && (
              <div className="space-y-4">
                <div className="border-b border-[#334155] pb-3">
                  <h3 className="text-base font-black text-orange-400 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Cloud Run &amp; Hosting Architecture
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-availability global hosting and reliable uptime.
                  </p>
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 space-y-3 text-xs">
                  <p>
                    <strong>Current Live Status:</strong>
                  </p>
                  <p>
                    Running live on Cloud Run with permanent worldwide SSL:
                    <br />
                    <a
                      href="https://ais-dev-qys7kmq2tbrzxgktb5qd4i-21093015917.us-east1.run.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-300 underline font-mono break-all inline-flex items-center gap-1 mt-1"
                    >
                      <span>https://ais-dev-qys7kmq2tbrzxgktb5qd4i-21093015917.us-east1.run.app</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </p>
                  <p>
                    <strong>Database Synchronization:</strong>
                  </p>
                  <p className="text-slate-300">
                    All user profiles, offers, clicks, and ad tracking are persisted with secure zero-trust rules.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#334155] bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href="mailto:yeahwegotthat@proton.me?subject=Cash%20Captain%20Marketeer%20Support"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30 cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact Support (yeahwegotthat@proton.me)</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigateTab('autopilot');
              }}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition cursor-pointer shadow-md shadow-emerald-500/20"
            >
              Start Using Auto-Pilot &rarr;
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer border border-slate-700 transition"
            >
              Close Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
