import React, { useState, useRef } from 'react';
import {
  Download,
  BookOpen,
  UploadCloud,
  RefreshCw,
  Database,
  FileText,
  Check,
  HardDrive,
  Upload,
  AlertCircle
} from 'lucide-react';
import { Offer, TrackingMetrics } from '../types';

interface UtilitiesPageProps {
  offers: Offer[];
  tracking: TrackingMetrics;
  isBuilding: boolean;
  onRebuild: () => void;
  onOpenBulkAdd: () => void;
  onOpenUserGuide: () => void;
  onOpenFirebaseGuide: () => void;
  onRestoreData?: (restoredOffers: Offer[], restoredTracking?: TrackingMetrics) => void;
}

export const UtilitiesPage: React.FC<UtilitiesPageProps> = ({
  offers,
  tracking,
  isBuilding,
  onRebuild,
  onOpenBulkAdd,
  onOpenUserGuide,
  onOpenFirebaseGuide,
  onRestoreData
}) => {
  const [exported, setExported] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export full application state locally to user's device (zero cloud/Google dependencies)
  const handleExportUserData = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      app: 'Cash Captain Marketeer™',
      version: '2.6',
      totalOffers: offers.length,
      trackingMetrics: tracking,
      offers: offers
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cash_captain_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  // Import and restore from local JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed.offers)) {
          if (onRestoreData) {
            onRestoreData(parsed.offers, parsed.trackingMetrics);
          } else {
            localStorage.setItem('cashcaptin_offers', JSON.stringify(parsed.offers));
            if (parsed.trackingMetrics) {
              localStorage.setItem('cashcaptin_tracking', JSON.stringify(parsed.trackingMetrics));
            }
            window.location.reload();
          }

          setRestoreStatus({
            type: 'success',
            text: `Successfully restored ${parsed.offers.length} offers from backup file!`
          });
          setTimeout(() => setRestoreStatus(null), 4000);
        } else {
          throw new Error('Invalid backup file format: missing offers list.');
        }
      } catch (err: any) {
        setRestoreStatus({
          type: 'error',
          text: err.message || 'Failed to read or parse backup file.'
        });
        setTimeout(() => setRestoreStatus(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-2xl shadow">
            🛠️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">System Utilities &amp; Local Backups</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#060913] text-emerald-400 text-xs font-mono font-bold border border-slate-800">
                Independent Local Storage
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage offers, export offline backup archives directly to your computer, and restore data at any time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#060913] px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Active Offers: <strong className="text-white">{offers.length}</strong></span>
        </div>
      </div>

      {/* Restore Status Toast */}
      {restoreStatus && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-lg ${
            restoreStatus.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
          }`}
        >
          {restoreStatus.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{restoreStatus.text}</span>
        </div>
      )}

      {/* Hidden file input for restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Netlify One-Click Deployment Banner */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-teal-950/60 border border-teal-500/40 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-black text-sm">
              N
            </span>
            <h3 className="text-base font-black text-white">
              Ready to Host on Netlify (100% Free &amp; Independent)
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            Download the pre-compiled, lightweight production zip (includes SPA routing <code className="text-teal-300 font-mono">_redirects</code>). Unzip the file and drag-and-drop the folder directly onto <strong>app.netlify.com/drop</strong> for instant live hosting with zero Google dependence.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/cashcaptain_netlify.zip"
            download="cashcaptain_netlify.zip"
            className="px-5 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download Netlify Zip (2.1 MB)</span>
          </a>
          <a
            href="https://app.netlify.com/drop"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>Open Netlify Drop &rarr;</span>
          </a>
        </div>
      </div>

      {/* Grid of Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CARD 1: Local Backup Export */}
        <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-[#060913] text-emerald-400 border border-slate-800">
                Offline Local JSON
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Download Local Backup Archive</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export an independent, offline JSON backup file containing all your product campaigns, links, copy strategies, and tracking data directly to your device.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExportUserData}
              className="w-full py-3 px-4 rounded-xl font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 active:scale-[0.99]"
            >
              {exported ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Backup File Saved to Your Computer!</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-4 h-4 text-slate-950" />
                  <span>Download Backup File (.JSON)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD 2: Restore from Local Backup */}
        <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center">
                <Upload className="w-6 h-6 text-emerald-400" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-[#060913] text-slate-300 border border-slate-800">
                Data Restore
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Restore from Backup Archive</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a previously exported Cash Captain backup file (.json) to instantly recover your products, links, and click ledgers without external accounts.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Select Backup File to Restore</span>
            </button>
          </div>
        </div>

        {/* CARD 3: User Manual & Operating Guide */}
        <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-400" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-[#060913] text-slate-300 border border-slate-800">
                Documentation
              </span>
            </div>
            <h3 className="text-base font-bold text-white">User Manual &amp; Operating Guide</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step-by-step operating documentation covering affiliate links, autonomous ad placement, zero-ban compliance, and lead tracking.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenUserGuide}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Open Complete User Manual</span>
            </button>
          </div>
        </div>

        {/* CARD 4: Bulk Offer Import */}
        <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-emerald-400" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-md bg-[#060913] text-slate-300 border border-slate-800">
                Bulk Tools
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Bulk Offer Importer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Import multiple affiliate products simultaneously via CSV, JSON, or formatted text lines to quickly populate your database.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenBulkAdd}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <span>Launch Bulk Importer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
