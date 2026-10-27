import React, { useState } from 'react';
import {
  Download,
  BookOpen,
  UploadCloud,
  RefreshCw,
  Flame,
  Database,
  FileText,
  Check,
  HardDrive,
  CloudUpload,
  AlertCircle
} from 'lucide-react';
import { Offer, TrackingMetrics } from '../types';
import { uploadBackupToGoogleDrive } from '../services/googleDriveService';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface UtilitiesPageProps {
  offers: Offer[];
  tracking: TrackingMetrics;
  isBuilding: boolean;
  onRebuild: () => void;
  onOpenBulkAdd: () => void;
  onOpenUserGuide: () => void;
  onOpenFirebaseGuide: () => void;
}

export const UtilitiesPage: React.FC<UtilitiesPageProps> = ({
  offers,
  tracking,
  isBuilding,
  onRebuild,
  onOpenBulkAdd,
  onOpenUserGuide,
  onOpenFirebaseGuide
}) => {
  const [exported, setExported] = useState(false);
  const [isUploadingDrive, setIsUploadingDrive] = useState(false);
  const [driveStatus, setDriveStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportUserData = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      app: 'Cash Captain Marketeer™',
      totalOffers: offers.length,
      trackingMetrics: tracking,
      offers: offers
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cash_captain_my_offers_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  const handleSaveToGoogleDrive = async () => {
    setIsUploadingDrive(true);
    setDriveStatus(null);
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (!token) {
        throw new Error('Failed to obtain Google Drive access token from authentication');
      }

      const res = await uploadBackupToGoogleDrive(token);
      if (res.success) {
        setDriveStatus({
          type: 'success',
          text: `Backup successfully saved to tybirchfield42@gmail.com Google Drive! (ID: ${res.fileId})`
        });
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      console.error('Google Drive backup error', err);
      setDriveStatus({
        type: 'error',
        text: err.message || 'Google Drive authentication or upload failed.'
      });
    } finally {
      setIsUploadingDrive(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900 p-6 rounded-2xl border border-slate-700/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow">
            🛠️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">System Utilities & Backups</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold border border-slate-700">
                Admin & User Suite
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8]">
              Manage offers, export user data backups, and save system backups directly to Google Drive (tybirchfield42@gmail.com).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#0f172a] px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Active Offers: <strong className="text-white">{offers.length}</strong></span>
        </div>
      </div>

      {/* Drive Status Toast */}
      {driveStatus && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 shadow-lg ${
            driveStatus.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
          }`}
        >
          {driveStatus.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{driveStatus.text}</span>
        </div>
      )}

      {/* Grid of Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CARD 1: Save Backup to Google Drive (tybirchfield42@gmail.com) */}
        <div className="bg-[#1e293b] rounded-xl p-5 border border-amber-500/40 shadow-lg space-y-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <CloudUpload className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">
                Google Drive Cloud
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Save Backup to Google Drive</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Authenticate with Google and instantly upload the complete system backup archive directly to Ty Birchfield's Google Drive (<strong className="text-amber-300">tybirchfield42@gmail.com</strong>).
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSaveToGoogleDrive}
              disabled={isUploadingDrive}
              className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isUploadingDrive
                  ? 'bg-amber-600/70 text-slate-950 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              <span>
                {isUploadingDrive ? 'Connecting & Uploading to Drive...' : 'Save Backup to tybirchfield42@gmail.com Drive'}
              </span>
            </button>
          </div>
        </div>

        {/* CARD 2: User Data Backup & Export (.JSON) */}
        <div className="bg-[#1e293b] rounded-xl p-5 border border-cyan-500/30 shadow-lg space-y-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                Personal Data Backup
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Export My Offers, Links & Analytics (.JSON)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Download a complete backup file containing all your added affiliate products, description copy, custom image links, and tracking metrics.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExportUserData}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-xs bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {exported ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">User Data Backup Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download My Data Backup (.JSON)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD 3: User Manual & Operating Guide */}
        <div className="bg-[#1e293b] rounded-xl p-5 border border-amber-500/30 shadow-lg space-y-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">
                Documentation
              </span>
            </div>
            <h3 className="text-base font-bold text-white">User Manual & Operating Guide</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step-by-step operating documentation covering affiliate links, autonomous ad placement, zero-ban compliance, and lead tracking.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenUserGuide}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Open Complete User Manual</span>
            </button>
          </div>
        </div>

        {/* CARD 4: Bulk Offer Import */}
        <div className="bg-[#1e293b] rounded-xl p-5 border border-blue-500/30 shadow-lg space-y-3.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50">
                Bulk Tools
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Bulk Offer Importer</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Import multiple affiliate products simultaneously via CSV, JSON, or formatted text lines to quickly populate your database.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenBulkAdd}
              className="w-full py-2.5 px-4 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Launch Bulk Importer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cloud Integration Status Card */}
      <div className="bg-[#1e293b] p-5 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Firebase Cloud Firestore & Authentication</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Live multi-device database synchronization, security rules, and real-time tracking data.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenFirebaseGuide}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer shrink-0"
        >
          View Cloud Credentials
        </button>
      </div>
    </div>
  );
};
