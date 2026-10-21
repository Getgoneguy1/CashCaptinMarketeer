import React from 'react';
import { ClickEvent, Offer } from '../types';
import { MousePointerClick, CheckCircle, ExternalLink, ShieldCheck, DollarSign } from 'lucide-react';

interface ClickTrackerLogProps {
  clickEvents: ClickEvent[];
  offers: Offer[];
  onTriggerConversion: (offerId: string, amount: number, clickId: string) => void;
}

export const ClickTrackerLog: React.FC<ClickTrackerLogProps> = ({
  clickEvents,
  offers,
  onTriggerConversion
}) => {
  return (
    <div className="bg-[#1e293b] rounded-lg p-5 border border-[#334155] shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 mb-4 border-b border-[#334155]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MousePointerClick className="w-5 h-5 text-blue-400" />
            Click Tracker & Real-Time Redirect Logs
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Records every incoming micro-search query, affiliate tag injection, and conversion attribution
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-[#0f172a] px-3 py-1 rounded border border-[#334155]">
          Port 8081 /click listener active
        </span>
      </div>

      {clickEvents.length === 0 ? (
        <div className="bg-[#0f172a] p-8 rounded border border-[#334155] text-center text-[#94a3b8]">
          <MousePointerClick className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-white mb-1">No Click Events Recorded Yet</p>
          <p className="text-xs">
            Test any micro-search tool or use the Simulator in the Control Center to record live clicks.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-[#94a3b8] uppercase font-semibold border-b border-[#334155]">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Offer Name</th>
                <th className="py-2.5 px-3">Affiliate Tag</th>
                <th className="py-2.5 px-3">Search Query</th>
                <th className="py-2.5 px-3">Target Deep Link</th>
                <th className="py-2.5 px-3 text-right">Attribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {clickEvents.map((evt) => {
                const dateStr = new Date(evt.timestamp).toLocaleTimeString();
                return (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-[#94a3b8] font-mono whitespace-nowrap">
                      {dateStr}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {evt.offerName}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {evt.affiliateId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {evt.query ? (
                        <span className="bg-[#0f172a] px-2 py-1 rounded text-sky-300 border border-[#334155]">
                          "{evt.query}"
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Direct redirect</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-[#38bdf8] max-w-xs truncate">
                      <a
                        href={evt.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        <span className="truncate">{evt.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {evt.converted ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          Converted
                        </span>
                      ) : (
                        <button
                          onClick={() => onTriggerConversion(evt.offerId, 38.00, evt.id)}
                          className="px-2 py-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 rounded font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                          title="Attribute a $38 sale to this click"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Attribute Sale</span>
                        </button>
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
