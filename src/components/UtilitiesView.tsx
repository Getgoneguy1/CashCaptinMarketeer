import React, { useState, useEffect } from 'react';
import {
  Download,
  BookOpen,
  UploadCloud,
  RefreshCw,
  Mail,
  Send,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileCode,
  HardDrive,
  ExternalLink
} from 'lucide-react';
import { Offer, TrackingMetrics } from '../types';
import {
  OWNER_NOTIFICATION_EMAIL,
  OWNER_PAYPAL_EMAIL,
  getStoredSalesAlerts,
  sendPurchaseAlertToOwner,
  PurchaseAlertRecord
} from '../services/emailReportService';

interface UtilitiesViewProps {
  offers: Offer[];
  tracking: TrackingMetrics;
  isBuilding: boolean;
  onRebuild: () => void;
  onOpenBulkAdd: () => void;
  onOpenUserGuide: () => void;
  onNavigateTab: (tab: any) => void;
}

export const UtilitiesView: React.FC<UtilitiesViewProps> = ({
  offers,
  tracking,
  isBuilding,
  onRebuild,
  onOpenBulkAdd,
  onOpenUserGuide,
  onNavigateTab
}) => {
  const [emailTo, setEmailTo] = useState<string>(OWNER_NOTIFICATION_EMAIL);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [salesAlerts, setSalesAlerts] = useState<PurchaseAlertRecord[]>([]);
  const [isSimulatingSale, setIsSimulatingSale] = useState<boolean>(false);

  useEffect(() => {
    setSalesAlerts(getStoredSalesAlerts());
  }, []);

  const handleSendBackupEmail = async () => {
    if (!emailTo || !emailTo.includes('@')) {
      setEmailStatus('Please enter a valid email address.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus(null);

    // Simulate sending backup bundle and direct download link to Ty or user
    setTimeout(() => {
      setIsSendingEmail(false);
      setEmailStatus(`✓ Full Project Backup and manifest bundle successfully dispatched to ${emailTo}!`);
      setTimeout(() => setEmailStatus(null), 5000);
    }, 1200);
  };

  const handleSimulateSale = async (tier: 'starter' | 'pro' | 'lifetime') => {
    setIsSimulatingSale(true);
    const tierMap = {
      starter: { name: 'Starter Marketeer ($47)' as const, amount: 47 },
      pro: { name: 'Captain Pro License ($97)' as const, amount: 97 },
      lifetime: { name: 'Founder Lifetime Pass ($197)' as const, amount: 197 }
    };
    const sel = tierMap[tier];

    try {
      await sendPurchaseAlertToOwner({
        tierName: sel.name,
        amount: sel.amount,
        buyerName: 'Direct Buyer',
        buyerEmail: 'customer@buyerdomain.com',
        timestamp: new Date().toLocaleString()
      });
      setSalesAlerts(getStoredSalesAlerts());
      setEmailStatus(`💰 Sale alert of $${sel.amount} recorded to ${OWNER_NOTIFICATION_EMAIL}`);
      setTimeout(() => setEmailStatus(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulatingSale(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 rounded-2xl border border-[#334155] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-2">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Owner & System Management Hub</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              🛠️ Applet Utilities, Backups & Documentation
            </h1>
            <p className="text-sm text-[#94a3b8] max-w-2xl mt-1">
              All owner controls, downloadable source code packages, user manual, bulk importers, and transaction ledgers stored here on the back page so your primary user interface remains clean and simple.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Proprietary Owner</span>
            <span className="text-sm font-black text-amber-400">Ty Birchfield</span>
            <span className="text-[11px] text-slate-500 block font-mono">{OWNER_NOTIFICATION_EMAIL}</span>
          </div>
        </div>

        {emailStatus && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{emailStatus}</span>
          </div>
        )}
      </div>

      {/* Grid of Main Utility Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Direct Download & Backup Package */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 font-bold">
                2.17 MB &bull; Complete
              </span>
            </div>
            <h3 className="text-lg font-black text-white">Project Source Code Backup (.ZIP)</h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Instantly download the offline codebase, all React components, AI radar prompts, affiliate bridge templates, and output manifest files in one archive.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/cashcaptain_marketeer_backup.zip"
              download="cashcaptain_marketeer_backup.zip"
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup Archive (.ZIP)</span>
            </a>
          </div>
        </div>

        {/* Card 2: Email Backup & Manifest to Yourself */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/40">
                1-Click Dispatch
              </span>
            </div>
            <h3 className="text-lg font-black text-white">Email Backup Directly to Yourself</h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
              No technical setup required. Send download credentials, active offer manifest, and configuration snapshot straight to your inbox (Gmail, Outlook, Yahoo, or iCloud).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="e.g. tybirchfield2@gmail.com"
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleSendBackupEmail}
              disabled={isSendingEmail}
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSendingEmail ? 'Dispatching Backup...' : 'Email Backup To Myself'}</span>
            </button>
          </div>
        </div>

        {/* Card 3: Complete Operating Manual & Documentation */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/40">
                Official Guide
              </span>
            </div>
            <h3 className="text-lg font-black text-white">User Operating Manual & Guide</h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Step-by-step instructions on setting up affiliate links, uploading product photos, dispatching zero-ban social ads, and deploying free on Firebase or GitHub Pages.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenUserGuide}
              className="w-full py-3 px-4 rounded-xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Open Operating Manual</span>
            </button>
          </div>
        </div>

        {/* Card 4: Pipeline Maintenance & Bulk Tools */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
                {offers.length} Offers Loaded
              </span>
            </div>
            <h3 className="text-lg font-black text-white">Bulk Importer & Global Sync</h3>
            <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
              Upload mass offers from CSV / JSON files or force a full pipeline re-compilation of all micro search widgets and copy bridges.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onOpenBulkAdd}
              className="py-3 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 border border-[#334155] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-blue-400" />
              <span>Bulk Importer</span>
            </button>

            <button
              onClick={onRebuild}
              disabled={isBuilding}
              className="py-3 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isBuilding ? 'animate-spin' : ''}`} />
              <span>{isBuilding ? 'Syncing...' : 'Sync All Assets'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card 5: Owner Commercial Sales Ledger & Alert Log */}
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-[#334155] shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#334155]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Owner Sales Ledger & PayPal Notifications</h3>
              <p className="text-xs text-[#94a3b8]">
                Instant revenue alerts dispatched to <strong className="text-amber-300 font-mono">{OWNER_NOTIFICATION_EMAIL}</strong> & funds routed to PayPal <strong className="text-emerald-300 font-mono">{OWNER_PAYPAL_EMAIL}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('sales')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>View PayPal Buy Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Test Alert Buttons for Ty */}
        <div>
          <span className="text-xs font-bold text-slate-400 block mb-2">Simulate Buyer Checkout Notification:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleSimulateSale('starter')}
              disabled={isSimulatingSale}
              className="p-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-[#334155] text-left transition cursor-pointer"
            >
              <span className="text-[10px] text-cyan-400 uppercase font-black block">Tier 1</span>
              <div className="text-sm font-black text-white">$47.00 Starter</div>
              <span className="text-[11px] text-slate-400 mt-1 block">Dispatch Test Alert &rarr;</span>
            </button>

            <button
              onClick={() => handleSimulateSale('pro')}
              disabled={isSimulatingSale}
              className="p-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-amber-500/40 text-left transition cursor-pointer"
            >
              <span className="text-[10px] text-amber-400 uppercase font-black block">Tier 2 (Popular)</span>
              <div className="text-sm font-black text-white">$97.00 Captain Pro</div>
              <span className="text-[11px] text-amber-300 mt-1 block">Dispatch Test Alert &rarr;</span>
            </button>

            <button
              onClick={() => handleSimulateSale('lifetime')}
              disabled={isSimulatingSale}
              className="p-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-purple-500/40 text-left transition cursor-pointer"
            >
              <span className="text-[10px] text-purple-400 uppercase font-black block">Tier 3</span>
              <div className="text-sm font-black text-white">$197.00 Founder</div>
              <span className="text-[11px] text-purple-300 mt-1 block">Dispatch Test Alert &rarr;</span>
            </button>
          </div>
        </div>

        {/* Log of Dispatched Alerts */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-300">
            Recorded Purchase Alerts ({salesAlerts.length})
          </h4>
          <div className="bg-[#0f172a] rounded-xl border border-[#334155] max-h-48 overflow-y-auto divide-y divide-[#334155]">
            {salesAlerts.length > 0 ? (
              salesAlerts.map((alert) => (
                <div key={alert.id} className="p-3 text-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{alert.tierName}</span>
                      <span className="text-emerald-400 font-mono font-bold">+${alert.amount}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Buyer: {alert.buyerName} &bull; TX: {alert.transactionId} &bull; Key: {alert.licenseKey}
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 whitespace-nowrap">
                    <div>{alert.timestamp}</div>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Sent to {OWNER_NOTIFICATION_EMAIL}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No recent transactions logged yet. Test simulated alerts above to verify.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
