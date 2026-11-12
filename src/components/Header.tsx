import React, { useState } from 'react';
import {
  Sparkles,
  FolderGit2,
  Link2,
  TrendingUp,
  Crosshair,
  Mail,
  Share2,
  Crown,
  Eye,
  Sliders,
  User,
  KeyRound
} from 'lucide-react';
import { MasterAuthSession } from '../types';
import { AppUserProfile } from '../services/userAuthService';
import { CashCaptainLogo } from './CashCaptainLogo';

export type NavTab = 'autopilot' | 'offers' | 'copy' | 'hubs' | 'social' | 'email' | 'affiliate_pro' | 'ledger' | 'partner' | 'utilities' | 'sales';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  offerCount: number;
  totalClicks: number;
  isBuilding: boolean;
  onRebuild: () => void;
  onOpenBulkAdd: () => void;
  onOpenEmailModal?: () => void;
  onOpenSocialBlast?: () => void;
  onOpenFirebaseGuide: () => void;
  onOpenUserGuide: () => void;
  affiliateProEnabled: boolean;
  masterSession: MasterAuthSession;
  onOpenMasterAccess: () => void;
  onToggleMasterViewMode?: () => void;
  onOpenLicenseModal?: () => void;
  currentUser?: AppUserProfile | null;
  onOpenAuthModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  offerCount,
  totalClicks,
  isBuilding,
  onRebuild,
  onOpenBulkAdd,
  onOpenEmailModal,
  onOpenSocialBlast,
  onOpenFirebaseGuide,
  onOpenUserGuide,
  affiliateProEnabled,
  masterSession,
  onOpenMasterAccess,
  onToggleMasterViewMode,
  onOpenLicenseModal,
  currentUser,
  onOpenAuthModal
}) => {
  // Secret access (10 clicks within 4s window on Logo or Crown)
  const [secretClicks, setSecretClicks] = useState(0);

  const handleSecretClick = () => {
    const next = secretClicks + 1;
    if (next >= 10) {
      setSecretClicks(0);
      onOpenMasterAccess();
    } else {
      setSecretClicks(next);
      setTimeout(() => setSecretClicks(0), 4000);
    }
  };

  return (
    <header className="border-b border-zinc-800/90 bg-black/95 backdrop-blur sticky top-0 z-40 shadow-lg">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        {/* Top Brand & Actions Bar */}
        <div className="flex items-center justify-between gap-2.5">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <button
              onClick={handleSecretClick}
              className="p-0.5 bg-transparent border-0 cursor-pointer transition-transform duration-150 select-none shrink-0 group focus:outline-none hover:scale-105 active:scale-95"
              aria-label="Cash Captain"
            >
              <CashCaptainLogo className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 drop-shadow-[0_2px_14px_rgba(57,255,20,0.35)]" />
            </button>

            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-baseline tracking-tight select-none flex-wrap">
                <span className="text-xl sm:text-2xl font-black text-[#39ff14] leading-none">C</span>
                <span className="text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 mr-1.5 leading-none">ash</span>
                <span className="text-xl sm:text-2xl font-black text-[#39ff14] leading-none">C</span>
                <span className="text-base sm:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-200 leading-none">aptain</span>
                <span className="text-sm sm:text-base font-black text-[#39ff14] italic ml-1.5">Marketeer!™</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-zinc-900 text-[#39ff14] font-mono border border-emerald-500/30 ml-1.5">
                  v2.6
                </span>
                <button
                  type="button"
                  onClick={handleSecretClick}
                  className="p-0.5 ml-1 bg-transparent border-0 cursor-pointer text-emerald-500/20 hover:text-emerald-400 transition-colors focus:outline-none"
                  aria-label="Marketeer Crown"
                >
                  <Crown className="w-3 h-3" />
                </button>
              </div>

              {/* Discreet subtitle on tablet/desktop */}
              <p className="hidden md:block text-[11px] text-slate-400 font-medium leading-tight mt-0.5">
                Autonomous AI Buyer Radar &bull; Yeah We Got That Online &bull; A Virbis.com Company
              </p>
            </div>
          </div>

          {/* Action Bar (Top Right) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* ONLY DISPLAYED WHEN IN ADMIN MODE */}
            {masterSession.isMasterLoggedIn && (
              <div className="hidden sm:flex items-center bg-slate-950/90 border border-emerald-500/40 rounded-lg p-0.5 gap-1 text-[11px] shadow-sm">
                <button
                  onClick={onToggleMasterViewMode}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    masterSession.viewMode === 'admin'
                      ? 'bg-emerald-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Switch to Master Admin Controls"
                >
                  <Crown className="w-2.5 h-2.5" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={onToggleMasterViewMode}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    masterSession.viewMode === 'customer'
                      ? 'bg-slate-700 text-emerald-300 font-black'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="View app exactly as a customer sees it"
                >
                  <Eye className="w-2.5 h-2.5" />
                  <span>Customer</span>
                </button>
                <button
                  onClick={onOpenMasterAccess}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Open Master Suite & Settings"
                >
                  <Sliders className="w-3 h-3 text-emerald-400" />
                </button>
              </div>
            )}

            {/* User Account / Sign In Button */}
            {currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                title="View My Account"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse"></div>
                <User className="w-3 h-3 text-emerald-400" />
                <span className="max-w-[80px] sm:max-w-[110px] truncate">{currentUser.displayName || currentUser.email}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg font-black text-[11px] sm:text-xs bg-[#39ff14] hover:bg-[#32e012] text-slate-950 transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-102"
                title="Sign in or register"
              >
                <KeyRound className="w-3 h-3 text-slate-950" />
                <span>Sign In</span>
              </button>
            )}

            {/* Purchase App License / Key Activation */}
            <button
              onClick={onOpenLicenseModal}
              className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg font-black text-[11px] sm:text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1 cursor-pointer shadow-sm hover:scale-102"
              title="Purchase App License or Activate Campaign Key"
            >
              <KeyRound className="w-3 h-3 text-slate-950" />
              <span>License</span>
            </button>
          </div>
        </div>

        {/* Station Navigation Bar - Thinner, Sleeker, Low-Profile Buttons */}
        <div className="mt-2 pt-1.5 border-t border-zinc-800/70">
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {/* 1. AI Auto-Pilot (Emerald Box) */}
            <button
              onClick={() => setActiveTab('autopilot')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                activeTab === 'autopilot'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-extrabold shadow-sm'
                  : 'bg-emerald-950/70 hover:bg-emerald-900/90 text-emerald-200 border-emerald-500/50'
              }`}
            >
              <Crosshair className={`w-3 h-3 ${activeTab === 'autopilot' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>⚡ Auto-Pilot</span>
            </button>

            {/* 2. My Offers (Deep Blue Box) */}
            <button
              onClick={() => setActiveTab('offers')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'offers'
                  ? 'bg-blue-600 text-white border-blue-300 font-extrabold shadow-sm'
                  : 'bg-blue-950/70 hover:bg-blue-900/90 text-blue-200 border-blue-500/50'
              }`}
            >
              <span>📁 Offers</span>
              <span className={`text-[10px] px-1 rounded font-mono font-bold ${
                activeTab === 'offers' ? 'bg-slate-950 text-blue-300' : 'bg-slate-950 text-blue-400 border border-blue-500/30'
              }`}>
                {offerCount}
              </span>
            </button>

            {/* 3. Search Hubs (Sky/Cyan Box) */}
            <button
              onClick={() => setActiveTab('hubs')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'hubs'
                  ? 'bg-sky-500 text-slate-950 border-sky-200 font-extrabold shadow-sm'
                  : 'bg-sky-950/70 hover:bg-sky-900/90 text-sky-200 border-sky-400/50'
              }`}
            >
              <FolderGit2 className={`w-3 h-3 ${activeTab === 'hubs' ? 'text-slate-950' : 'text-sky-300'}`} />
              <span>🔍 Hubs</span>
            </button>

            {/* 4. Social Blast Hub (Purple Box) */}
            <button
              onClick={() => setActiveTab('social')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'social'
                  ? 'bg-purple-600 text-white border-purple-300 font-extrabold shadow-sm'
                  : 'bg-purple-950/70 hover:bg-purple-900/90 text-purple-200 border-purple-400/50'
              }`}
            >
              <Share2 className={`w-3 h-3 ${activeTab === 'social' ? 'text-white' : 'text-purple-300'}`} />
              <span>📢 Social</span>
            </button>

            {/* 5. Email Updates (Rose Box) */}
            <button
              onClick={() => setActiveTab('email')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'email'
                  ? 'bg-rose-600 text-white border-rose-300 font-extrabold shadow-sm'
                  : 'bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 border-rose-400/50'
              }`}
            >
              <Mail className={`w-3 h-3 ${activeTab === 'email' ? 'text-white' : 'text-rose-300'}`} />
              <span>📬 Email</span>
            </button>

            {/* 6. 3-in-1 AI Suite (Amber Box) */}
            <button
              onClick={() => setActiveTab('affiliate_pro')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'affiliate_pro'
                  ? 'bg-amber-500 text-slate-950 border-amber-200 font-extrabold shadow-sm'
                  : 'bg-amber-950/70 hover:bg-amber-900/90 text-amber-200 border-amber-400/50'
              }`}
            >
              <Sparkles className={`w-3 h-3 ${activeTab === 'affiliate_pro' ? 'text-slate-950' : 'text-amber-300'}`} />
              <span>✨ 3-in-1</span>
              {affiliateProEnabled && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>

            {/* 7. Tracking & Ledger (Teal Box) */}
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'ledger'
                  ? 'bg-teal-500 text-slate-950 border-teal-200 font-extrabold shadow-sm'
                  : 'bg-teal-950/70 hover:bg-teal-900/90 text-teal-200 border-teal-400/50'
              }`}
            >
              <TrendingUp className={`w-3 h-3 ${activeTab === 'ledger' ? 'text-slate-950' : 'text-teal-300'}`} />
              <span>📈 Tracking</span>
              <span className={`text-[10px] px-1 rounded font-mono font-bold ${
                activeTab === 'ledger' ? 'bg-slate-950 text-teal-300' : 'bg-slate-950 text-teal-400 border border-teal-500/30'
              }`}>
                {totalClicks}
              </span>
            </button>

            {/* 8. Partner Program 40% (Rich Emerald Box) */}
            <button
              onClick={() => setActiveTab('partner')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'partner'
                  ? 'bg-emerald-500 text-slate-950 border-emerald-200 font-extrabold shadow-sm'
                  : 'bg-emerald-950/75 hover:bg-emerald-900/90 text-emerald-300 border-emerald-400/50'
              }`}
            >
              <span>🤝 Partner (40%)</span>
            </button>

            {/* Master-Only: Developer Sales Kit (Golden Box) */}
            {masterSession.isMasterLoggedIn && masterSession.viewMode === 'admin' && (
              <button
                onClick={() => setActiveTab('sales')}
                className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                  activeTab === 'sales'
                    ? 'bg-amber-400 text-slate-950 border-amber-200 font-extrabold shadow-sm'
                    : 'bg-amber-950/70 hover:bg-amber-900/90 text-amber-300 border-amber-500/50'
                }`}
                title="Developer Checkout Links & Master Sales Materials"
              >
                <Crown className="w-3 h-3 text-amber-300" />
                <span>👑 Sales</span>
              </button>
            )}

            {/* 9. Utilities & Backup (Slate Box) */}
            <button
              onClick={() => setActiveTab('utilities')}
              className={`px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer border ${
                activeTab === 'utilities'
                  ? 'bg-slate-600 text-white border-slate-300 font-extrabold shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 border-slate-600/50'
              }`}
              title="System Utilities, Manuals, Bulk Importer, and Backups"
            >
              <span>🛠️ Utilities</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
