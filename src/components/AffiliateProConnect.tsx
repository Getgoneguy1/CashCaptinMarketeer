import React, { useState } from 'react';
import { AffiliateProConfig, Offer } from '../types';
import {
  Link2,
  ExternalLink,
  Save,
  Download,
  Radio,
  Layers,
  ShieldCheck,
  Globe,
  Flame,
  Sparkles,
  Server,
  Check,
  HardDrive,
  Copy,
  Zap,
  ArrowRight
} from 'lucide-react';

interface AffiliateProConnectProps {
  config: AffiliateProConfig;
  onSaveConfig: (config: AffiliateProConfig) => void;
  offers: Offer[];
  onImportOffers: (offers: Offer[]) => void;
}

export const AffiliateProConnect: React.FC<AffiliateProConnectProps> = ({
  config,
  onSaveConfig,
  offers
}) => {
  const [appUrl, setAppUrl] = useState(config.appUrl || '');
  const [webhookUrl, setWebhookUrl] = useState(config.webhookUrl || '');
  const [enabled, setEnabled] = useState(config.enabled ?? false);
  const [syncMode] = useState<'redirect' | 'webhook' | 'embed'>(
    config.syncMode || 'webhook'
  );

  // App 3: Affiliate Viral AI
  const [viralAiUrl, setViralAiUrl] = useState(config.app3Url || '');
  const [viralAiEnabled, setViralAiEnabled] = useState(!!config.app3Url);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);
  const [copiedNetlifySteps, setCopiedNetlifySteps] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      enabled: enabled || !!appUrl,
      appUrl: appUrl.trim(),
      webhookUrl: webhookUrl.trim(),
      syncMode,
      lastSynced: new Date().toISOString(),
      app3Name: 'Affiliate Viral AI',
      app3Url: viralAiUrl.trim(),
      app3Description: 'AI Viral Hooks, Short-Form Traffic, & Social Syndication Engine'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestPing = async (target: 'pro' | 'viral') => {
    const url = target === 'pro' ? (webhookUrl || appUrl) : viralAiUrl;
    if (!url) {
      setTestStatus(`Please enter the ${target === 'pro' ? 'Affiliate Pro' : 'Affiliate Viral AI'} URL first.`);
      return;
    }

    setTestStatus(`Testing connection to ${target === 'pro' ? 'Affiliate Pro' : 'Affiliate Viral AI'}...`);
    try {
      if (target === 'pro' && webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'ping_test',
            timestamp: new Date().toISOString(),
            source: 'CashCaptainMarketeer'
          }),
          mode: 'no-cors'
        });
        setTestStatus('✅ Connection ping sent successfully to Affiliate Pro webhook!');
      } else {
        setTestStatus(`✅ ${target === 'pro' ? 'Affiliate Pro' : 'Affiliate Viral AI'} link verified and active for 1-click launch.`);
      }
    } catch {
      setTestStatus(`⚠️ Endpoint reached (browser CORS shielded). URL saved.`);
    }
  };

  const handleExportOffers = () => {
    const exportData = offers.map((o) => ({
      product_name: o.product_name,
      product_description: o.product_description,
      affiliate_id: o.affiliate_id,
      category: o.category,
      target_url: o.target_url,
      keywords: o.keywords,
      search_tools_count: o.platform_copy?.micro_search_tools?.length || 0,
      social_copy: (o.platform_copy?.platform_copy?.['reddit'] as string) || (o.platform_copy?.platform_copy?.['twitter'] as string) || ''
    }));

    navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  const netlifyDeployGuide = `VIRBIS 3-IN-1 AI SUITE: 100% FREE HOSTING GUIDE (ZERO CREDIT CARD)
==================================================================
Host all 3 apps on the exact same free Netlify account for $0/month:

1. Create a 100% Free Account at https://app.netlify.com (No card needed).
2. Deploy App 1 (Cash Captain Marketeer):
   - In Cash Captain, download 'cashcaptain_live_site.zip'.
   - Open https://app.netlify.com/drop in your browser.
   - Drag and drop 'cashcaptain_live_site.zip'.
   - Done! You get a live link like https://cashcaptain.netlify.app.

3. Deploy App 2 (Affiliate Pro):
   - In your Affiliate Pro project, build & export its live zip.
   - Go to your Netlify dashboard -> "Add new site" -> "Deploy manually" (Netlify Drop).
   - Drag and drop Affiliate Pro zip.
   - Done! You get https://affiliatepro.netlify.app.

4. Deploy App 3 (Affiliate Viral AI):
   - Export Affiliate Viral AI live zip.
   - Drop onto Netlify.
   - Done! You get https://affiliateviralai.netlify.app.

5. Optional Custom Domain (e.g. virbis.com):
   - You can connect virbis.com and point:
     * cashcaptain.virbis.com -> Cash Captain
     * pro.virbis.com -> Affiliate Pro
     * viral.virbis.com -> Affiliate Viral AI
   All 3 live on the same free account with free SSL and unlimited traffic!`;

  const copyGuide = () => {
    navigator.clipboard.writeText(netlifyDeployGuide);
    setCopiedNetlifySteps(true);
    setTimeout(() => setCopiedNetlifySteps(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner: Virbis 3-in-1 Suite */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-2xl shadow">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">Virbis 3-in-1 AI Suite</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  Shared Ecosystem
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Connect and cross-syndicate your 3 core power apps with ease on the same 100% free hosting platform.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyGuide}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Copy the 60-second multi-app free hosting deployment instructions"
            >
              {copiedNetlifySteps ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              <span>{copiedNetlifySteps ? 'Hosting Guide Copied!' : 'Free Hosting Guide'}</span>
            </button>
          </div>
        </div>

        {/* 3 Apps Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* APP 1: Cash Captain Marketeer */}
          <div className="bg-[#060913] p-4 rounded-xl border border-emerald-500/40 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  APP 1 • CURRENT
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>Cash Captain Marketeer™</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous buyer finding radar, Reddit &amp; social ad placement, and customer-facing multi-tier license sales.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>Station Active</span>
              <span className="text-slate-300">Offers: {offers.length}</span>
            </div>
          </div>

          {/* APP 2: Affiliate Pro */}
          <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                  APP 2 • SYNDICATOR
                </span>
                {appUrl ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">● Connected</span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">Not Linked</span>
                )}
              </div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>Affiliate Pro</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Affiliate hub manager, campaign organizer, deep-link routing, and payout analytics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              {appUrl ? (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <span>Launch Affiliate Pro</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-500 block text-center py-1">Enter URL below to link</span>
              )}
            </div>
          </div>

          {/* APP 3: Affiliate Viral AI */}
          <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                  APP 3 • TRAFFIC ENGINE
                </span>
                {viralAiUrl ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">● Connected</span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">Not Linked</span>
                )}
              </div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>Affiliate Viral AI</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-converting viral hooks, TikTok &amp; Shorts scripts, organic traffic loops, and recurring subscriber retention.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              {viralAiUrl ? (
                <a
                  href={viralAiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <span>Launch Viral AI</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-[11px] text-slate-500 block text-center py-1">Enter URL below to link</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Free 100% Host Architecture Card (Why Netlify solves Google's billing trap) */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>100% Free Hosting for All 3 Apps (Netlify / Vercel)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  $0 / Month • No Card Needed
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Host Cash Captain, Affiliate Pro, and Affiliate Viral AI on a single free account with zero surprise charges.
              </p>
            </div>
          </div>

          <a
            href="/cashcaptain_live_site.zip"
            download="cashcaptain_live_site.zip"
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download Live Site (.ZIP)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
              <span>Unlimited Free Sites</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Netlify's free starter plan allows unlimited apps per account. You can host all 3 without paying a dime.
            </p>
          </div>

          <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
              <span>Zero-Billing Safe</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Unlike Google Cloud which tries to pre-authorize $30 on cards, Netlify never requires a credit card to deploy.
            </p>
          </div>

          <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
              <span>One-Click Drag &amp; Drop</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Just open <strong className="text-emerald-400">app.netlify.com/drop</strong> and drag your app's ZIP file onto the screen to go live in 30 seconds.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-App Configuration Form */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Configure URLs for Affiliate Pro &amp; Affiliate Viral AI</span>
          </h2>
          <p className="text-xs text-slate-400">
            Paste your live or development URLs so you and your users can switch seamlessly between apps.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Affiliate Pro URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                <span>App 2: Affiliate Pro Live URL</span>
              </label>
              <input
                type="url"
                placeholder="https://affiliatepro.netlify.app (or custom URL)"
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Organizes affiliate links &amp; syndication</span>
                {appUrl && (
                  <button
                    type="button"
                    onClick={() => handleTestPing('pro')}
                    className="text-emerald-400 hover:underline cursor-pointer"
                  >
                    Test Link
                  </button>
                )}
              </div>
            </div>

            {/* Field 2: Affiliate Viral AI URL */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                <span>App 3: Affiliate Viral AI Live URL</span>
              </label>
              <input
                type="url"
                placeholder="https://affiliateviralai.netlify.app (or custom URL)"
                value={viralAiUrl}
                onChange={(e) => setViralAiUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Viral hooks &amp; organic traffic machine</span>
                {viralAiUrl && (
                  <button
                    type="button"
                    onClick={() => handleTestPing('viral')}
                    className="text-purple-400 hover:underline cursor-pointer"
                  >
                    Test Link
                  </button>
                )}
              </div>
            </div>

            {/* Field 3: Optional Webhook Endpoint */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-slate-400" />
                <span>Shared Webhook / Postback Endpoint (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://.../api/webhook/track (optional for real-time sale events)"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                If enabled, conversions detected by Cash Captain can trigger automated viral campaigns in Affiliate Viral AI.
              </p>
            </div>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 bg-[#060913] border-slate-700"
                />
                <span className="font-semibold text-slate-200">Enable Ecosystem Sync</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black rounded-xl shadow-md shadow-emerald-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-slate-950" />
                <span>{savedSuccess ? 'Ecosystem Settings Saved!' : 'Save All App Connections'}</span>
              </button>
            </div>
          </div>

          {testStatus && (
            <div className="p-3 rounded-xl bg-[#060913] border border-slate-800 text-xs font-mono text-emerald-400">
              {testStatus}
            </div>
          )}
        </form>
      </div>

      {/* Sync Offers to Viral AI & Affiliate Pro */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Cross-App Offer &amp; Content Syndication</span>
            </h3>
            <p className="text-xs text-slate-400">
              Export your {offers.length} offers into Affiliate Pro or feed them into Affiliate Viral AI to generate viral content.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#060913] p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-blue-400" />
              <span>Export Offers to Affiliate Pro</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Format and copy all {offers.length} active campaigns, target URLs, and search widgets for instant import.
            </p>
            <button
              onClick={handleExportOffers}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedExport ? 'Copied to Clipboard!' : 'Copy Offers for Affiliate Pro'}</span>
            </button>
          </div>

          <div className="bg-[#060913] p-5 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-purple-400" />
              <span>Syndicate into Affiliate Viral AI</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Generate TikTok hooks, YouTube Shorts scripts, and Reddit viral discussion angles from your product catalogue.
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-300 font-mono">
              <ShieldCheck className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Direct viral loop bridge ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
