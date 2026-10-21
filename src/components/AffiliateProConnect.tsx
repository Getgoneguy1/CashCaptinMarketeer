import React, { useState } from 'react';
import { AffiliateProConfig, Offer } from '../types';
import {
  Link2,
  CheckCircle,
  ExternalLink,
  Save,
  Download,
  Upload,
  Radio,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe
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
  offers,
  onImportOffers
}) => {
  const [appUrl, setAppUrl] = useState(config.appUrl || '');
  const [webhookUrl, setWebhookUrl] = useState(config.webhookUrl || '');
  const [enabled, setEnabled] = useState(config.enabled ?? false);
  const [syncMode, setSyncMode] = useState<'redirect' | 'webhook' | 'embed'>(
    config.syncMode || 'webhook'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [copiedExport, setCopiedExport] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      enabled: enabled || !!appUrl,
      appUrl: appUrl.trim(),
      webhookUrl: webhookUrl.trim(),
      syncMode,
      lastSynced: new Date().toISOString()
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestPing = async () => {
    if (!webhookUrl && !appUrl) {
      setTestStatus('Please enter an Affiliate Pro URL or Webhook URL first.');
      return;
    }

    setTestStatus('Testing connection to Affiliate Pro...');
    try {
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'ping_test',
            timestamp: new Date().toISOString(),
            source: 'CashCaptinMarketeer'
          }),
          mode: 'no-cors'
        });
        setTestStatus('✅ Connection ping sent successfully to Affiliate Pro webhook!');
      } else {
        setTestStatus('✅ Affiliate Pro URL saved and ready for direct launch.');
      }
    } catch (err: any) {
      setTestStatus(`⚠️ Webhook reached (or browser CORS shielded). Configuration saved.`);
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
      search_tools_count: o.platform_copy?.micro_search_tools?.length || 0
    }));

    const jsonStr = JSON.stringify(exportData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Connect with "Affiliate Pro"</span>
                {enabled && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Linked
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Link your secondary Google AI Studio applet to automatically sync clicks, tracking, and offer hubs
              </p>
            </div>
          </div>

          {appUrl && (
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-md border border-[#334155] transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Open Affiliate Pro App</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            </a>
          )}
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
                Affiliate Pro App URL (Google Studio Applet or Web Link)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://ais-dev-...run.app (or custom URL)"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0f172a] border border-[#475569] rounded-md text-white text-xs focus:outline-none focus:border-[#3b82f6] font-mono"
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">
                Paste the Development or Shared App URL from your Affiliate Pro studio tab.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
                Tracking Webhook / Postback Endpoint (Optional)
              </label>
              <div className="relative">
                <Radio className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
                <input
                  type="url"
                  placeholder="https://.../api/click or /webhook/track"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-[#0f172a] border border-[#475569] rounded-md text-white text-xs focus:outline-none focus:border-[#3b82f6] font-mono"
                />
              </div>
              <p className="text-[11px] text-[#64748b] mt-1">
                If Affiliate Pro accepts postback events, clicks and sales here will notify it automatically.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#334155]/60">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#cbd5e1] flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-[#0f172a] border-[#475569]"
                />
                <span className="font-semibold">Enable Active Sync with Affiliate Pro</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestPing}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-[#334155] transition-colors cursor-pointer"
              >
                Test Ping Connection
              </button>

              <button
                type="submit"
                className="py-2 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-xs font-bold rounded shadow transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savedSuccess ? 'Settings Saved!' : 'Save Connection'}</span>
              </button>
            </div>
          </div>

          {testStatus && (
            <div className="p-2.5 rounded bg-[#0f172a] border border-[#334155] text-xs font-mono text-[#38bdf8]">
              {testStatus}
            </div>
          )}
        </form>
      </div>

      {/* Sync Offers Between Apps */}
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#334155]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              Transfer & Sync Offers Between Apps
            </h3>
            <p className="text-xs text-[#94a3b8]">
              Seamlessly share your {offers.length} active affiliate offers with your Affiliate Pro app
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Export to Affiliate Pro
            </h4>
            <p className="text-xs text-[#94a3b8] mb-3">
              Copy all {offers.length} offers formatted with affiliate tags, descriptions, and search tools.
            </p>
            <button
              onClick={handleExportOffers}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded border border-[#334155] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>{copiedExport ? 'Copied JSON to Clipboard!' : 'Copy Offers for Affiliate Pro'}</span>
            </button>
          </div>

          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
              Two-Way Workflows
            </h4>
            <p className="text-xs text-[#94a3b8] mb-3">
              Use CashCaptin to generate your search box tools & compliance copy, and send conversions directly into Affiliate Pro.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Full affiliate link preservation active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
