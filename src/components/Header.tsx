import React from 'react';
import { Search, Sparkles, FolderGit2, Link2, UploadCloud, TrendingUp, RefreshCw, Crosshair, Mail, Share2, Flame, Globe, BookOpen, Download } from 'lucide-react';

export type NavTab = 'autopilot' | 'offers' | 'copy' | 'hubs' | 'social' | 'affiliate_pro' | 'ledger' | 'sales' | 'utilities';


interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  offerCount: number;
  totalClicks: number;
  isBuilding: boolean;
  onRebuild: () => void;
  onOpenBulkAdd: () => void;
  onOpenEmailModal: () => void;
  onOpenSocialBlast: () => void;
  onOpenFirebaseGuide: () => void;
  onOpenUserGuide: () => void;
  affiliateProEnabled: boolean;
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
  affiliateProEnabled
}) => {
  return (
    <header className="border-b border-[#334155] bg-[#1e293b]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 text-lg">
              ⚔️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black tracking-tight text-white">Cash Captain Marketeer™</h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40" title="Created by Ty Birchfield • Y.W.G.T Online! A Virbis.com Company">
                  Y.W.G.T Online! • A Virbis.com Company
                </span>
                {/* Firebase Live Badge */}
                <button
                  onClick={onOpenFirebaseGuide}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 font-bold border border-orange-500/30 flex items-center gap-1 transition-all cursor-pointer"
                  title="Firebase Database & Free Hosting Status"
                >
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span>Firebase Live</span>
                </button>
                {affiliateProEnabled && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                    &bull; Affiliate Pro Linked
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94a3b8]">
                Autonomous AI Buyer Radar, Zero-Ban Compliance & Automatic Link Placement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Social Media Blast Button */}
            <button
              onClick={() => setActiveTab('social')}
              className="px-3.5 py-2 rounded-md font-bold text-xs bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-pink-500/20"
              title="Syndicate Advertisements to Facebook, Instagram, TikTok, X, Reddit"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-200" />
              <span>Social Blast</span>
            </button>

            {/* Email Reports & Alerts */}
            <button
              onClick={onOpenEmailModal}
              className="px-3.5 py-2 rounded-md font-semibold text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Configure Email Reports and Sales Alerts"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Email Alerts</span>
            </button>

            {/* Buy License Header Button */}
            <button
              onClick={() => setActiveTab('sales')}
              className="px-3.5 py-2 rounded-md font-extrabold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/25 ring-1 ring-amber-400"
              title="Buy Cash Captain Marketeer License"
            >
              <span>💳 Buy License</span>
            </button>
          </div>
        </div>


        {/* Tab navigation */}
        <div className="flex items-center gap-1 sm:gap-2 mt-3 border-t border-[#334155]/60 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('autopilot')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'autopilot'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
                : 'text-sky-300 hover:text-white hover:bg-[#334155]/50'
            }`}
          >
            <Crosshair className="w-4 h-4 text-amber-300" />
            <span>⚡ AI Auto-Pilot</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-[#3b82f6] text-white shadow'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#334155]/50'
            }`}
          >
            <span>My Offers</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#0f172a] text-[#38bdf8]">
              {offerCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('copy')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'copy'
                ? 'bg-[#3b82f6] text-white shadow'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#334155]/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Promo Copy</span>
          </button>

          <button
            onClick={() => setActiveTab('hubs')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'hubs'
                ? 'bg-[#3b82f6] text-white shadow'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#334155]/50'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span>Search Hubs</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'social'
                ? 'bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white shadow-lg shadow-pink-500/25 ring-1 ring-pink-400'
                : 'text-pink-300 hover:text-white hover:bg-pink-500/10'
            }`}
          >
            <Share2 className="w-4 h-4 text-amber-300" />
            <span>📢 Social Blast Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('affiliate_pro')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'affiliate_pro'
                ? 'bg-[#3b82f6] text-white shadow'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#334155]/50'
            }`}
          >
            <Link2 className="w-4 h-4 text-sky-400" />
            <span>Affiliate Pro Link</span>
            {affiliateProEnabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-[#3b82f6] text-white shadow'
                : 'text-[#94a3b8] hover:text-white hover:bg-[#334155]/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Tracking</span>
            <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#0f172a] text-[#10b981]">
              {totalClicks}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 ring-1 ring-amber-400'
                : 'text-amber-300 hover:text-white hover:bg-amber-500/10 border border-amber-500/40'
            }`}
          >
            <span>💳 Buy License (PayPal)</span>
          </button>

          {/* Very Last Page on Menu Slider: Utilities & Backup */}
          <button
            onClick={() => setActiveTab('utilities')}
            className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'utilities'
                ? 'bg-slate-700 text-white shadow-md ring-1 ring-slate-400 font-extrabold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-700/60'
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
