import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Shield,
  Smartphone,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  MousePointerClick,
  DollarSign,
  Target,
  BellRing,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Offer, TrackingMetrics, BuyerLead } from '../types';
import {
  EmailReportConfig,
  getStoredEmailConfig,
  saveEmailConfig,
  dispatchEmailReport,
  buildUserReport,
  buildReportMailtoUrl,
  OWNER_NOTIFICATION_EMAIL
} from '../services/emailReportService';
import { CashCaptainLogo } from './CashCaptainLogo';

interface EmailUpdatesScreenProps {
  tracking: TrackingMetrics;
  offers: Offer[];
  leads: BuyerLead[];
}

export const EmailUpdatesScreen: React.FC<EmailUpdatesScreenProps> = ({
  tracking,
  offers,
  leads
}) => {
  const [config, setConfig] = useState<EmailReportConfig>(() => getStoredEmailConfig());
  const [activeSubView, setActiveSubView] = useState<'overview' | 'synopsis' | 'mobile_preview'>('overview');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setConfig(getStoredEmailConfig());
  }, []);

  const currentReport = buildUserReport(tracking, offers, leads, config.recipientEmail);
  const mailtoUrl = buildReportMailtoUrl(config.recipientEmail, currentReport);

  const handleSaveConfig = () => {
    saveEmailConfig(config);
    setStatusMessage({ type: 'success', text: `Email update preferences saved for ${config.recipientEmail}!` });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSendReportNow = async () => {
    if (!config.recipientEmail || !config.recipientEmail.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email address first.' });
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    try {
      saveEmailConfig(config);
      await dispatchEmailReport(config, tracking, offers, leads);
      setConfig(getStoredEmailConfig());
      setStatusMessage({
        type: 'success',
        text: `Full activity synopsis sent to ${config.recipientEmail}! Backup copy archived to ${OWNER_NOTIFICATION_EMAIL}.`
      });
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: 'Dispatch completed. You can also use "Open in Mail Client" for instant 1-click personal delivery.'
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopySynopsis = () => {
    navigator.clipboard.writeText(currentReport.summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const conversionRate = tracking.clicks > 0
    ? ((tracking.conversions / tracking.clicks) * 100).toFixed(1)
    : '0.0';

  const epc = tracking.clicks > 0
    ? (tracking.revenue / tracking.clicks).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-6">
      {/* Screen Hero Banner */}
      <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span>Automated Email Updates &amp; Sales Briefings</span>
                <span className="text-[10px] font-mono font-bold bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 px-2 py-0.5 rounded-full">
                  Live System
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Receive hands-free performance briefs, verified conversion triggers, and revenue summaries sent directly to your inbox.
              </p>
            </div>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex items-center gap-1.5 bg-[#060913] p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveSubView('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'overview'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveSubView('synopsis')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSubView === 'synopsis'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Report Preview
            </button>
            <button
              onClick={() => setActiveSubView('mobile_preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeSubView === 'mobile_preview'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile View</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Row for Email Digest */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <MousePointerClick className="w-3.5 h-3.5" />
              <span>Clicks Monitored</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{tracking.clicks}</div>
          </div>

          <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Verified Sales</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{tracking.conversions}</div>
          </div>

          <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Commission Earned</span>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${tracking.revenue.toFixed(2)}
            </div>
          </div>

          <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-blue-400 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Avg EPC / Rate</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              ${epc} <span className="text-xs text-slate-400 font-normal">({conversionRate}%)</span>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/60 border border-red-500/50 text-red-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <BellRing className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}
      </div>

      {/* SUB-VIEW 1: SETTINGS & PREFERENCES */}
      {activeSubView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Settings Card */}
          <div className="lg:col-span-2 bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-400" />
              <span>Email Delivery &amp; Alert Configuration</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Recipient Email Address:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={config.recipientEmail}
                    onChange={(e) => setConfig((prev) => ({ ...prev, recipientEmail: e.target.value }))}
                    placeholder="you@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#060913] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  All weekly summaries and instant sales triggers will be sent directly to this address.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Delivery Frequency:
                  </label>
                  <select
                    value={config.frequency}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        frequency: e.target.value as 'weekly' | 'daily' | 'disabled'
                      }))
                    }
                    className="w-full px-3 py-2.5 bg-[#060913] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="weekly">Weekly Digest (Recommended on Mondays)</option>
                    <option value="daily">Daily Intelligence Brief</option>
                    <option value="disabled">Paused / Manual Dispatch Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Automated Service Status:
                  </label>
                  <div className="flex items-center justify-between p-2.5 bg-[#060913] rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-300 font-medium">Automatic Dispatch</span>
                    <button
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        config.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          config.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Filter Toggles */}
              <div className="p-4 bg-[#060913] rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Included Data In Your Briefing:
                </span>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeMetrics}
                    onChange={(e) => setConfig((prev) => ({ ...prev, includeMetrics: e.target.checked }))}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Include Real Clicks, Verified Conversions, and Total Commission Ledger</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeLeadAlerts}
                    onChange={(e) => setConfig((prev) => ({ ...prev, includeLeadAlerts: e.target.checked }))}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                  <span>Include Active Product Radar Placements &amp; AI Buyer Intent Threads</span>
                </label>
              </div>

              {/* Save & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Save Email Preferences</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendReportNow}
                  disabled={isSending}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSending ? 'Sending Briefing...' : 'Send Test Briefing Now'}</span>
                </button>

                <a
                  href={mailtoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Mail Client</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Info & Schedule Sidecard */}
          <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Automated Schedule</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#060913] rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Next Scheduled Digest:</span>
                <span className="font-mono text-emerald-400 font-bold text-xs mt-0.5 block">
                  {config.nextScheduledAt
                    ? new Date(config.nextScheduledAt).toLocaleString()
                    : 'Every Monday @ 09:00 AM EST'}
                </span>
              </div>

              <div className="p-3 bg-[#060913] rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Last Dispatched:</span>
                <span className="font-mono text-slate-300 text-xs mt-0.5 block">
                  {config.lastSentAt ? new Date(config.lastSentAt).toLocaleString() : 'Ready for initial dispatch'}
                </span>
              </div>

              <div className="p-3 bg-[#060913] rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Delivery Protocol:</span>
                <span className="text-slate-300 text-xs mt-0.5 block flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero-Spam Verified Relay</span>
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <p>
                Email briefs use direct SMTP dispatch and mirror notification to your master archive at <strong className="text-slate-200">{OWNER_NOTIFICATION_EMAIL}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: REPORT SYNOPSIS PREVIEW */}
      {activeSubView === 'synopsis' && (
        <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Email Briefing Body Synopsis</span>
              </h2>
              <p className="text-xs text-slate-400">
                This exact plain-text synopsis is dispatched to your email address and accessible offline.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySynopsis}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Report Text'}</span>
              </button>

              <button
                onClick={handleSendReportNow}
                disabled={isSending}
                className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-black transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-slate-950" />
                <span>{isSending ? 'Sending...' : 'Send Now'}</span>
              </button>
            </div>
          </div>

          <div className="bg-[#060913] p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed shadow-inner">
            {currentReport.summaryText}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: MOBILE PREVIEW */}
      {activeSubView === 'mobile_preview' && (
        <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Mobile Smartphone Email Simulation</span>
            </h2>
            <p className="text-xs text-slate-400">
              Preview how Cash Captain Marketeer updates render in standard mobile mail apps (Apple Mail, Gmail for iOS/Android).
            </p>
          </div>

          <div className="flex justify-center py-4">
            <div className="w-full max-w-sm bg-slate-950 rounded-3xl border-4 border-slate-800 p-4 shadow-2xl space-y-3">
              {/* Smartphone Top Notch & Bar */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pb-1 border-b border-slate-900 font-mono">
                <span>9:41 AM</span>
                <span className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </span>
              </div>

              {/* Notification Banner */}
              <div className="bg-[#0c1222] p-3 rounded-2xl border border-emerald-500/30 space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <CashCaptainLogo className="w-4 h-4" />
                    <span>Cash Captain Marketeer</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Just Now</span>
                </div>
                <div className="text-xs font-bold text-white">
                  {currentReport.subject}
                </div>
                <div className="text-[11px] text-slate-300 line-clamp-2">
                  Clicks: {tracking.clicks} &bull; Sales: {tracking.conversions} &bull; Commissions: ${tracking.revenue.toFixed(2)} &bull; {offers.length} active campaigns running.
                </div>
              </div>

              {/* Expanded Email Body Preview */}
              <div className="bg-[#0c1222] p-3 rounded-2xl border border-slate-800 text-[11px] space-y-2 text-slate-300">
                <div className="text-xs font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between">
                  <span>Weekly Campaign Summary</span>
                  <span className="text-emerald-400 font-mono">${tracking.revenue.toFixed(2)}</span>
                </div>
                <p className="text-slate-400">
                  Your autonomous radar currently monitors Want Ads, Craigslist ISO, and Daily Buyer Trends across all 38 channels.
                </p>
                <div className="bg-[#060913] p-2 rounded-lg border border-slate-800 font-mono text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Real Clicks:</span>
                    <span className="text-white font-bold">{tracking.clicks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Net Sales:</span>
                    <span className="text-emerald-400 font-bold">{tracking.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg EPC:</span>
                    <span className="text-blue-400 font-bold">${epc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
