import React, { useState } from 'react';
import {
  Globe,
  CloudCheck,
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Database,
  Radio,
  Sparkles
} from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';
import { CashCaptainLogo } from './CashCaptainLogo';

interface FirebaseLiveGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseLiveGuideModal: React.FC<FirebaseLiveGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(label);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const deployCommand = `npm run build\nfirebase deploy --only hosting`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 bg-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CashCaptainLogo className="w-12 h-12 shrink-0 drop-shadow-[0_2px_14px_rgba(57,255,20,0.35)]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Firebase Cloud & Free Hosting Command
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Provisioned & Ready
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">
                Project: <span className="font-mono text-amber-300">{firebaseConfig.projectId}</span> • Database & Free Hosting Live
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

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cloud Firestore</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Connected with isolated user schemas & live click syncing.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                <Shield className="w-4 h-4" />
                <span>Zero-Trust Security</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Rules deployed: user data isolated, sales alerts secured.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold mb-1">
                <Globe className="w-4 h-4" />
                <span>Firebase Hosting</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Configured via <code className="text-amber-300">firebase.json</code> for 100% free hosting.
              </p>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-blue-300 text-sm flex items-center gap-1.5">
              <span>💡 What Firebase is Doing For Your App:</span>
            </div>
            <p>
              1. <strong>Free Hosting:</strong> Firebase serves your frontend web app at your dedicated Cash Captain URL (<span className="text-amber-300 font-mono font-bold">https://cash-captain.web.app</span>) with free global SSL, zero downtime, and custom domains.
            </p>
            <p>
              2. <strong>Real-Time Cloud Persistence:</strong> Every offer you create, every traffic click tracked, and all social ads syndicated are automatically saved to your provisioned cloud database.
            </p>
            <p>
              3. <strong>Instant Sales Alerts:</strong> When someone buys your app, the purchase alert is immediately recorded to Firebase and alerted to <strong className="text-amber-300">tymesup4us@gmail.com</strong>.
            </p>
          </div>

          {/* 1-Step Deploy Commands */}
          <div className="bg-slate-900 rounded-xl border border-[#334155] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Deploy to Firebase Hosting (CLI):</span>
              </span>
              <button
                onClick={() => copyToClipboard(deployCommand, 'deploy')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedCmd === 'deploy' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy Command</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-amber-300 leading-relaxed border border-slate-800 select-all">
              npm run build<br />
              firebase deploy --only hosting
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Note: <code className="text-slate-300">firebase.json</code> is already configured to host the production <code className="text-slate-300">dist</code> folder with single-page app rewrites.
            </p>
          </div>

          {/* Alternative 1-Click Free Hosting */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-3.5 text-xs">
            <div className="font-bold text-slate-300 mb-1">
              Alternative Free Hosting (Pre-Configured):
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <strong>Vercel:</strong> <code className="text-slate-400">vercel.json</code> included
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <strong>Netlify:</strong> <code className="text-slate-400">netlify.toml</code> included
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#334155] bg-slate-900/90 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs cursor-pointer shadow-md"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
