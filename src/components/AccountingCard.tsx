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
    <div className="bg-[#1e293b] rounded-lg p-5 border border-[#334155] shadow-lg mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#334155]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Accounting & Performance
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Real-time click tracking, conversion accounting, and EPC analytics
          </p>
        </div>
        <span className="text-xs font-mono text-[#94a3b8] bg-[#0f172a] px-2.5 py-1 rounded border border-[#334155]">
          Port 8080/8081 Engine
        </span>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <div className="bg-[#0f172a] p-3.5 rounded-md border border-[#334155]/60 text-center">
          <div className="flex items-center justify-center text-blue-400 mb-1">
            <MousePointerClick className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{tracking.clicks}</h3>
          <p className="text-xs text-[#94a3b8] uppercase font-semibold mt-0.5">Clicks</p>
        </div>

        <div className="bg-[#0f172a] p-3.5 rounded-md border border-[#334155]/60 text-center">
          <div className="flex items-center justify-center text-purple-400 mb-1">
            <Target className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{tracking.conversions}</h3>
          <p className="text-xs text-[#94a3b8] uppercase font-semibold mt-0.5">Conversions</p>
        </div>

        <div className="bg-[#0f172a] p-3.5 rounded-md border border-[#334155]/60 text-center">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-400 tracking-tight">
            ${tracking.revenue.toFixed(2)}
          </h3>
          <p className="text-xs text-[#94a3b8] uppercase font-semibold mt-0.5">Revenue</p>
        </div>

        <div className="bg-[#0f172a] p-3.5 rounded-md border border-[#334155]/60 text-center">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Percent className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-extrabold text-white tracking-tight">{conversionRate}%</h3>
          <p className="text-xs text-[#94a3b8] uppercase font-semibold mt-0.5">Conv. Rate</p>
        </div>

        <div className="bg-[#0f172a] p-3.5 rounded-md border border-[#334155]/60 text-center col-span-2 md:col-span-1">
          <div className="flex items-center justify-center text-sky-400 mb-1">
            <ArrowUpRight className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-extrabold text-sky-400 tracking-tight">${epc}</h3>
          <p className="text-xs text-[#94a3b8] uppercase font-semibold mt-0.5">EPC (Earnings/Click)</p>
        </div>
      </div>

      {/* Forms grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Update Metrics Form (Matches original /update_metrics) */}
        <div className="bg-[#0f172a]/70 p-4 rounded-md border border-[#334155]">
          <h4 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
            Update Accounting Ledger
          </h4>
          <form onSubmit={handleSaveAccounting} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#cbd5e1] mb-1 font-medium">
                  Update Conversions:
                </label>
                <input
                  type="number"
                  min="0"
                  value={conversionsInput}
                  onChange={(e) => setConversionsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#cbd5e1] mb-1 font-medium">
                  Update Total Revenue ($):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={revenueInput}
                  onChange={(e) => setRevenueInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Ledger Saved!</span>
                </>
              ) : (
                <span>Save Accounting Data</span>
              )}
            </button>
          </form>
        </div>

        {/* Live Click Simulator & Direct Action (Matches original track.py /click) */}
        <div className="bg-[#0f172a]/70 p-4 rounded-md border border-[#334155]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
              Simulate Tracked Affiliate Click
            </h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Auto-increments clicks
            </span>
          </div>

          <form onSubmit={handleExecuteSimulatedClick} className="space-y-3">
            <div>
              <label className="block text-xs text-[#cbd5e1] mb-1 font-medium">
                Target Offer:
              </label>
              <select
                value={selectedOfferId}
                onChange={(e) => setSelectedOfferId(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6]"
              >
                {offers.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.product_name} ({o.affiliate_id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#cbd5e1] mb-1 font-medium">
                Search Query Payload:
              </label>
              <input
                type="text"
                value={simQuery}
                onChange={(e) => setSimQuery(e.target.value)}
                placeholder="e.g., buyer traffic, apy calculator..."
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MousePointerClick className="w-4 h-4 text-blue-400" />
                <span>Simulate Click</span>
              </button>

              <button
                type="button"
                onClick={handleQuickConversion}
                className="py-2 px-3 bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 rounded-md text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="Log a simulated conversion sale for this offer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Log Sale ($38)</span>
              </button>
            </div>
          </form>

          {simFeedback && (
            <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
              {simFeedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
