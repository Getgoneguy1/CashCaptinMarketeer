import React from 'react';
import { ClickEvent, Offer } from '../types';
import { MousePointerClick, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface ClickTrackerLogProps {
  clickEvents: ClickEvent[];
  offers: Offer[];
  onTriggerConversion?: (offerId: string, amount: number, clickId: string) => void;
}

export const ClickTrackerLog: React.FC<ClickTrackerLogProps> = ({
  clickEvents,
  offers
}) => {
  return (
    <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-emerald-400" />
            <span>Real-Time Visitor Clicks &amp; Traffic Logs</span>
          </h2>
          <p className="text-xs text-slate-400">
            Records incoming traffic to your affiliate links and placed campaigns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-[#060913] px-3 py-1 rounded-xl border border-emerald-500/30">
            {clickEvents.length} Recorded {clickEvents.length === 1 ? 'Click' : 'Clicks'}
          </span>
        </div>
      </div>

      {clickEvents.length === 0 ? (
        <div className="bg-[#060913] p-8 rounded-xl border border-slate-800 text-center text-slate-400 space-y-2">
          <MousePointerClick className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-white">No Clicks Recorded Yet</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            When users click your placed affiliate links across Reddit, Forums, or Social channels, click records will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#060913] text-slate-400 uppercase font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Time</th>
                <th className="py-3 px-3">Offer Name</th>
                <th className="py-3 px-3">Affiliate Tag</th>
                <th className="py-3 px-3">Traffic Source</th>
                <th className="py-3 px-3">Destination Link</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {clickEvents.map((evt) => {
                const dateStr = new Date(evt.timestamp).toLocaleTimeString();
                return (
                  <tr key={evt.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {evt.offerName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {evt.affiliateId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {evt.query ? (
                        <span className="bg-[#060913] px-2.5 py-1 rounded-lg text-emerald-400 border border-slate-800 font-mono">
                          {evt.query}
                        </span>
                      ) : (
                        <span className="text-slate-400">Direct Link Click</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300 max-w-xs truncate">
                      <a
                        href={evt.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline hover:text-emerald-400 flex items-center gap-1"
                      >
                        <span className="truncate">{evt.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-emerald-400" />
                      </a>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {evt.converted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Converted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          Tracked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
