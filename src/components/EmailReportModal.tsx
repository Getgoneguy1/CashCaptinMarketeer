import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  Shield,
  Smartphone,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  X,
  FileText
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

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: TrackingMetrics;
  offers: Offer[];
  leads: BuyerLead[];
}

export const EmailReportModal: React.FC<EmailReportModalProps> = ({
  isOpen,
  onClose,
  tracking,
  offers,
  leads
}) => {
  const [config, setConfig] = useState<EmailReportConfig>(getStoredEmailConfig());
  const [activeSubTab, setActiveSubTab] = useState<'report' | 'mobile_view'>('report');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPreviewText, setShowPreviewText] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredEmailConfig());
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentReport = buildUserReport(tracking, offers, leads, config.recipientEmail);
  const mailtoUrl = buildReportMailtoUrl(config.recipientEmail, currentReport);

  const handleSaveConfig = () => {
    saveEmailConfig(config);
    setStatusMessage({ type: 'success', text: `Email preferences saved for ${config.recipientEmail}!` });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSendReportNow = async () => {
    if (!config.recipientEmail || !config.recipientEmail.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address first.' });
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    try {
      saveEmailConfig(config);
      const res = await dispatchEmailReport(config, tracking, offers, leads);
      setConfig(getStoredEmailConfig());
      setStatusMessage({
        type: 'success',
        text: `Full activity synopsis sent to ${config.recipientEmail}! Backup copy archived to ${OWNER_NOTIFICATION_EMAIL}.`
      });
    } catch (e: any) {
      setStatusMessage({
        type: 'error',
        text: 'Dispatch initiated. You can also click "Open in Gmail / Outlook" below for direct 1-click delivery.'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[#334155]">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center text-xl font-black shadow-md shadow-amber-500/20">
            📬
          </div>
          <div>
            <h2 className="text-xl font-black text-white">
              Email Activity Report & Backup
            </h2>
            <p className="text-xs text-[#94a3b8]">
              Send a complete synopsis of your affiliate links, active ads, and tracking stats directly to your inbox.
            </p>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 pb-2 border-b border-[#334155]/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveSubTab('report')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'report'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-[#0f172a] text-slate-300 hover:text-white border border-[#334155]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send Activity Synopsis</span>
          </button>

          <button
            onClick={() => setActiveSubTab('mobile_view')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'mobile_view'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-[#0f172a] text-slate-300 hover:text-white border border-[#334155]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>📱 Mobile Radar View</span>
          </button>
        </div>

        {/* TAB 1: DEAD-SIMPLE EMAIL DISPATCH */}
        {activeSubTab === 'report' && (
          <div className="space-y-4">
            {/* Simple Email Input Card */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700/80 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5 uppercase tracking-wider">
                  Where should we email your complete synopsis? *
                </label>
                <input
                  type="email"
                  required
                  value={config.recipientEmail}
                  onChange={(e) => setConfig({ ...config, recipientEmail: e.target.value })}
                  placeholder="Enter your email (Gmail, Outlook, Yahoo, iCloud, etc.)"
                  className="w-full bg-[#1e293b] border border-[#475569] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 shadow-inner placeholder:text-[#64748b] font-semibold"
                />
                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  Works with any email provider. Includes all your affiliate offers, active link placements, and live click analytics. A backup is automatically archived to admin ({OWNER_NOTIFICATION_EMAIL}).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Scheduled Automatic Delivery
                  </label>
                  <select
                    value={config.frequency}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        frequency: e.target.value as 'weekly' | 'daily' | 'disabled'
                      })
                    }
                    className="w-full bg-[#1e293b] border border-[#475569] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="weekly">Weekly (Every 7 Days — Recommended)</option>
                    <option value="daily">Daily Morning Briefing</option>
                    <option value="disabled">On-Demand Only (When you click send)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleSaveConfig}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition cursor-pointer"
                  >
                    Save Email Preferences
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Being Sent */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center">
              <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Clicks</span>
                <div className="text-sm font-black text-sky-400">{tracking.clicks || 0}</div>
              </div>
              <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Conversions</span>
                <div className="text-sm font-black text-emerald-400">{tracking.conversions || 0}</div>
              </div>
              <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Revenue</span>
                <div className="text-sm font-black text-amber-400">${(tracking.revenue || 0).toFixed(2)}</div>
              </div>
              <div className="bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Affiliate Offers</span>
                <div className="text-sm font-black text-purple-400">{offers.length}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleSendReportNow}
                disabled={isSending}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-sm text-slate-950 transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  isSending
                    ? 'bg-amber-600/70 text-slate-900 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-105 active:scale-[0.99] shadow-amber-500/20'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSending ? 'Dispatching Complete Activity Report...' : 'Send Complete Synopsis & Backup Report'}
                </span>
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a
                  href={mailtoUrl}
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  title="Open formatted synopsis in your preferred mail client"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>Open in Preferred Mail App</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopySynopsis}
                  className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copied ? 'Copied Synopsis!' : 'Copy Full Synopsis Text'}</span>
                </button>
              </div>
            </div>

            {/* Collapsible Synopsis Preview */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowPreviewText((prev) => !prev)}
                className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{showPreviewText ? 'Hide Synopsis Content' : 'Inspect Full Report Content'}</span>
              </button>

              {showPreviewText && (
                <div className="mt-2 bg-[#0f172a] p-3 rounded-lg border border-slate-700 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {currentReport.summaryText}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MOBILE RADAR VIEW */}
        {activeSubTab === 'mobile_view' && (
          <div className="space-y-4 mt-2 text-center">
            <div className="p-3 bg-[#0f172a] border border-[#334155] rounded-xl text-xs text-slate-300">
              <span className="text-amber-400 font-bold">📱 Cash Captain Mobile Radar:</span> Real-time buyer radar scanning, active leads, live traffic overview, and ROI tracking on your phone.
            </div>

            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-slate-950 flex items-center justify-center p-2">
              <img
                src="/assets/aistudio/image_595560ec-d709-4c7b-b653-df9c2d72a30e_b5b28fc5.jpg"
                alt="Cash Captain Marketeer Mobile Radar and Live Analytics"
                className="max-h-[350px] w-auto object-contain rounded-xl shadow-lg"
              />
            </div>

            <p className="text-xs text-[#94a3b8]">
              Automated Marketing Radar runs 24/7. When buyer threads appear, Cash Captain Marketeer dispatches the tailored ad copy instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
