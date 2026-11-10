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
  // Secret multi-tap on logo to open Master Login discreetly
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    if (next >= 3) {
      setLogoClicks(0);
      onOpenMasterAccess();
    } else {
      setLogoClicks(next);
      setTimeout(() => setLogoClicks(0), 1200);
    }
  };

  return (
    <header className="border-b border-zinc-800 bg-black sticky top-0 z-40 shadow-xl">
      <div className="max-w-6xl mx-auto px-4 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Branding */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-7">
            <button
              onClick={handleLogoClick}
              title="Cash Captain Marketeer™"
              className="relative p-1 bg-transparent border-0 cursor-pointer transition-transform duration-200 select-none shrink-0 group focus:outline-none hover:scale-105 active:scale-95"
              aria-label="Cash Captain Logo"
            >
              <CashCaptainLogo className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 drop-shadow-[0_4px_28px_rgba(57,255,20,0.35)] group-hover:drop-shadow-[0_6px_36px_rgba(57,255,20,0.6)] transition-all" />
            </button>
            <div className="flex flex-col justify-center">
              {/* App Name - Stepped Title Formation */}
              {/* Step 1: Cash Captain with prominent Neon Green Capital C's & Silver text */}
              <div className="flex items-baseline tracking-tight select-none">
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#39ff14] drop-shadow-[0_0_14px_rgba(57,255,20,0.7)] leading-none filter">
                  C
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 mr-2.5 sm:mr-4 leading-none">
                  ash
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl font-black text-[#39ff14] drop-shadow-[0_0_14px_rgba(57,255,20,0.7)] leading-none filter">
                  C
                </span>
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 leading-none">
                  aptain
                </span>
              </div>

              {/* Step 2: Marketeer! scooted to the right in step formation with neon swoosh */}
              <div className="pl-6 sm:pl-10 md:pl-12 mt-1 sm:mt-1.5 flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wide text-[#39ff14] drop-shadow-[0_0_16px_rgba(57,255,20,0.6)] italic">
                    Marketeer!™
                  </h2>
                  <span className="text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded bg-zinc-900 text-[#39ff14] font-mono font-medium border border-emerald-500/30">
                    v2.6
                  </span>
                </div>
                {/* Energetic Neon Green Underline Swoosh as requested in the reference sketch */}
                <svg className="w-36 sm:w-48 h-2.5 text-[#39ff14] mt-0.5 -ml-0.5 overflow-visible" viewBox="0 0 180 12" fill="none">
                  <path
                    d="M 2,4 C 45,10 120,11 175,2 C 160,5 125,9 65,7"
                    fill="#39ff14"
                    className="drop-shadow-[0_0_6px_rgba(57,255,20,0.9)]"
                  />
                </svg>
              </div>

              {/* Tagline directly under the stepped name */}
              <p className="text-xs sm:text-sm text-slate-300 font-medium pl-6 sm:pl-10 md:pl-12 mt-1 leading-snug">
                Autonomous AI Buyer Radar, Zero-Ban Compliance &amp; Automatic Link Placement
              </p>

              {/* Unboxed Yeah We Got That • A Virbis.com Company */}
              <div className="text-xs text-slate-400 font-normal tracking-wide flex items-center gap-1.5 pl-6 sm:pl-10 md:pl-12 mt-1 flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14] shrink-0"></span>
                <span className="text-slate-300 font-medium">Yeah We Got That Online</span>
                <span className="text-zinc-600">•</span>
                <span className="text-slate-400">A Virbis.com Company</span>
                {affiliateProEnabled && (
                  <>
                    <span className="text-zinc-600">•</span>
                    <span className="text-[#39ff14] font-mono text-[11px]">Affiliate Pro Linked</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Bar (Top Right) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* ONLY DISPLAYED WHEN TY IS LOGGED IN AS MASTER (HIDDEN FROM ALL REGULAR CUSTOMERS) */}
            {masterSession.isMasterLoggedIn && (
              <div className="flex items-center bg-slate-950/90 border border-emerald-500/40 rounded-lg p-1 gap-1 text-xs shadow-md">
                <button
                  onClick={onToggleMasterViewMode}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    masterSession.viewMode === 'admin'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Switch to Master Admin Controls"
                >
                  <Crown className="w-3 h-3" />
                  <span>Admin Mode</span>
                </button>
                <button
                  onClick={onToggleMasterViewMode}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    masterSession.viewMode === 'customer'
                      ? 'bg-slate-700 text-emerald-300 font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="View app exactly as a customer sees it"
                >
                  <Eye className="w-3 h-3" />
                  <span>Customer View</span>
                </button>
                <button
                  onClick={onOpenMasterAccess}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Open Master Suite & Settings"
                >
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            )}

            {/* User Account / Sign In Button (First Spot) */}
            {currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="px-3 py-2 rounded-lg font-bold text-xs bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="View My Account & Campaign Quota"
              >
                <div className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></div>
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="max-w-[120px] truncate">{currentUser.displayName || currentUser.email}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-2 rounded-lg font-black text-xs bg-[#39ff14] hover:bg-[#32e012] text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                title="Sign in or create free account to save your offers"
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-950" />
                <span>Log In / Sign Up</span>
              </button>
            )}

            {/* Purchase App License / Key Activation */}
            <button
              onClick={onOpenLicenseModal}
              className="px-3.5 py-2 rounded-lg font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
              title="Purchase App License or Activate Campaign Key"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-950" />
              <span>Buy License</span>
            </button>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 mt-3.5 border-t border-zinc-800/80 pt-2.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('autopilot')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'autopilot'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Crosshair className={`w-4 h-4 ${activeTab === 'autopilot' ? 'text-slate-950' : 'text-emerald-400'}`} />
            <span>⚡ AI Auto-Pilot</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-slate-700 text-white font-bold border border-slate-600 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span>My Offers</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-950 text-emerald-400 font-mono">
              {offerCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hubs')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'hubs'
                ? 'bg-slate-700 text-white font-bold border border-slate-600 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>Search Hubs</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'social'
                ? 'bg-slate-700 text-emerald-300 font-extrabold border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>📢 Social Blast Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'email'
                ? 'bg-slate-700 text-emerald-300 font-extrabold border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>📬 Email Updates</span>
          </button>

          <button
            onClick={() => setActiveTab('affiliate_pro')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'affiliate_pro'
                ? 'bg-slate-700 text-emerald-300 font-bold border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>3-in-1 AI Suite</span>
            {affiliateProEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-slate-700 text-white font-bold border border-slate-600 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Tracking</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-950 text-emerald-400 font-mono">
              {totalClicks}
            </span>
          </button>

          {/* Customer-Facing Affiliate Program: 40% Commissions */}
          <button
            onClick={() => setActiveTab('partner')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'partner'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <span>🤝 Partner &amp; Earn 40%</span>
          </button>

          {/* ONLY DISPLAY DEVELOPER SALES SUITE TO MASTER TY BIRCHFIELD IN ADMIN MODE */}
          {masterSession.isMasterLoggedIn && masterSession.viewMode === 'admin' && (
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'sales'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-amber-400 hover:text-white hover:bg-amber-950/40 border border-amber-500/40'
              }`}
              title="Developer Checkout Links & Master Sales Materials (Only visible to Ty)"
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Developer Sales Kit</span>
            </button>
          )}

          {/* Last item: Utilities */}
          <button
            onClick={() => setActiveTab('utilities')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'utilities'
                ? 'bg-slate-700 text-white font-bold border border-slate-600 shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
            title="System Utilities, Manuals, Bulk Importer, and Backups"
          >
            <span>🛠️ Utilities & Backup</span>
          </button>
        </div>
      </div>
    </header>
  );
};
