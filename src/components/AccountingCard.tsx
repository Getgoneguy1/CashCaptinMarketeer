import React, { useState } from 'react';
import { TrackingMetrics, Offer } from '../types';
import { MousePointerClick, DollarSign, Target, Percent, ArrowUpRight, Check, TrendingUp, RotateCw } from 'lucide-react';

interface AccountingCardProps {
  tracking: TrackingMetrics;
  offers: Offer[];
  onUpdateMetrics: (conversions: number, revenue: number) => void;
}

export const AccountingCard: React.FC<AccountingCardProps> = ({
  tracking,
  offers,
  onUpdateMetrics
}) => {
  const [conversionsInput, setConversionsInput] = useState<string>(tracking.conversions.toString());
  const [revenueInput, setRevenueInput] = useState<string>(tracking.revenue.toFixed(2));
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);
  const [isTrackerLive, setIsTrackerLive] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleToggleOrRefresh = () => {
    setIsRefreshing(true);
    try {
      const stored = localStorage.getItem('cashcaptin_tracking');
      if (stored) {
        const parsed = JSON.parse(stored);
        onUpdateMetrics(parsed.conversions || 0, parsed.revenue || 0);
      }
    } catch {}
    setTimeout(() => {
      setIsRefreshing(false);
      setIsTrackerLive(true);
    }, 500);
  };

  const handleSaveAccounting = (e: React.FormEvent) => {
    e.preventDefault();
    const conv = parseInt(conversionsInput, 10) || 0;
    const rev = parseFloat(revenueInput) || 0;
    onUpdateMetrics(conv, rev);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  const conversionRate = tracking.clicks > 0
    ? ((tracking.conversions / tracking.clicks) * 100).toFixed(1)
    : '0.0';

  const epc = tracking.clicks > 0
    ? (tracking.revenue / tracking.clicks).toFixed(2)
    : '0.00';

  return (
    <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl mb-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Campaign Performance &amp; Revenue Ledger</span>
          </h2>
          <p className="text-xs text-slate-400">
            Monitor real-time campaign traffic, verified affiliate conversions, and commission earnings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isTrackerLive ? (
            <button
              type="button"
              onClick={() => setIsTrackerLive(false)}
              title="Live tracker active. Click to test update/refresh."
              className="px-3.5 py-1.5 rounded-xl bg-[#060913] border border-emerald-500/40 flex items-center gap-2 cursor-pointer hover:border-emerald-500/70 transition shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Status: Live
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggleOrRefresh}
              title="Click to update and refresh tracker"
              className="px-3.5 py-1.5 rounded-xl bg-red-950/40 border border-red-500/50 flex items-center gap-2 cursor-pointer hover:bg-red-950/70 transition shadow-sm animate-pulse"
            >
              <RotateCw className={`w-3.5 h-3.5 text-red-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-xs font-mono font-bold text-red-400">
                {isRefreshing ? 'Updating...' : 'Status: Update or Refresh'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 text-center shadow-sm">
          <div className="flex items-center justify-center text-slate-400 mb-1">
            <MousePointerClick className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{tracking.clicks}</h3>
          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Clicks</p>
        </div>

        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 text-center shadow-sm">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{tracking.conversions}</h3>
          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Conversions</p>
        </div>

        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 text-center shadow-sm">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-emerald-400 tracking-tight">
            ${tracking.revenue.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Commission Earned</p>
        </div>

        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 text-center shadow-sm">
          <div className="flex items-center justify-center text-blue-400 mb-1">
            <Percent className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">{conversionRate}%</h3>
          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Conv. Rate</p>
        </div>

        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 text-center col-span-2 md:col-span-1 shadow-sm">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-emerald-400 tracking-tight">${epc}</h3>
          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Avg Earnings/Click</p>
        </div>
      </div>

      {/* Manual Revenue Reconciliation Form */}
      <div className="bg-[#060913] p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Affiliate Payouts &amp; Commission Ledger</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Active Offers: {offers.length}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Enter verified conversions and commission payouts reported by your affiliate networks (ClickBank, WarriorPlus, CJ, etc.) to keep your earnings ledger up to date.
        </p>

        <form onSubmit={handleSaveAccounting} className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-semibold">
                Total Verified Sales / Conversions:
              </label>
              <input
                type="number"
                min="0"
                value={conversionsInput}
                onChange={(e) => setConversionsInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-semibold">
                Total Net Commissions Earned ($ USD):
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={revenueInput}
                onChange={(e) => setRevenueInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono text-emerald-400 font-bold"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Earnings Ledger Updated!</span>
                </>
              ) : (
                <span>Save Ledger Updates</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all tracking stats and clear all click logs to 0?')) {
                  onUpdateMetrics(0, 0);
                  setConversionsInput('0');
                  setRevenueInput('0.00');
                  localStorage.removeItem('cashcaptin_click_events');
                  localStorage.setItem('cashcaptin_tracking', JSON.stringify({ clicks: 0, conversions: 0, revenue: 0 }));
                  window.location.reload();
                }
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-300 text-xs border border-slate-800 hover:border-red-500/30 transition cursor-pointer shrink-0"
            >
              Reset Tracking to 0
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
