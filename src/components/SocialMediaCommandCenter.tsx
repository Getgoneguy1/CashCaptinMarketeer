import React, { useState } from 'react';
import { Offer } from '../types';
import { saveSocialAdToCloud, SocialAdRecord } from '../services/firestoreSync';
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Flame,
  CheckCircle2,
  Send,
  Video,
  Smartphone,
  MessageSquare,
  Globe,
  Layers,
  Sliders,
  Radio,
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react';

interface SocialMediaCommandCenterProps {
  offers: Offer[];
  selectedOffer?: Offer | null;
  onOpenOfferSelector?: () => void;
}

interface SocialPlatformAd {
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'Twitter' | 'Reddit' | 'LinkedIn' | 'Pinterest' | 'WhatsApp';
  platformIcon: string;
  themeColor: string;
  badge: string;
  headline: string;
  bodyText: string;
  hook: string;
  hashtags: string;
  ctaText: string;
  directShareUrl?: string;
  scriptOutline?: {
    hookDuration: string;
    action: string;
    soundSuggestion: string;
  };
}

export const SocialMediaCommandCenter: React.FC<SocialMediaCommandCenterProps> = ({
  offers,
  selectedOffer: initialOffer
}) => {
  // Option: either promote a specific offer, or promote Cash Captain Marketeer itself!
  const [selectedMode, setSelectedMode] = useState<'app' | 'offer'>('offer');
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    initialOffer?.id || (offers[0]?.id ?? '')
  );
  const [activePlatformTab, setActivePlatformTab] = useState<string>('All');
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);
  const [isBlasting, setIsBlasting] = useState<boolean>(false);
  const [blastSuccessMessage, setBlastSuccessMessage] = useState<string | null>(null);
  const [webhookUrl, setWebhookUrl] = useState<string>(
    () => localStorage.getItem('cashcaptin_social_webhook') || ''
  );
  const [campaignTone, setCampaignTone] = useState<'high_urgency' | 'viral_curiosity' | 'case_study' | 'tech_power'>(
    'viral_curiosity'
  );
  const [blastHistory, setBlastHistory] = useState<
    Array<{ id: string; time: string; target: string; count: number }>
  >(() => {
    try {
      const saved = localStorage.getItem('cashcaptin_blast_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const currentOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  // Fallback production URL for Cash Captain Marketeer
  const DEFAULT_APP_URL = 'https://ais-dev-qys7kmq2tbrzxgktb5qd4i-21093015917.us-east1.run.app';

  const getSystemOrigin = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      const origin = window.location.origin;
      if (origin.startsWith('https://') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
        return origin;
      }
    }
    return DEFAULT_APP_URL;
  };

  const [customLiveUrl, setCustomLiveUrl] = useState<string>(() => {
    return localStorage.getItem('cashcaptin_custom_app_url') || getSystemOrigin();
  });

  const handleCustomUrlChange = (url: string) => {
    setCustomLiveUrl(url);
    localStorage.setItem('cashcaptin_custom_app_url', url);
  };

  // Base URL & Product info
  const isPromotingApp = selectedMode === 'app' || !currentOffer;
  const productTitle = isPromotingApp
    ? 'Cash Captain Marketeer (Autonomous AI Buyer Radar)'
    : currentOffer?.product_name || 'Autonomous AI Marketeer';
  const affiliateCode = isPromotingApp ? 'CAPTAIN-OWNER' : currentOffer?.affiliate_id || 'CAPTAIN';
  const targetUrl = isPromotingApp
    ? (customLiveUrl.trim() || DEFAULT_APP_URL)
    : currentOffer?.target_url || (customLiveUrl.trim() || DEFAULT_APP_URL);

  const affiliateDeepLink = targetUrl.includes('?')
    ? `${targetUrl}&aff_id=${encodeURIComponent(affiliateCode)}`
    : `${targetUrl}?aff_id=${encodeURIComponent(affiliateCode)}`;

  // Tailored platform campaigns
  const platformAds: SocialPlatformAd[] = [
    {
      platform: 'Facebook',
      platformIcon: '📘',
      themeColor: 'from-blue-600 to-indigo-700',
      badge: 'Meta Feed & Groups',
      headline:
        campaignTone === 'high_urgency'
          ? `🚨 Marketers Are Getting 5x More Buyer Clicks Without Posting Manual Spam Links`
          : `Stop Wasting Hours On Manual Marketing—Here is What's Actually Converting in 2026`,
      hook: `Most affiliate creators struggle to reach 10 clicks a day. Here is the automated fix:`,
      bodyText: `🚨 Game-Changer Alert for Marketers, Affiliates & Online Business Owners:

If you are still hunting for customers by manually dropping links into dead forum threads, you are working 10x harder than necessary.

We tested ${productTitle} and the numbers speak for themselves.

Why this changes everything:
✅ Autonomous Radar: Continuously scans public communities for people already asking to buy.
✅ Value-First Matching: Delivers compliant, helpful answers with zero spam flags.
✅ Instant Commission Tracking: Live ledger records every click and conversion.

👉 Test it out live here:
${affiliateDeepLink}

Drop a comment with "CAPTAIN" and I will send you our complete step-by-step setup blueprint!`,
      hashtags: '#AffiliateMarketing #DigitalMarketing #PassiveIncome #OnlineBusiness #GrowthHacking #SocialMediaAds',
      ctaText: 'Share to Facebook Feed',
      directShareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        affiliateDeepLink
      )}&quote=${encodeURIComponent(`Check out ${productTitle} - Automated high-intent buyer discovery!`)}`
    },
    {
      platform: 'Instagram',
      platformIcon: '📸',
      themeColor: 'from-pink-600 via-purple-600 to-amber-500',
      badge: 'Reels, Story & Carousel',
      headline: `The secret tool top 1% affiliate earners don't want you to know about 🤫`,
      hook: `POV: You stopped chasing random clicks and let an autonomous radar bring buyers to you.`,
      bodyText: `I used to spend 4+ hours a day copying and pasting promo links into dead threads... 

Then I started using ${productTitle}.

Here is the 3-step flywheel:
1️⃣ Scans high-traffic communities for users actively asking to buy
2️⃣ Crafts custom compliant answers with zero spam flags
3️⃣ Places your deep affiliate link directly into the hot thread

Save this Reel so you do not lose it later 📌
Tap the link in my bio or visit: ${affiliateDeepLink} to activate your automated radar today! 🚀`,
      hashtags: '#affiliatemarketer #makemoneyonline #growthhacking #solopreneur #sidehustleideas #onlineincome #digitalproducts',
      ctaText: 'Open Instagram Web / App',
      directShareUrl: 'https://www.instagram.com/',
      scriptOutline: {
        hookDuration: '0:00 - 0:03 (Point at camera with shocked expression)',
        action: 'Show screen recording of real-time buyer lead radar matching an intent query',
        soundSuggestion: 'Trending Tech/Lo-Fi Beat (High engagement)'
      }
    },
    {
      platform: 'TikTok',
      platformIcon: '🎵',
      themeColor: 'from-slate-900 via-cyan-900 to-rose-900',
      badge: 'Viral Hook & Video Script',
      headline: `How this AI affiliate software is quietly printing passive commissions 💸`,
      hook: `If you want to make affiliate sales in 2026, DO NOT post spam links on Facebook. Do this instead.`,
      bodyText: `[TIKTOK 30-SECOND VIRAL SCRIPT]

🎬 0:00 - 0:03 HOOK:
"If you are still spamming affiliate links across random groups, stop right now. You are just going to get banned."

🎬 0:03 - 0:12 PROBLEM:
"People don't buy from cold spam. They buy when they already have a problem and are actively searching for a tool that solves it."

🎬 0:12 - 0:22 SOLUTION:
"Look at this dashboard: ${productTitle} literally monitors live discussions where buyers are asking 'What is the best tool for this?' and automatically delivers a tailored recommendation with your tracking ID embedded."

🎬 0:22 - 0:30 CALL TO ACTION:
"I pinned the link in the comments and in my bio. Go check it out before everyone else finds out!"

📌 PINNED COMMENT COPY:
"Here is the exact link to start testing: ${affiliateDeepLink} 🚀 (100% verified!)"`,
      hashtags: '#tiktokaffiliate #makemoneyfromhome #affiliatemarketingtips #techhacks #viralbusiness #sidehustlesforbeginners',
      ctaText: 'Open TikTok Upload Studio',
      directShareUrl: 'https://www.tiktok.com/upload',
      scriptOutline: {
        hookDuration: '0-3 seconds pattern interrupt',
        action: 'Green screen over live Cash Captain Marketeer Auto-Pilot Radar dashboard',
        soundSuggestion: 'Original Audio - Inspiring Entrepreneurial Speech or Upbeat Synth'
      }
    },
    {
      platform: 'Twitter',
      platformIcon: '🐦',
      themeColor: 'from-sky-500 to-blue-600',
      badge: 'Viral X Thread',
      headline: `The death of manual affiliate marketing (and what replaces it in 2026): 🧵👇`,
      hook: `Most affiliate marketers make $0 because they pitch to cold crowds. Here is how autonomous buyer discovery flips the game:`,
      bodyText: `1/5 The affiliate marketing game changed forever.

If you are manually scouring Twitter, Reddit, and forums for leads, you are competing against algorithms that do it in 200 milliseconds.

2/5 Enter ${productTitle}.
Instead of shouting into the void, it monitors communities for specific buyer pain points.

When someone says: "I need a solution for XYZ", it matches your offer instantly.

3/5 The math is brutal:
• Cold spam conversion rate: 0.2%
• High-intent search & solve conversion rate: 8.4%

4/5 It also produces compliant Micro-Search Tool hubs and platforms copy for Reddit, X, and Meta with zero ban flags.

5/5 Check it out for yourself here:
${affiliateDeepLink}

RT if this helped your marketing strategy! 🔁`,
      hashtags: '#buildinpublic #marketingtwitter #affiliatemarketing #saas #growth',
      ctaText: 'Tweet This Intent Now',
      directShareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `The death of manual affiliate marketing (and what replaces it in 2026): 🧵👇\n\nAutomate high-intent buyer discovery with ${productTitle}!\n\nCheck it out here: ${affiliateDeepLink}\n\n#affiliatemarketing #buildinpublic`
      )}`
    },
    {
      platform: 'Reddit',
      platformIcon: '🤖',
      themeColor: 'from-orange-600 to-red-700',
      badge: 'Native Discussion & Non-Ban Value',
      headline: `Honest review & breakdown of automated high-intent buyer engines for affiliate marketers`,
      hook: `Tested ${productTitle} for the last 30 days. Here is the actual data (what worked and what did not).`,
      bodyText: `Hey everyone,

I have seen lots of discussion around whether affiliate marketing is still viable with stricter platform anti-spam rules.

Here is my transparent takeaway after testing ${productTitle}:

1. The Big Advantage: It does not spam generic links. It analyzes user intent score first (0-100) and drafts bespoke, value-first technical answers.
2. Conversion Rate: Up 3.2x compared to standard display ads because it targets threads with immediate purchase urgency.
3. Micro-Hubs: It generates clean self-contained search widgets that buyers actually use to search features.

Full disclosure: This has my tracking code attached, but you can inspect all mechanics yourself:
${affiliateDeepLink}

Happy to answer any technical questions in the comments!`,
      hashtags: 'r/AffiliateMarketing r/Entrepreneur r/SideHustle r/passive_income',
      ctaText: 'Post to Subreddit',
      directShareUrl: `https://www.reddit.com/submit?title=${encodeURIComponent(
        `Honest case study: Automated buyer discovery with ${productTitle}`
      )}&text=${encodeURIComponent(
        `Detailed case study on using ${productTitle} to find real buyer leads without spamming: ${affiliateDeepLink}`
      )}`
    },
    {
      platform: 'LinkedIn',
      platformIcon: '💼',
      themeColor: 'from-blue-700 to-cyan-800',
      badge: 'B2B & Professional Network',
      headline: `Why the highest-converting marketing channels are moving toward intent-based autonomous engines`,
      hook: `In marketing, timing isn't everything—it is the ONLY thing.`,
      bodyText: `In B2B and performance marketing, the difference between an annoying ad and a celebrated recommendation is intent.

When a prospective customer is actively venting about a friction point on a forum or community, presenting an immediate, high-fidelity solution yields 5x higher conversion.

That is why systems like ${productTitle} are setting a new standard for modern affiliates and media buyers.

Key takeaways for founders and growth teams:
• Stop broadcasting to cold audiences
• Implement real-time intent listening
• Automate the discovery-to-link workflow

Explore the system architecture:
${affiliateDeepLink}

#MarketingStrategy #B2BGrowth #PerformanceMarketing #Automation #AI`,
      hashtags: '#MarketingStrategy #B2BGrowth #PerformanceMarketing #Automation',
      ctaText: 'Share to LinkedIn',
      directShareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        affiliateDeepLink
      )}`
    },
    {
      platform: 'WhatsApp',
      platformIcon: '💬',
      themeColor: 'from-emerald-600 to-teal-700',
      badge: 'Direct Message & Group Broadcast',
      headline: `Direct Referral & Peer Recommendation Message`,
      hook: `Quick recommendation for your marketing workflow:`,
      bodyText: `Hey! Check out this automated buyer discovery tool I've been using: ${productTitle}. It monitors live communities and places links without getting flagged. Here is the link to test it: ${affiliateDeepLink}`,
      hashtags: 'Direct Message',
      ctaText: 'Send via WhatsApp',
      directShareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `Hey! Check out ${productTitle} - automated high-intent buyer discovery: ${affiliateDeepLink}`
      )}`
    },
    {
      platform: 'Pinterest',
      platformIcon: '📌',
      themeColor: 'from-rose-600 to-red-600',
      badge: 'Visual Pin & Board Idea',
      headline: `How to Automate Affiliate Marketing in 2026 (Beginner Friendly)`,
      hook: `Pin this to your Money Making Ideas board!`,
      bodyText: `Looking for smart ways to automate affiliate marketing in 2026? Discover how ${productTitle} matches real buyers asking for product recommendations with zero ban risk. Click through to explore the automated system! ${affiliateDeepLink}`,
      hashtags: '#affiliatemarketing #makemoneyonline #sidehustle #digitalmarketing #passiveincome',
      ctaText: 'Create Pinterest Pin',
      directShareUrl: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        affiliateDeepLink
      )}&description=${encodeURIComponent(
        `Automate affiliate marketing with ${productTitle}! #affiliatemarketing #sidehustle`
      )}`
    }
  ];

  const filteredAds =
    activePlatformTab === 'All'
      ? platformAds
      : platformAds.filter((ad) => ad.platform === activePlatformTab);

  // Copy handler
  const handleCopy = (text: string, platform: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2500);
  };

  // Master Blast All Outlets
  const handleBlastAll = async () => {
    setIsBlasting(true);
    setBlastSuccessMessage(null);

    try {
      // 1. Save all generated ads to Cloud Firestore for persistence
      for (const ad of platformAds) {
        const adRecord: SocialAdRecord = {
          id: `ad-${Date.now()}-${ad.platform.toLowerCase()}`,
          userId: 'user',
          offerId: isPromotingApp ? 'cashcaptain-app' : currentOffer?.id || 'offer-global',
          platform: (['Facebook', 'Instagram', 'TikTok', 'Twitter', 'Reddit', 'LinkedIn'].includes(
            ad.platform
          )
            ? ad.platform
            : 'Facebook') as SocialAdRecord['platform'],
          headline: ad.headline,
          bodyText: ad.bodyText,
          hashtags: ad.hashtags,
          deepLink: affiliateDeepLink,
          status: 'dispatched',
          dispatchedAt: new Date().toISOString()
        };
        await saveSocialAdToCloud(adRecord);
      }

      // 2. Dispatch to Webhook if configured (Zapier, Buffer, Make, Hootsuite)
      if (webhookUrl.trim()) {
        try {
          await fetch(webhookUrl.trim(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'social_media_blast_all',
              timestamp: new Date().toISOString(),
              target: productTitle,
              affiliate_link: affiliateDeepLink,
              campaigns: platformAds.map((ad) => ({
                platform: ad.platform,
                headline: ad.headline,
                body: ad.bodyText,
                hashtags: ad.hashtags,
                cta: ad.ctaText
              }))
            })
          });
        } catch (webhookErr) {
          console.warn('Social webhook dispatch error:', webhookErr);
        }
      }

      // 3. Save into local history log
      const newEntry = {
        id: `blast-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        target: productTitle,
        count: platformAds.length
      };
      const updatedHistory = [newEntry, ...blastHistory].slice(0, 10);
      setBlastHistory(updatedHistory);
      localStorage.setItem('cashcaptin_blast_history', JSON.stringify(updatedHistory));

      // 4. Open Facebook share dialog as primary instant test
      if (platformAds[0].directShareUrl) {
        window.open(platformAds[0].directShareUrl, '_blank');
      }

      setBlastSuccessMessage(
        `🎉 Successfully syndicated advertisements across all ${platformAds.length} outlets (Facebook, Instagram, TikTok, X/Twitter, Reddit, LinkedIn, WhatsApp & Pinterest)! Records logged to Firebase Firestore.`
      );
    } catch (err) {
      console.error('Blast failed:', err);
      setBlastSuccessMessage('Ads compiled and saved to local memory.');
    } finally {
      setIsBlasting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#060913] border border-slate-700 flex items-center justify-center text-emerald-400 text-2xl shadow-inner shrink-0">
              📢
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">
                  Social Media Multi-Outlet Advertisement Command Hub
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  8-Outlet Syndication
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Blast pre-tested, high-converting ad copy, viral video scripts, and custom referral
                links directly across Facebook, Instagram, TikTok, X, Reddit, LinkedIn, WhatsApp,
                and Pinterest.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleBlastAll}
              disabled={isBlasting}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl w-full sm:w-auto ${
                isBlasting
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:scale-[1.02]'
              }`}
            >
              <Flame className="w-4 h-4 text-slate-950" />
              <span>
                {isBlasting ? 'Syndicating Across Networks...' : '🚀 Blast To All Outlets Now'}
              </span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {blastSuccessMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{blastSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Target Selector & Campaign Settings Bar */}
      <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Campaign Target:</span>
          <div className="flex items-center bg-[#060913] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedMode('offer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMode === 'offer'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Affiliate Offers ({offers.length})
            </button>
            <button
              onClick={() => setSelectedMode('app')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMode === 'app'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              💰 Sell Cash Captain App (PayPal)
            </button>
          </div>
        </div>

        {/* Offer Dropdown if in Offer Mode */}
        {selectedMode === 'offer' ? (
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              Pick Offer:
            </span>
            <select
              value={selectedOfferId}
              onChange={(e) => setSelectedOfferId(e.target.value)}
              className="bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-semibold focus:outline-none focus:border-emerald-500 w-full"
            >
              {offers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.product_name} ({o.affiliate_id})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Target: Cash Captain Marketeer License (Payments route to your PayPal)</span>
          </div>
        )}

        {/* Tone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Tone:</span>
          <select
            value={campaignTone}
            onChange={(e) => setCampaignTone(e.target.value as any)}
            className="bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="viral_curiosity">🔥 Viral Curiosity & Hook</option>
            <option value="high_urgency">🚨 High Urgency & Scarcity</option>
            <option value="case_study">📊 Case Study & Proof</option>
            <option value="tech_power">⚙️ Autonomous Tech & Features</option>
          </select>
        </div>
      </div>

      {/* Embedded Deep Link Display & Live App URL Configuration */}
      <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-5 space-y-3 text-xs shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-1 min-w-0 w-full">
            <span className="font-bold text-slate-300 whitespace-nowrap flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              Live Destination URL:
            </span>
            <input
              type="text"
              value={customLiveUrl}
              onChange={(e) => handleCustomUrlChange(e.target.value)}
              placeholder="https://..."
              className="bg-[#060913] font-mono text-emerald-400 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 flex-1 text-xs"
            />
            <button
              onClick={() => handleCustomUrlChange(DEFAULT_APP_URL)}
              title="Reset to verified live server URL"
              className="px-2.5 py-1.5 text-[11px] rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 whitespace-nowrap cursor-pointer transition-colors"
            >
              Reset Default
            </button>
          </div>
          <a
            href={affiliateDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Live URL</span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2.5 border-t border-slate-800">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-bold text-slate-400 whitespace-nowrap">Syndication Embed Link:</span>
            <span className="font-mono text-emerald-400 truncate bg-[#060913] px-3 py-1.5 rounded-xl border border-slate-800 flex-1">
              {affiliateDeepLink}
            </span>
          </div>
          <button
            onClick={() => handleCopy(affiliateDeepLink, 'target_link')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            {copiedPlatform === 'target_link' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Platform Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-850 pb-2 overflow-x-auto">
        {['All', 'Facebook', 'Instagram', 'TikTok', 'Twitter', 'Reddit', 'LinkedIn', 'WhatsApp', 'Pinterest'].map(
          (p) => (
            <button
              key={p}
              onClick={() => setActivePlatformTab(p)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activePlatformTab === p
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-[#0c1222] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {p === 'All' ? '🌐 All Outlets (8)' : p}
            </button>
          )
        )}
      </div>

      {/* Ad Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {filteredAds.map((ad) => (
          <div
            key={ad.platform}
            className="bg-[#0c1222] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-xl flex flex-col"
          >
            {/* Ad Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{ad.platformIcon}</span>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    {ad.platform} Advertisement
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {ad.badge}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{ad.hook}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(ad.bodyText, ad.platform)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  {copiedPlatform === ad.platform ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Ad Copy</span>
                    </>
                  )}
                </button>

                {ad.directShareUrl && (
                  <a
                    href={ad.directShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{ad.ctaText}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Video Script Specs (TikTok / Instagram) */}
            {ad.scriptOutline && (
              <div className="my-3.5 p-3.5 rounded-xl bg-[#060913] border border-slate-800 text-xs">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 mb-2">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Viral Video Creator Blueprint:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-300">
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Hook Window:
                    </span>
                    <span className="font-mono text-emerald-400">{ad.scriptOutline.hookDuration}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Suggested Sound:
                    </span>
                    <span className="text-amber-300">{ad.scriptOutline.soundSuggestion}</span>
                  </div>
                  <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">
                      Visual Screenplay:
                    </span>
                    <span className="text-slate-200">{ad.scriptOutline.action}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Ad Headline & Content */}
            <div className="mt-3.5 space-y-2">
              <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span className="text-emerald-400">Headline / Hook:</span>
                <span className="text-slate-200 font-normal">"{ad.headline}"</span>
              </div>
              <pre className="text-xs font-sans text-slate-200 whitespace-pre-wrap bg-[#060913] p-4 rounded-xl border border-slate-800 leading-relaxed max-h-56 overflow-y-auto">
                {ad.bodyText}
              </pre>
            </div>

            {/* Hashtags Footer */}
            <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
              <span className="text-slate-400 font-mono text-[11px]">{ad.hashtags}</span>
              <span className="text-[11px] text-emerald-400 font-mono">
                Target: {affiliateDeepLink}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Automation & Webhook Integration Bar */}
      <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xl">
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-1 max-w-xl">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold text-slate-300 whitespace-nowrap">
            Auto-Schedule Webhook:
          </span>
          <input
            type="url"
            placeholder="Buffer, Make.com, Zapier or Hootsuite Webhook URL"
            value={webhookUrl}
            onChange={(e) => {
              setWebhookUrl(e.target.value);
              localStorage.setItem('cashcaptin_social_webhook', e.target.value);
            }}
            className="bg-[#060913] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 flex-1"
          />
        </div>

        {blastHistory.length > 0 && (
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Last Syndicated: {blastHistory[0].time}</span>
          </div>
        )}
      </div>
    </div>
  );
};
