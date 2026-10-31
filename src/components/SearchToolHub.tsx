import React, { useState } from 'react';
import { Offer, MicroSearchTool } from '../types';
import { SearchToolWidget } from './SearchToolWidget';
import {
  FolderGit2,
  Search,
  ExternalLink,
  ArrowLeft,
  Sparkles,
  Layers
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
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Master Directory</span>
          </button>

          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3.5 py-1.5 rounded-xl border border-emerald-800/50 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live Offer Hub</span>
          </span>
        </div>

        {/* Hub Header */}
        <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Dedicated Offer Hub</span>
          </div>

          <h1 className="text-2xl font-black text-white tracking-tight">
            {selectedOffer.product_name} Hub
          </h1>

          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {selectedOffer.product_description}
          </p>

          <div className="flex items-center justify-center gap-3 text-xs text-slate-300 pt-1">
            <span className="px-3 py-1.5 rounded-xl bg-[#060913] border border-slate-800 font-mono">
              Affiliate Tag: <strong className="text-emerald-400">{selectedOffer.affiliate_id}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#060913] border border-slate-800 font-mono">
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
                className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer"
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
          /* Tool List */
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Select a Micro-Search Tool to Launch & Test:
            </h3>

            {tools.map((tool, idx) => (
              <div
                key={idx}
                className="bg-[#0c1222] p-5 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {tool.tool_title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {tool.target_intent}
                    </p>
                    <div className="mt-2 text-[11px] font-mono text-emerald-400 bg-[#060913] px-2.5 py-1 rounded-lg border border-slate-800 inline-block">
                      Placeholder: "{tool.search_box_placeholder}"
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTool(tool)}
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-950" />
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

  // Master Root Directory View
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>Root Portal Homepage</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Affiliate Search Tools Directory
        </h1>

        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Master directory linking to all generated micro search hubs and promotional bridges.
        </p>

        <span className="text-xs font-bold text-emerald-400 bg-[#060913] px-3.5 py-1.5 rounded-xl border border-slate-800 inline-flex items-center gap-1.5 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{offers.length} Active Offer Hubs Published</span>
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
              className="bg-[#0c1222] p-5 rounded-2xl border border-slate-800 shadow-md hover:border-slate-700 hover:bg-slate-900/60 transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {offer.product_name}
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    Tag: {offer.affiliate_id}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {offer.product_description}
                </p>
                <div className="text-[11px] text-slate-500 font-mono">
                  Hub path: output/{slug}/index.html
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 bg-[#060913] px-3 py-1 rounded-xl border border-slate-800 whitespace-nowrap font-mono">
                  {toolsCount} Search Tool{toolsCount > 1 ? 's' : ''}
                </span>
                <span className="text-emerald-400 group-hover:translate-x-1 transition-transform">
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
