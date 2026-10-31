import React, { useState } from 'react';
import { TrackingMetrics, Offer } from '../types';
import { MousePointerClick, DollarSign, Target, Percent, ArrowUpRight, PlusCircle, Check } from 'lucide-react';

interface AccountingCardProps {
  tracking: TrackingMetrics;
  offers: Offer[];
  onUpdateMetrics: (conversions: number, revenue: number) => void;
  onSimulateClick: (offerId: string, customQuery?: string) => void;
  onRecordConversion: (offerId: string, amount: number) => void;
}

export const AccountingCard: React.FC<AccountingCardProps> = ({
  tracking,
  offers,
  onUpdateMetrics,
  onSimulateClick,
  onRecordConversion
}) => {
  const [conversionsInput, setConversionsInput] = useState<string>(tracking.conversions.toString());
  const [revenueInput, setRevenueInput] = useState<string>(tracking.revenue.toFixed(2));
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  // Click simulator state
  const [selectedOfferId, setSelectedOfferId] = useState<string>(offers[0]?.id || '');
  const [simQuery, setSimQuery] = useState<string>('buyer traffic blueprint');
  const [simFeedback, setSimFeedback] = useState<string | null>(null);

  // Quick conversion state
  const [convAmount, setConvAmount] = useState<string>('38.00');

  const handleSaveAccounting = (e: React.FormEvent) => {
    e.preventDefault();
    const conv = parseInt(conversionsInput, 10) || 0;
    const rev = parseFloat(revenueInput) || 0;
    onUpdateMetrics(conv, rev);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleExecuteSimulatedClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferId) return;
    onSimulateClick(selectedOfferId, simQuery);
    const offer = offers.find(o => o.id === selectedOfferId);
    setSimFeedback(`Recorded simulated click for "${offer?.product_name}" (Affiliate Tag: ${offer?.affiliate_id})`);
    setTimeout(() => setSimFeedback(null), 3000);
  };

  const handleQuickConversion = () => {
    if (!selectedOfferId) return;
    const amt = parseFloat(convAmount) || 25.00;
    onRecordConversion(selectedOfferId, amt);
    setConversionsInput((prev) => (parseInt(prev, 10) + 1).toString());
    setRevenueInput((prev) => (parseFloat(prev) + amt).toFixed(2));
    const offer = offers.find(o => o.id === selectedOfferId);
    setSimFeedback(`🎉 Logged $${amt.toFixed(2)} sale for "${offer?.product_name}"!`);
    setTimeout(() => setSimFeedback(null), 3000);
  };

  const conversionRate = tracking.clicks > 0
    ? ((tracking.conversions / tracking.clicks) * 100).toFixed(1)
    : '0.0';

  const epc = tracking.clicks > 0
    ? (tracking.revenue / tracking.clicks).toFixed(2)
    : '0.00';

  return (
    <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl mb-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Accounting & Performance
          </h2>
          <p className="text-xs text-slate-400">
            Real-time click tracking, conversion accounting, and EPC analytics
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-[#060913] px-3 py-1 rounded-xl border border-slate-800">
          Port 8080/8081 Engine
        </span>
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
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-black text-amber-400 tracking-tight">
            ${tracking.revenue.toFixed(2)}
          </h3>
          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">Revenue</p>
        </div>

        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 text-center shadow-sm">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
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
          <p className="text-xs text-slate-400 uppercase font-semibold mt-0.5">EPC</p>
        </div>
      </div>

      {/* Forms grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
        {/* Update Metrics Form */}
        <div className="bg-[#060913] p-5 rounded-2xl border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Update Accounting Ledger
          </h4>
          <form onSubmit={handleSaveAccounting} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">
                  Update Conversions:
                </label>
                <input
                  type="number"
                  min="0"
                  value={conversionsInput}
                  onChange={(e) => setConversionsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">
                  Update Total Revenue ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={revenueInput}
                  onChange={(e) => setRevenueInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-mono text-amber-400 font-bold"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-sm font-black transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Ledger Saved!</span>
                </>
              ) : (
                <span>Save Accounting Data</span>
              )}
            </button>
          </form>
        </div>

        {/* Live Click Simulator & Direct Action */}
        <div className="bg-[#060913] p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Simulate Tracked Affiliate Click
            </h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/40 font-mono">
              Auto-increments clicks
            </span>
          </div>

          <form onSubmit={handleExecuteSimulatedClick} className="space-y-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-semibold">
                Target Offer:
              </label>
              <select
                value={selectedOfferId}
                onChange={(e) => setSelectedOfferId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.product_name} ({o.affiliate_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1 font-semibold">
                Search Query Payload:
              </label>
              <input
                type="text"
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                placeholder="e.g., buyer traffic, apy calculator..."
                className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
                <span>Simulate Click</span>
              </button>

              <button
                type="button"
                onClick={handleQuickConversion}
                className="py-2 px-3.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Log a simulated conversion sale for this offer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>+ Log Sale ($38)</span>
              </button>
            </div>
          </form>

          {simFeedback && (
            <div className="mt-2 text-xs text-emerald-400 bg-emerald-950/70 p-2.5 rounded-xl border border-emerald-800/40">
              {simFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
