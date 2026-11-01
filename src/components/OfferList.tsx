import React, { useState } from 'react';
import { Offer, MicroSearchTool, PlatformCopyStrategy, BuyerLead } from '../types';
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
  FileText,
  Edit3,
  Save,
  X,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { generateAutonomousBuyerLeads } from '../services/aiGenerator';

interface OfferListProps {
  offers: Offer[];
  onDeleteOffer: (id: string) => void;
  onRegenerateOffer: (offer: Offer) => Promise<void>;
  onTestSearchTool: (tool: MicroSearchTool, offer: Offer) => void;
  onViewOfferHub: (offer: Offer) => void;
  onUpdateOffer?: (updatedOffer: Offer) => void;
}

export const OfferList: React.FC<OfferListProps> = ({
  offers,
  onDeleteOffer,
  onRegenerateOffer,
  onTestSearchTool,
  onViewOfferHub,
  onUpdateOffer
}) => {
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(offers[0]?.id || null);
  const [activePlatformTab, setActivePlatformTab] = useState<Record<string, string>>({});
  const [showJsonView, setShowJsonView] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);

  // Placed ad editing state
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editedLeadCopy, setEditedLeadCopy] = useState<string>('');
  const [editedLeadHook, setEditedLeadHook] = useState<string>('');
  const [editedLeadVoiceover, setEditedLeadVoiceover] = useState<string>('');
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);

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

  const handleStartEditLead = (lead: BuyerLead) => {
    setEditingLeadId(lead.id);
    setEditedLeadCopy(lead.tailoredAdCopy);
    setEditedLeadHook(lead.videoScript?.hook || lead.viralHook || '');
    setEditedLeadVoiceover(lead.videoScript?.voiceoverScript || '');
  };

  const handleSaveLeadEdit = (offer: Offer, leadId: string) => {
    const leads = offer.buyer_leads && offer.buyer_leads.length > 0
      ? offer.buyer_leads
      : generateAutonomousBuyerLeads(offer.product_name, offer.product_description, offer.affiliate_id, offer.target_url || 'https://example.com');

    const updatedLeads = leads.map((lead) => {
      if (lead.id !== leadId) return lead;
      const updated: BuyerLead = {
        ...lead,
        tailoredAdCopy: editedLeadCopy.trim() || lead.tailoredAdCopy
      };
      if (lead.adType === 'video_ad' || lead.videoScript) {
        updated.viralHook = editedLeadHook.trim() || lead.viralHook;
        updated.videoScript = {
          hook: editedLeadHook.trim() || (lead.videoScript?.hook || ''),
          visualDirection: lead.videoScript?.visualDirection || '[Screen demo showing immediate result]',
          voiceoverScript: editedLeadVoiceover.trim() || (lead.videoScript?.voiceoverScript || editedLeadCopy),
          caption: lead.videoScript?.caption || editedLeadCopy
        };
      }
      return updated;
    });

    const updatedOffer: Offer = {
      ...offer,
      buyer_leads: updatedLeads
    };

    if (onUpdateOffer) {
      onUpdateOffer(updatedOffer);
    }

    setEditingLeadId(null);
    setSaveSuccessId(leadId);
    setTimeout(() => setSaveSuccessId(null), 2500);
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

                  {/* Placed Sites & Promotional Ad Copy (with Edit Capability) */}
                  {(() => {
                    const placedLeads = offer.buyer_leads && offer.buyer_leads.length > 0
                      ? offer.buyer_leads
                      : generateAutonomousBuyerLeads(offer.product_name, offer.product_description, offer.affiliate_id, offer.target_url || 'https://example.com');

                    return (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Placed Sites &amp; Promotional Copy ({placedLeads.length} Outlets)</span>
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Verify what the AI placed for each spot and edit any promotional copy directly.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
                            ● Placed &amp; Active
                          </span>
                        </div>

                        <div className="space-y-3">
                          {placedLeads.map((lead) => {
                            const isEditing = editingLeadId === lead.id;
                            const isSaved = saveSuccessId === lead.id;

                            return (
                              <div
                                key={lead.id}
                                className="bg-[#060913] p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/70">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                      {lead.platform}
                                    </span>
                                    <span className="text-xs text-slate-300 font-medium">
                                      {lead.communityName}
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                      ● Placed
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 self-start sm:self-auto">
                                    {lead.threadUrl && (
                                      <a
                                        href={lead.threadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>Inspect Site</span>
                                      </a>
                                    )}

                                    <button
                                      onClick={() => handleCopy(lead.tailoredAdCopy, `lead-${lead.id}`)}
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                                    >
                                      {copiedKey === `lead-${lead.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                                      <span>{copiedKey === `lead-${lead.id}` ? 'Copied!' : 'Copy Ad'}</span>
                                    </button>

                                    {!isEditing && (
                                      <button
                                        onClick={() => handleStartEditLead(lead)}
                                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
                                      >
                                        <Edit3 className="w-3 h-3 text-emerald-400" />
                                        <span>Edit Copy</span>
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Target Thread */}
                                <div className="text-xs text-slate-300">
                                  <span className="text-slate-500 block text-[10px] uppercase font-mono font-bold">Target Discussion:</span>
                                  <strong className="text-white">"{lead.threadTitle}"</strong>
                                </div>

                                {/* Placed Ad Body or Editor */}
                                {isEditing ? (
                                  <div className="bg-[#0f172a] p-3.5 rounded-xl border border-emerald-500/50 space-y-2.5">
                                    {(lead.adType === 'video_ad' || lead.videoScript) && (
                                      <div className="space-y-2">
                                        <div>
                                          <label className="block text-[10px] font-bold text-purple-300 uppercase tracking-wider mb-1">
                                            ⚡ 3-Second Viral Hook:
                                          </label>
                                          <input
                                            type="text"
                                            value={editedLeadHook}
                                            onChange={(e) => setEditedLeadHook(e.target.value)}
                                            className="w-full px-3 py-1.5 bg-slate-900 border border-purple-500/50 rounded-lg text-xs text-white focus:outline-none focus:border-purple-400"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                                            🎙️ Spoken Voiceover Script:
                                          </label>
                                          <textarea
                                            rows={2}
                                            value={editedLeadVoiceover}
                                            onChange={(e) => setEditedLeadVoiceover(e.target.value)}
                                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    <div>
                                      <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                                        Promotional Ad Copy (with link embedded):
                                      </label>
                                      <textarea
                                        rows={3}
                                        value={editedLeadCopy}
                                        onChange={(e) => setEditedLeadCopy(e.target.value)}
                                        className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-sans focus:outline-none focus:border-emerald-500 leading-relaxed"
                                      />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                                      <button
                                        onClick={() => setEditingLeadId(null)}
                                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white font-bold cursor-pointer transition"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleSaveLeadEdit(offer, lead.id)}
                                        className="px-3.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                                      >
                                        <Save className="w-3 h-3 text-slate-950" />
                                        <span>Save Copy</span>
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    {lead.adType === 'video_ad' || lead.videoScript ? (
                                      <div className="bg-[#0f172a] p-3 rounded-lg border border-purple-500/30 text-xs space-y-2">
                                        <div className="text-[11px] text-purple-300 font-bold flex items-center gap-1">
                                          <Flame className="w-3.5 h-3.5 text-purple-400" />
                                          <span>Hook: "{lead.videoScript?.hook || lead.viralHook}"</span>
                                        </div>
                                        <p className="text-slate-300 text-xs leading-relaxed">
                                          {lead.videoScript?.voiceoverScript || lead.tailoredAdCopy}
                                        </p>
                                        <div className="text-[11px] font-mono text-emerald-400">
                                          Caption: {lead.videoScript?.caption || lead.tailoredAdCopy}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                                        {lead.tailoredAdCopy}
                                      </div>
                                    )}

                                    {isSaved && (
                                      <div className="mt-1.5 p-1.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span>Promotional copy saved!</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}

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
