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
      <div className="bg-[#0c1222] rounded-2xl p-8 border border-slate-800 shadow-xl text-center">
        <Tag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Offers Found</h3>
        <p className="text-xs text-slate-400 mb-4">
          Add an affiliate offer above to generate promotional assets and search tools.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl mb-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Active Offers & AI Platform Assets
          </h2>
          <p className="text-xs text-slate-400">
            Generated platform copywriting, compliance hooks, keywords, and micro search widgets
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-[#060913] px-3 py-1 rounded-xl border border-slate-800">
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
              className="bg-[#060913] border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md hover:border-slate-700"
            >
              {/* Card Header Row */}
              <div
                onClick={() => toggleExpand(offer.id)}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/60 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  {offer.image_url && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                      <img
                        src={offer.image_url}
                        alt={offer.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white hover:text-emerald-400 transition-colors">
                        {offer.product_name}
                      </h3>
                      <code className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                        Tag: {offer.affiliate_id}
                      </code>
                      {offer.category && (
                        <span className="text-xs text-slate-300 bg-[#0c1222] px-2 py-0.5 rounded border border-slate-800">
                          {offer.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {offer.product_description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-200 font-mono bg-[#0c1222] px-3.5 py-1.5 rounded-xl border border-slate-800">
                    <span><strong className="text-white">{offer.clicks || 0}</strong> clicks</span>
                    <span className="text-slate-600">|</span>
                    <span><strong className="text-amber-400">${(offer.revenue || 0).toFixed(2)}</strong></span>
                  </div>

                  <div className="text-slate-400 hover:text-white transition-colors">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800 bg-[#0c1222]/80 space-y-4">
                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewOfferHub(offer)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/40 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
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
                        className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Code className="w-3.5 h-3.5" />
                        <span>{isJson ? 'Rich View' : 'Raw JSON View'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRegenerate(offer)}
                        disabled={regeneratingId === offer.id}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${regeneratingId === offer.id ? 'animate-spin' : ''}`} />
                        <span>{regeneratingId === offer.id ? 'Regenerating...' : 'Regenerate AI Assets'}</span>
                      </button>

                      <button
                        onClick={() => onDeleteOffer(offer.id)}
                        className="px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/40 hover:border-rose-900/40 border border-transparent font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        title="Delete this offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Micro Search Tools Section */}
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-emerald-400" />
                      Generated Micro Search Tools ({platformCopyData?.micro_search_tools?.length || 0})
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(platformCopyData?.micro_search_tools || []).map((tool, idx) => (
                        <div
                          key={idx}
                          className="bg-[#060913] p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-xs font-bold text-white truncate">
                                {tool.tool_title}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                Tool #{idx + 1}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                              {tool.target_intent}
                            </p>
                          </div>

                          <button
                            onClick={() => onTestSearchTool(tool, offer)}
                            className="w-full mt-2 py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
                        <span className="text-xs font-semibold text-slate-400">
                          platform_copy.json
                        </span>
                        <button
                          onClick={() => handleCopy(JSON.stringify(platformCopyData, null, 2), `json-${offer.id}`)}
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          {copiedKey === `json-${offer.id}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === `json-${offer.id}` ? 'Copied JSON!' : 'Copy Raw JSON'}</span>
                        </button>
                      </div>
                      <pre className="bg-[#060913] p-4 rounded-xl border border-slate-800 text-xs text-emerald-400 overflow-x-auto max-h-64 font-mono leading-relaxed">
                        {JSON.stringify(platformCopyData, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          Multi-Platform Copy & Strategy
                        </h4>

                        {/* Platform Selector Tabs */}
                        <div className="flex items-center gap-1 bg-[#060913] p-1 rounded-xl border border-slate-800">
                          {platforms.map((platform) => (
                            <button
                              key={platform}
                              onClick={() =>
                                setActivePlatformTab((prev) => ({
                                  ...prev,
                                  [offer.id]: platform
                                }))
                              }
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                selectedPlatform === platform
                                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-xs font-semibold text-emerald-400">
                            {selectedPlatform} Compliance-Safe Promotional Content
                          </span>
                          <button
                            onClick={() => handleCopy(copyText, `${offer.id}-${selectedPlatform}`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors font-semibold"
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
                          <div className="text-xs bg-[#0c1222] border border-slate-800 p-3 rounded-xl text-slate-200">
                            <strong className="text-emerald-400 block mb-0.5">Hook:</strong>
                            {copyHook}
                          </div>
                        )}

                        <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans bg-[#0c1222] p-3.5 rounded-xl border border-slate-800">
                          {copyText}
                        </div>

                        {copyVisual && (
                          <div className="text-xs bg-[#0c1222] border border-slate-800 p-3 rounded-xl text-slate-200">
                            <strong className="text-amber-400 block mb-0.5">Visual Concept:</strong>
                            {copyVisual}
                          </div>
                        )}

                        {copyStrategy && (
                          <div className="text-xs text-slate-400 pt-1">
                            <strong className="text-slate-200">Strategic Distribution:</strong> {copyStrategy}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Keywords & Questions footer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mb-2">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        High-Intent Buyer Keywords
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(platformCopyData?.keywords || offer.keywords || []).map((kw, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-lg bg-[#0c1222] text-slate-300 border border-slate-800"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mb-2">
                        <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                        Pain-Point Buyer Questions
                      </span>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
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
