import React from 'react';
import { Search, Sparkles, FolderGit2, Link2, UploadCloud, TrendingUp, RefreshCw, Crosshair } from 'lucide-react';

export type NavTab = 'autopilot' | 'offers' | 'copy' | 'hubs' | 'affiliate_pro' | 'ledger';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  offerCount: number;
  totalClicks: number;
  isBuilding: boolean;
  onRebuild: () => void;
  onOpenBulkAdd: () => void;
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
  affiliateProEnabled
}) => {
  return (
    <header className="border-b border-[#334155] bg-[#1e293b]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Crosshair className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">CashCaptin AI</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono border border-blue-500/30">
                  Auto-Pilot Placer
                </span>
                {affiliateProEnabled && (
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                    &bull; Affiliate Pro Linked
                  </span>
                )}
              </div>
              <p className="text-xs text-[#94a3b8]">
                Autonomous Web Scraping, Buyer Discovery & Ad Placement Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenBulkAdd}
              className="px-3.5 py-2 rounded-md font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#334155] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
              <span>Bulk Add</span>
            </button>

            <button
              onClick={onRebuild}
              disabled={isBuilding}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-semibold text-xs text-white transition-all shadow-sm ${
                isBuilding
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-500'
              }`}
              title="Sync all search tools and manifests"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isBuilding ? 'animate-spin' : ''}`} />
              <span>{isBuilding ? 'Syncing...' : 'Sync All'}</span>
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
        </div>
      </div>
    </header>
  );
};
