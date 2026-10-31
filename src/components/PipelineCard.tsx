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
    <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Pipeline & Deployment
          </h2>
          <p className="text-xs text-slate-400">
            Automated batch builder for platform marketing copy, micro-search tools, and hub portals
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onViewHubs}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Hub Directory</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Active Offer Hubs</span>
            <p className="text-xl font-black text-white">{offers.length} Published</p>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Micro Search Tools</span>
            <p className="text-xl font-black text-emerald-400">{totalTools} Widgets</p>
          </div>
          <FileCode className="w-6 h-6 text-emerald-400 opacity-80" />
        </div>

        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">Master Manifest</span>
            <p className="text-xl font-black text-white">Synchronized</p>
          </div>
          <Layers className="w-6 h-6 text-emerald-400 opacity-80" />
        </div>
      </div>

      {/* Main Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onRebuild}
          disabled={isBuilding}
          className={`w-full py-3.5 px-4 rounded-xl font-black text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-base ${
            isBuilding
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99]'
          }`}
        >
          <RefreshCw className={`w-5 h-5 text-slate-950 ${isBuilding ? 'animate-spin' : ''}`} />
          <span>{isBuilding ? 'Executing AI Generation Pipeline...' : 'Rebuild All Search Tools & Hubs'}</span>
        </button>
      </div>

      {/* Build Terminal Output Emulator */}
      <div className="bg-[#060913] rounded-xl border border-slate-800 p-4">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>pipeline_runner.sh stdout</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">Live</span>
        </div>

        <div className="font-mono text-xs space-y-1 max-h-36 overflow-y-auto text-slate-300">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-slate-500">[{log.timestamp}]</span>
              <span
                className={
                  log.type === 'success' || log.status === 'success'
                    ? 'text-emerald-400'
                    : log.type === 'error' || log.status === 'error'
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }
              >
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
