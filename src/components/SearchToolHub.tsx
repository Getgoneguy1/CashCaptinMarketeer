import React, { useState } from 'react';
import { Offer, MicroSearchTool } from '../types';
import { SearchToolWidget } from './SearchToolWidget';
import {
  FolderGit2,
  Search,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Layers,
  Tag,
  CheckCircle2
} from 'lucide-react';

interface SearchToolHubProps {
  offers: Offer[];
  selectedOffer: Offer | null;
  onSelectOffer: (offer: Offer | null) => void;
  onExecuteSearch: (offer: Offer, tool: MicroSearchTool, query: string, targetUrl: string) => void;
}

export const SearchToolHub: React.FC<SearchToolHubProps> = ({
  offers,
  selectedOffer,
  onSelectOffer,
  onExecuteSearch
}) => {
  const [activeTool, setActiveTool] = useState<MicroSearchTool | null>(null);

  // If a specific offer is selected, render the Offer Hub view (matches generate_index_html in main.py)
  if (selectedOffer) {
    const tools = selectedOffer.platform_copy?.micro_search_tools || [];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              onSelectOffer(null);
              setActiveTool(null);
            }}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-[#334155]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Master Directory</span>
          </button>

          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/50">
            Hub: output/{selectedOffer.product_name.toLowerCase().replace(/[^a-z0-9]/g, '_')}/index.html
          </span>
        </div>

        {/* Hub Header */}
        <div className="bg-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Dedicated Offer Hub</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
            {selectedOffer.product_name} Hub
          </h1>

          <p className="text-sm text-[#94a3b8] max-w-md mx-auto mb-4">
            {selectedOffer.product_description}
          </p>

          <div className="flex items-center justify-center gap-3 text-xs text-[#cbd5e1]">
            <span className="px-2.5 py-1 rounded bg-[#0f172a] border border-[#334155]">
              Affiliate Tag: <strong className="text-sky-300 font-mono">{selectedOffer.affiliate_id}</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#0f172a] border border-[#334155]">
              {tools.length} Micro Search Tool{tools.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Active Tool Interactive Tester */}
        {activeTool ? (
          <div className="flex flex-col items-center">
            <div className="w-full flex justify-end mb-2">
              <button
                onClick={() => setActiveTool(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close Widget Preview ✕
              </button>
            </div>
            <SearchToolWidget
              tool={activeTool}
              offer={selectedOffer}
              onExecuteSearch={(query, targetUrl) =>
                onExecuteSearch(selectedOffer, activeTool, query, targetUrl)
              }
            />
          </div>
        ) : (
          /* Tool List (Matches tool-card elements in main.py) */
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider px-1">
              Select a Micro-Search Tool to Launch & Test:
            </h3>

            {tools.map((tool, idx) => (
              <div
                key={idx}
                className="bg-[#1e293b] p-5 rounded-lg border border-[#334155] shadow-md hover:border-blue-500/60 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {tool.tool_title}
                    </h3>
                    <p className="text-xs text-[#94a3b8] mt-1">
                      {tool.target_intent}
                    </p>
                    <div className="mt-2 text-[11px] font-mono text-[#38bdf8] bg-[#0f172a] px-2 py-1 rounded border border-[#334155] inline-block">
                      Placeholder: "{tool.search_box_placeholder}"
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTool(tool)}
                    className="px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Open Search Box</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Master Root Directory View (Matches generate_master_manifest in main.py)
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-xl text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 mb-3">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Root Portal Homepage</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
          Affiliate Search Tools Directory
        </h1>

        <p className="text-sm text-[#94a3b8] max-w-md mx-auto mb-4">
          Master directory linking to all generated micro search hubs and promotional bridges.
        </p>

        <span className="text-xs font-mono text-[#38bdf8] bg-[#0f172a] px-3 py-1 rounded border border-[#334155]">
          Manifest: output/manifest.json ({offers.length} Offer Hubs)
        </span>
      </div>

      <div className="space-y-3">
        {offers.map((offer) => {
          const slug = offer.product_name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const toolsCount = offer.platform_copy?.micro_search_tools?.length || 0;

          return (
            <div
              key={offer.id}
              onClick={() => onSelectOffer(offer)}
              className="bg-[#1e293b] p-5 rounded-lg border border-[#334155] shadow-md hover:border-blue-500/80 hover:bg-slate-800/50 transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {offer.product_name}
                  </h3>
                  <span className="text-xs text-sky-400 font-mono bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                    Tag: {offer.affiliate_id}
                  </span>
                </div>
                <p className="text-xs text-[#94a3b8] line-clamp-1">
                  {offer.product_description}
                </p>
                <div className="text-[11px] text-[#64748b] font-mono">
                  Hub path: output/{slug}/index.html
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 bg-[#0f172a] px-2.5 py-1 rounded border border-[#334155] whitespace-nowrap">
                  {toolsCount} Search Tool{toolsCount > 1 ? 's' : ''}
                </span>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                  <ExternalLink className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
