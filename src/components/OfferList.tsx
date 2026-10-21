import React, { useState } from 'react';
import { Offer, MicroSearchTool, PlatformCopyStrategy } from '../types';
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Search,
  Trash2,
  ChevronDown,
  ChevronUp,
  Code,
  HelpCircle,
  KeyRound,
  FileText
} from 'lucide-react';

interface OfferListProps {
  offers: Offer[];
  onDeleteOffer: (id: string) => void;
  onRegenerateOffer: (offer: Offer) => Promise<void>;
  onTestSearchTool: (tool: MicroSearchTool, offer: Offer) => void;
  onViewOfferHub: (offer: Offer) => void;
}

export const OfferList: React.FC<OfferListProps> = ({
  offers,
  onDeleteOffer,
  onRegenerateOffer,
  onTestSearchTool,
  onViewOfferHub
}) => {
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(offers[0]?.id || null);
  const [activePlatformTab, setActivePlatformTab] = useState<Record<string, string>>({});
  const [showJsonView, setShowJsonView] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOfferId((prev) => (prev === id ? null : id));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegenerate = async (offer: Offer) => {
    setRegeneratingId(offer.id);
    try {
      await onRegenerateOffer(offer);
    } finally {
      setRegeneratingId(null);
    }
  };

  if (offers.length === 0) {
    return (
      <div className="bg-[#1e293b] rounded-lg p-8 border border-[#334155] shadow-lg text-center">
        <Tag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Offers Found</h3>
        <p className="text-xs text-[#94a3b8] mb-4">
          Add an affiliate offer above to generate promotional assets and search tools.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] rounded-lg p-5 border border-[#334155] shadow-lg mb-6">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#334155]">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            Active Offers & AI Platform Assets
          </h2>
          <p className="text-xs text-[#94a3b8]">
            Generated platform copywriting, compliance hooks, keywords, and micro search widgets
          </p>
        </div>
        <span className="text-xs font-mono text-[#38bdf8] bg-[#0f172a] px-2.5 py-1 rounded border border-[#334155]">
          {offers.length} active offer{offers.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-4">
        {offers.map((offer) => {
          const isExpanded = expandedOfferId === offer.id;
          const platformCopyData = offer.platform_copy;
          const platforms = platformCopyData?.target_platforms || ['Reddit', 'Facebook Groups', 'Quora', 'Twitter/X'];
          const selectedPlatform = activePlatformTab[offer.id] || platforms[0] || 'Reddit';
          const isJson = !!showJsonView[offer.id];

          const currentCopyObj = platformCopyData?.platform_copy?.[selectedPlatform];
          const copyText = typeof currentCopyObj === 'string'
            ? currentCopyObj
            : (currentCopyObj as PlatformCopyStrategy)?.copy || 'No copy generated for this platform.';
          const copyStrategy = typeof currentCopyObj === 'object' ? (currentCopyObj as PlatformCopyStrategy)?.strategy : undefined;
          const copyHook = typeof currentCopyObj === 'object' ? (currentCopyObj as PlatformCopyStrategy)?.hook : undefined;
          const copyVisual = typeof currentCopyObj === 'object' ? (currentCopyObj as PlatformCopyStrategy)?.visual_concept : undefined;

          return (
            <div
              key={offer.id}
              className="bg-[#0f172a] border border-[#334155] rounded-lg overflow-hidden transition-all shadow-sm"
            >
              {/* Card Header Row */}
              <div
                onClick={() => toggleExpand(offer.id)}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                      {offer.product_name}
                    </h3>
                    <code className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                      Tag: {offer.affiliate_id}
                    </code>
                    {offer.category && (
                      <span className="text-xs text-[#94a3b8] bg-[#1e293b] px-2 py-0.5 rounded border border-[#334155]">
                        {offer.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#94a3b8] line-clamp-1">
                    {offer.product_description}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-xs text-[#cbd5e1] font-mono bg-[#1e293b] px-3 py-1.5 rounded border border-[#334155]">
                    <span><strong className="text-white">{offer.clicks || 0}</strong> clicks</span>
                    <span className="text-slate-600">|</span>
                    <span><strong className="text-emerald-400">${(offer.revenue || 0).toFixed(2)}</strong></span>
                  </div>

                  <div className="text-[#94a3b8] hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-4 border-t border-[#334155] bg-[#1e293b]/40 space-y-4">
                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#334155]/60 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOfferHub(offer)}
                        className="px-3 py-1.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Dedicated Offer Hub</span>
                      </button>

                      <button
                        onClick={() =>
                          setShowJsonView((prev) => ({
                            ...prev,
                            [offer.id]: !prev[offer.id]
                          }))
                        }
                        className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-[#334155] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>{isJson ? 'Rich View' : 'Raw JSON View'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRegenerate(offer)}
                        disabled={regeneratingId === offer.id}
                        className="px-3 py-1.5 rounded bg-slate-800 text-sky-400 hover:bg-slate-700 border border-[#334155] font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${regeneratingId === offer.id ? 'animate-spin' : ''}`} />
                        <span>{regeneratingId === offer.id ? 'Regenerating...' : 'Regenerate AI Assets'}</span>
                      </button>

                      <button
                        onClick={() => onDeleteOffer(offer.id)}
                        className="px-2.5 py-1.5 rounded text-red-400 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        title="Delete this offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Micro Search Tools Section */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-sky-400" />
                      Generated Micro Search Tools ({platformCopyData?.micro_search_tools?.length || 0})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      {(platformCopyData?.micro_search_tools || []).map((tool, idx) => (
                        <div
                          key={idx}
                          className="bg-[#0f172a] p-3 rounded border border-[#334155] flex flex-col justify-between hover:border-blue-500/50 transition-colors"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-bold text-white truncate">
                                {tool.tool_title}
                              </span>
                              <span className="text-[10px] text-sky-400 font-mono bg-sky-950/60 px-1.5 py-0.2 rounded">
                                Tool #{idx + 1}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#94a3b8] line-clamp-2 mb-2">
                              {tool.target_intent}
                            </p>
                          </div>

                          <button
                            onClick={() => onTestSearchTool(tool, offer)}
                            className="w-full mt-2 py-1.5 px-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded text-xs font-semibold border border-blue-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Search className="w-3 h-3" />
                            <span>Launch Live Search Box</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform Copy Section */}
                  {isJson ? (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-[#94a3b8]">
                          platform_copy.json
                        </span>
                        <button
                          onClick={() => handleCopy(JSON.stringify(platformCopyData, null, 2), `json-${offer.id}`)}
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedKey === `json-${offer.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === `json-${offer.id}` ? 'Copied JSON!' : 'Copy Raw JSON'}</span>
                        </button>
                      </div>
                      <pre className="bg-[#0f172a] p-3 rounded-md border border-[#334155] text-xs text-[#38bdf8] overflow-x-auto max-h-64 font-mono leading-relaxed">
                        {JSON.stringify(platformCopyData, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-purple-400" />
                          Multi-Platform Copy & Strategy
                        </h4>

                        {/* Platform Selector Tabs */}
                        <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded border border-[#334155]">
                          {platforms.map((platform) => (
                            <button
                              key={platform}
                              onClick={() =>
                                setActivePlatformTab((prev) => ({
                                  ...prev,
                                  [offer.id]: platform
                                }))
                              }
                              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                                selectedPlatform === platform
                                  ? 'bg-[#3b82f6] text-white'
                                  : 'text-[#94a3b8] hover:text-white'
                              }`}
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#0f172a] p-3.5 rounded border border-[#334155] space-y-3">
                        <div className="flex items-center justify-between border-b border-[#334155]/60 pb-2">
                          <span className="text-xs font-semibold text-emerald-400">
                            {selectedPlatform} Compliance-Safe Promotional Content
                          </span>
                          <button
                            onClick={() => handleCopy(copyText, `${offer.id}-${selectedPlatform}`)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-white border border-[#334155] flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {copiedKey === `${offer.id}-${selectedPlatform}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Copied to Clipboard!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5 text-slate-300" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                        </div>

                        {copyHook && (
                          <div className="text-xs bg-purple-950/40 border border-purple-800/40 p-2.5 rounded text-purple-200">
                            <strong className="text-purple-300 block mb-0.5">Hook:</strong>
                            {copyHook}
                          </div>
                        )}

                        <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans bg-slate-900/50 p-3 rounded border border-slate-800">
                          {copyText}
                        </div>

                        {copyVisual && (
                          <div className="text-xs bg-amber-950/30 border border-amber-800/30 p-2.5 rounded text-amber-200">
                            <strong className="text-amber-300 block mb-0.5">Visual Concept:</strong>
                            {copyVisual}
                          </div>
                        )}

                        {copyStrategy && (
                          <div className="text-xs text-[#94a3b8] pt-1">
                            <strong className="text-[#cbd5e1]">Strategic Distribution:</strong> {copyStrategy}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Keywords & Questions footer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-[#0f172a] p-3 rounded border border-[#334155]">
                      <span className="text-xs font-bold text-[#cbd5e1] flex items-center gap-1 mb-2">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        High-Intent Buyer Keywords
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(platformCopyData?.keywords || offer.keywords || []).map((kw, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#0f172a] p-3 rounded border border-[#334155]">
                      <span className="text-xs font-bold text-[#cbd5e1] flex items-center gap-1 mb-2">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                        Pain-Point Buyer Questions
                      </span>
                      <ul className="text-xs text-[#94a3b8] space-y-1 list-disc list-inside">
                        {(platformCopyData?.questions || []).slice(0, 3).map((q, i) => (
                          <li key={i} className="truncate">
                            {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
