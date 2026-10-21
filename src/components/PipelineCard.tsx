import React from 'react';
import { BuildLogEntry, Offer } from '../types';
import { Terminal, RefreshCw, Layers, CheckCircle2, FileCode, ExternalLink } from 'lucide-react';

interface PipelineCardProps {
  offers: Offer[];
  logs: BuildLogEntry[];
  isBuilding: boolean;
  onRebuild: () => void;
  onViewHubs: () => void;
}

export const PipelineCard: React.FC<PipelineCardProps> = ({
  offers,
  logs,
  isBuilding,
  onRebuild,
  onViewHubs
}) => {
  const totalTools = offers.reduce(
    (acc, o) => acc + (o.platform_copy?.micro_search_tools.length || 0),
    0
  );

  return (
    <div className="bg-[#1e293b] rounded-lg p-5 border border-[#334155] shadow-lg mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 mb-4 border-b border-[#334155]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Pipeline & Deployment
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Automated batch builder for platform marketing copy, micro-search tools, and hub portals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewHubs}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Hub Directory</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-[#0f172a] p-3 rounded-md border border-[#334155]/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#94a3b8]">Active Offer Hubs</span>
            <p className="text-xl font-bold text-white">{offers.length} Published</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#0f172a] p-3 rounded-md border border-[#334155]/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#94a3b8]">Micro Search Tools</span>
            <p className="text-xl font-bold text-sky-400">{totalTools} Widgets</p>
          </div>
          <FileCode className="w-6 h-6 text-sky-400 opacity-80" />
        </div>

        <div className="bg-[#0f172a] p-3 rounded-md border border-[#334155]/60 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#94a3b8]">Master Manifest</span>
            <p className="text-xl font-bold text-emerald-400">Synchronized</p>
          </div>
          <Layers className="w-6 h-6 text-purple-400 opacity-80" />
        </div>
      </div>

      {/* Main Action Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={onRebuild}
          disabled={isBuilding}
          className={`w-full py-3 px-4 rounded-md font-bold text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-base ${
            isBuilding
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-[#10b981] hover:bg-[#059669] active:scale-[0.99]'
          }`}
        >
          <RefreshCw className={`w-5 h-5 ${isBuilding ? 'animate-spin' : ''}`} />
          <span>{isBuilding ? 'Executing AI Generation Pipeline...' : 'Rebuild All Search Tools & Hubs'}</span>
        </button>
      </div>

      {/* Build Terminal Output Emulator */}
      <div className="bg-[#0f172a] rounded-md border border-[#334155] p-3">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#334155]/60 text-xs text-[#94a3b8]">
          <div className="flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>pipeline_runner.sh stdout</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Live</span>
        </div>

        <div className="font-mono text-xs text-[#38bdf8] space-y-1 max-h-48 overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <div className="text-[#64748b] italic py-2">
              Ready. Click "Rebuild All Search Tools & Hubs" to regenerate all assets.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="leading-relaxed">
                <span className="text-[#64748b] mr-2">[{log.timestamp}]</span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-[#34d399]'
                      : log.type === 'error'
                      ? 'text-[#f87171]'
                      : 'text-[#38bdf8]'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
