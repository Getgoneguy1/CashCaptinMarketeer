import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Copy,
  Check,
  Share2,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Mail,
  ArrowRight
} from 'lucide-react';
import { getLiveAppOrigin } from '../services/masterAuthService';
import { CashCaptainLogo } from './CashCaptainLogo';

interface AffiliateProfile {
  partnerId: string;
  name: string;
  email: string;
  paypalEmail: string;
  joinedAt: string;
  clicks: number;
  referrals: number;
  totalEarnings: number;
}

const AFFILIATE_PROFILE_KEY = 'cashcaptain_customer_affiliate';

export const CustomerAffiliateProgram: React.FC = () => {
  const [profile, setProfile] = useState<AffiliateProfile | null>(() => {
    try {
      const raw = localStorage.getItem(AFFILIATE_PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSwipeId, setCopiedSwipeId] = useState<string | null>(null);

  const liveOrigin = getLiveAppOrigin();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !paypalEmail.trim()) return;

    const cleanNameTag = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const partnerId = `aff_${cleanNameTag}_${randomNum}`;

    const newProfile: AffiliateProfile = {
      partnerId,
      name: name.trim(),
      email: email.trim(),
      paypalEmail: paypalEmail.trim(),
      joinedAt: new Date().toISOString(),
      clicks: 0,
      referrals: 0,
      totalEarnings: 0
    };

    localStorage.setItem(AFFILIATE_PROFILE_KEY, JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  const partnerLink = profile ? `${liveOrigin}/?ref=${profile.partnerId}` : '';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    if (id === 'partnerLink') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedSwipeId(id);
      setTimeout(() => setCopiedSwipeId(null), 2000);
    }
  };

  // If visitor is NOT yet registered as an affiliate, show the clean registration gate
  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        {/* Banner */}
        <div className="bg-[#0c1222] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <DollarSign className="w-10 h-10 text-emerald-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cash Captain Marketeer™ Partner Program
          </h1>
          <p className="text-sm sm:text-base text-[#39ff14] font-bold">
            Earn 40% Recurring &amp; Lifetime Commissions On Every License You Refer!
          </p>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Want to promote Cash Captain to your network? Register below to receive your personal tracking link, ready-to-post swipe copy, and direct PayPal commission payouts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 max-w-xl mx-auto text-left">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Starter ($47)</span>
              <span className="text-lg font-black text-emerald-400 font-mono">$18.80 / sale</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-emerald-500/30 shadow-md">
              <span className="text-xs text-slate-400 block font-medium">Captain Pro ($97)</span>
              <span className="text-lg font-black text-emerald-400 font-mono">$38.80 / sale</span>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block font-medium">Lifetime ($197)</span>
              <span className="text-lg font-black text-emerald-400 font-mono">$78.80 / sale</span>
            </div>
          </div>
        </div>

        {/* Enrollment Form */}
        <form onSubmit={handleRegister} className="bg-[#0c1222] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <span>Join the Official Affiliate Program</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Full Name or Business Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Miller"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Account Email Address:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. alex@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your PayPal Address (Where commissions get paid):
              </label>
              <input
                type="email"
                required
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="e.g. alex.payments@gmail.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Commissions are sent automatically to this PayPal account via Y.W.G.T Online! LLC.
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <span>Generate My Personal Affiliate Links &amp; Swipes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Active Affiliate Dashboard with personal links only
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Partner Header */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                Active Affiliate Partner
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {profile.partnerId}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
              Welcome, {profile.name}!
            </h1>
            <p className="text-xs text-slate-400">
              Payouts to: <span className="text-emerald-400 font-mono">{profile.paypalEmail}</span> (40% Commission Tier)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Earnings</span>
              <span className="text-xl font-black text-[#39ff14] font-mono">
                ${profile.totalEarnings.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Personalized Link Box */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Your Personal Cash Captain Referral Link:</span>
            <span className="text-[11px] text-emerald-400 font-medium">Embeds your partner ID</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={partnerLink}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-300 font-mono select-all focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(partnerLink, 'partnerLink')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Share this link in your emails, videos, blog posts, and ads. Any license purchased earns you 40% direct cash.
          </p>
        </div>
      </div>

      {/* Swipe Materials (Using User's Own Link) */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Ready-to-Post Marketing Materials (Pre-loaded with Your Link)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Copy and paste these proven promotional messages across social media, forums, and email lists.
          </p>
        </div>

        {/* Swipe 1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">
              Template 1: Value-First Community Post (Reddit / Groups / Forums)
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  `I used to spend 4 hours a day searching Reddit and forums for people asking for software recommendations. Then I started testing Cash Captain Marketeer—it scrapes live buyer intent and automatically drafts contextual answers without getting banned.\n\nCheck out the demo here: ${partnerLink}`,
                  'swipe1'
                )
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedSwipeId === 'swipe1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSwipeId === 'swipe1' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 font-mono whitespace-pre-line bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            {`I used to spend 4 hours a day searching Reddit and forums for people asking for software recommendations. Then I started testing Cash Captain Marketeer—it scrapes live buyer intent and automatically drafts contextual answers without getting banned.\n\nCheck out the demo here: ${partnerLink}`}
          </p>
        </div>

        {/* Swipe 2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">
              Template 2: Twitter / X &amp; LinkedIn Quick Shot
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  `Stop pasting affiliate links manually. Autonomous AI Buyer Radar scans daily Google trends, Reddit want-ads, and review boards to put your offers in front of warm buyers 24/7.\n\nGrab your station license: ${partnerLink}`,
                  'swipe2'
                )
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedSwipeId === 'swipe2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSwipeId === 'swipe2' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 font-mono whitespace-pre-line bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            {`Stop pasting affiliate links manually. Autonomous AI Buyer Radar scans daily Google trends, Reddit want-ads, and review boards to put your offers in front of warm buyers 24/7.\n\nGrab your station license: ${partnerLink}`}
          </p>
        </div>

        {/* Swipe 3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400">
              Template 3: Email Broadcast / Newsletter Shoutout
            </span>
            <button
              onClick={() =>
                copyToClipboard(
                  `Subject: How to find buyers who are already asking for your products\n\nHey,\n\nIf you sell affiliate products or digital services, the hardest part is getting high-intent buyers.\n\nCash Captain Marketeer just released their Autonomous Buyer Radar that finds active discussions where people are literally asking "What tool should I use?" and places contextual recommendations.\n\nCheck the live tool out here:\n${partnerLink}\n\nTalk soon,\n${profile.name}`,
                  'swipe3'
                )
              }
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedSwipeId === 'swipe3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSwipeId === 'swipe3' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 font-mono whitespace-pre-line bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            {`Subject: How to find buyers who are already asking for your products\n\nHey,\n\nIf you sell affiliate products or digital services, the hardest part is getting high-intent buyers.\n\nCash Captain Marketeer just released their Autonomous Buyer Radar that finds active discussions where people are literally asking "What tool should I use?" and places contextual recommendations.\n\nCheck the live tool out here:\n${partnerLink}\n\nTalk soon,\n${profile.name}`}
          </p>
        </div>
      </div>
    </div>
  );
};
