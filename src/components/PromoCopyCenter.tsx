import React, { useState } from 'react';
import { Offer, BuyerLead } from '../types';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Save,
  X,
  Flame,
  ShieldCheck,
  Layers,
  MessageSquare,
  Search,
  PlusCircle
} from 'lucide-react';
import { generateAutonomousBuyerLeads } from '../services/aiGenerator';

interface PromoCopyCenterProps {
  offers: Offer[];
  onUpdateOffer?: (updatedOffer: Offer) => void;
  onOpenSearchTool?: (offer: Offer) => void;
}

export const PromoCopyCenter: React.FC<PromoCopyCenterProps> = ({
  offers,
  onUpdateOffer,
  onOpenSearchTool
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>(offers[0]?.id || '');
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editedCopy, setEditedCopy] = useState<string>('');
  const [editedHook, setEditedHook] = useState<string>('');
  const [editedVoiceover, setEditedVoiceover] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);

  const currentOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  if (!currentOffer) {
    return (
      <div className="bg-[#0c1222] p-8 rounded-2xl border border-slate-800 text-center text-slate-400 shadow-xl max-w-3xl mx-auto space-y-3">
        <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
        <h3 className="text-base font-bold text-white">No Offers Active</h3>
        <p className="text-xs text-slate-400">
          Enter an offer in AI Auto-Pilot to verify the ad copy placed on each site.
        </p>
      </div>
    );
  }

  // Placed leads or fallback generation
  const placedLeads: BuyerLead[] = currentOffer.buyer_leads && currentOffer.buyer_leads.length > 0
    ? currentOffer.buyer_leads
    : generateAutonomousBuyerLeads(
        currentOffer.product_name,
        currentOffer.product_description,
        currentOffer.affiliate_id,
        currentOffer.target_url || 'https://example.com'
      );

  const handleStartEdit = (lead: BuyerLead) => {
    setEditingLeadId(lead.id);
    setEditedCopy(lead.tailoredAdCopy);
    setEditedHook(lead.videoScript?.hook || lead.viralHook || '');
    setEditedVoiceover(lead.videoScript?.voiceoverScript || '');
  };

  const handleSaveEdit = (leadId: string) => {
    const updatedLeads = placedLeads.map((lead) => {
      if (lead.id !== leadId) return lead;

      const updatedLead: BuyerLead = {
        ...lead,
        tailoredAdCopy: editedCopy.trim() || lead.tailoredAdCopy
      };

      if (lead.adType === 'video_ad' || lead.videoScript) {
        updatedLead.viralHook = editedHook.trim() || lead.viralHook;
        updatedLead.videoScript = {
          hook: editedHook.trim() || (lead.videoScript?.hook || ''),
          visualDirection: lead.videoScript?.visualDirection || '[Screen recording showing fast result]',
          voiceoverScript: editedVoiceover.trim() || (lead.videoScript?.voiceoverScript || editedCopy),
          caption: lead.videoScript?.caption || editedCopy
        };
      }

      return updatedLead;
    });

    const updatedOffer: Offer = {
      ...currentOffer,
      buyer_leads: updatedLeads
    };

    if (onUpdateOffer) {
      onUpdateOffer(updatedOffer);
    }

    setEditingLeadId(null);
    setSaveSuccessId(leadId);
    setTimeout(() => setSaveSuccessId(null), 2500);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner: Verification & Edit Center */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>Ad Copy &amp; Placement Verification</span>
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                {placedLeads.length} Sites Placed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verify the exact ad copy the AI placed on each site. Inspect the live thread, test your link, and edit any ad copy if desired.
            </p>
          </div>

          {currentOffer.platform_copy?.micro_search_tools?.[0] && onOpenSearchTool && (
            <button
              onClick={() => onOpenSearchTool(currentOffer)}
              className="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Launch Live Search Tool</span>
            </button>
          )}
        </div>

        {/* Product Selector */}
        {offers.length > 1 && (
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Product:
            </label>
            <div className="flex flex-wrap gap-2">
              {offers.map((offer) => (
                <button
                  key={offer.id}
                  onClick={() => {
                    setSelectedOfferId(offer.id);
                    setEditingLeadId(null);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    currentOffer.id === offer.id
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                      : 'bg-[#060913] text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{offer.product_name}</span>
                  <span className="text-[10px] font-mono opacity-80 font-normal">
                    ({offer.buyer_leads?.length || 6} sites)
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Offer Overview Bar */}
        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Active Product Being Promoted:</span>
            <strong className="text-white text-sm">{currentOffer.product_name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Destination Affiliate Link:</span>
            <code className="text-emerald-400 font-mono font-bold">
              {currentOffer.target_url || 'https://example.com'}
            </code>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700/80 text-emerald-400 font-mono text-[11px]">
            ● Verified Active on All Sites
          </div>
        </div>
      </div>

      {/* Sites Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
        <span className="text-slate-400 font-bold whitespace-nowrap">Filter Sites:</span>
        {[
          { id: 'all', label: `🌐 All Sites (${placedLeads.length})` },
          { id: 'video_ad', label: '🎬 Video Ads (TikTok / Shorts)' },
          { id: 'community', label: '💬 Community (Reddit / Quora)' },
          { id: 'want_ads', label: '🛒 Want Ads & Classifieds' },
          { id: 'b2b', label: '🏢 B2B & Wholesale' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPlatform(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              filterPlatform === tab.id
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'bg-[#060913] text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List of Sites and Placed Ads */}
      <div className="space-y-4">
        {placedLeads
          .filter((lead) => {
            if (filterPlatform === 'all') return true;
            if (filterPlatform === 'video_ad') return lead.adType === 'video_ad' || lead.platform.toLowerCase().includes('video') || lead.platform.toLowerCase().includes('tiktok');
            if (filterPlatform === 'community') return lead.platform === 'Reddit' || lead.platform === 'Quora' || lead.channelCategory === 'community';
            if (filterPlatform === 'want_ads') return lead.channelCategory === 'want_ads' || lead.platform.toLowerCase().includes('want');
            if (filterPlatform === 'b2b') return lead.channelCategory === 'b2b_commodities' || lead.channelCategory === 'saas_digital';
            return true;
          })
          .map((lead) => {
            const isEditing = editingLeadId === lead.id;
            const isCopied = copiedId === lead.id;
            const isSaved = saveSuccessId === lead.id;

            return (
              <div
                key={lead.id}
                className="bg-[#0c1222] p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition shadow-xl space-y-3"
              >
                {/* Header row: Site Name + Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Platform Badge */}
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {lead.platform}
                    </span>

                    {/* Community / Subreddit */}
                    <span className="text-xs text-slate-300 font-medium">
                      {lead.communityName}
                    </span>

                    {/* Status Badge */}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      ● Placed &amp; Live
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* Inspect Site button */}
                    {lead.threadUrl && (
                      <a
                        href={lead.threadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-semibold cursor-pointer"
                        title="Inspect the live thread or site inquiry"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Inspect Site</span>
                      </a>
                    )}

                    {/* Copy Ad button */}
                    <button
                      onClick={() => handleCopy(lead.tailoredAdCopy, lead.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{isCopied ? 'Copied!' : 'Copy Ad'}</span>
                    </button>

                    {/* Edit Ad button */}
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(lead)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-bold text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1 cursor-pointer"
                        title="Edit this ad copy directly"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Edit Ad</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Target Discussion / Inquiry */}
                <div className="bg-[#060913] p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">
                    Target Buyer Thread / Topic on {lead.platform}:
                  </span>
                  <p className="font-bold text-white text-xs sm:text-sm">
                    "{lead.threadTitle}"
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong className="text-slate-300">Buyer Need:</strong> {lead.buyerPainPoint}
                  </p>
                </div>

                {/* Placed Ad Body or Edit Mode */}
                {isEditing ? (
                  /* INLINE EDITOR */
                  <div className="bg-[#0f172a] p-4 rounded-xl border border-emerald-500/50 space-y-3">
                    <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                        <span>Editing Ad for {lead.platform}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Customize wording, hooks, or calls to action
                      </span>
                    </div>

                    {/* If Video Ad, allow editing hook & voiceover separately */}
                    {(lead.adType === 'video_ad' || lead.videoScript) && (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1">
                            ⚡ 3-Second Viral Hook:
                          </label>
                          <input
                            type="text"
                            value={editedHook}
                            onChange={(e) => setEditedHook(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-purple-500/50 rounded-lg text-xs text-white focus:outline-none focus:border-purple-400"
                            placeholder="Opening 3-second hook"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                            🎙️ Spoken Voiceover Script:
                          </label>
                          <textarea
                            rows={3}
                            value={editedVoiceover}
                            onChange={(e) => setEditedVoiceover(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 resize-y"
                            placeholder="Fast-paced 30-second voiceover lines"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Full Ad Copy (with link embedded):
                      </label>
                      <textarea
                        rows={4}
                        value={editedCopy}
                        onChange={(e) => setEditedCopy(e.target.value)}
                        className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-sans focus:outline-none focus:border-emerald-500 leading-relaxed resize-y"
                        placeholder="Write the ad copy..."
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                      <button
                        onClick={() => setEditingLeadId(null)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-white font-bold cursor-pointer transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(lead.id)}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Save className="w-3.5 h-3.5 text-slate-950" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* DISPLAY MODE (Video Breakdown or Text Ad) */
                  <div className="space-y-2">
                    {lead.adType === 'video_ad' || lead.videoScript ? (
                      /* Video Ad Display */
                      <div className="bg-[#0f172a] p-4 rounded-xl border border-purple-500/40 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5 text-purple-400 font-bold">
                            <Flame className="w-4 h-4 text-purple-400" />
                            <span>Viral Video Ad Placed</span>
                          </span>
                          <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                            TikTok / Shorts / Reels
                          </span>
                        </div>

                        {/* Viral Hook */}
                        <div className="bg-purple-950/40 p-3 rounded-lg border border-purple-500/30 text-xs space-y-1">
                          <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block">
                            ⚡ 3-Second Scroll-Stopping Hook:
                          </span>
                          <p className="text-white font-bold text-sm">
                            "{lead.videoScript?.hook || lead.viralHook || `Stop scrolling if you need ${currentOffer.product_name}!`}"
                          </p>
                        </div>

                        {/* Direction & Voiceover */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                              🎬 Scene Direction:
                            </span>
                            <p className="text-slate-300 text-[11px]">
                              {lead.videoScript?.visualDirection || '[Screen demo showing immediate result]'}
                            </p>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                              🎙️ Voiceover Script:
                            </span>
                            <p className="text-slate-300 text-[11px]">
                              {lead.videoScript?.voiceoverScript || lead.tailoredAdCopy}
                            </p>
                          </div>
                        </div>

                        {/* Caption & Link */}
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                            🔗 Post Caption &amp; Embedded Link:
                          </span>
                          <p className="text-slate-200 text-xs font-mono">
                            {lead.videoScript?.caption || lead.tailoredAdCopy}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Text Ad / Community Recommendation Display */
                      <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700/80 space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Placed Ad Copy on {lead.platform}</span>
                          </span>
                          <a
                            href={currentOffer.target_url || 'https://example.com'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-emerald-300 hover:text-emerald-200 underline flex items-center gap-1 cursor-pointer font-bold"
                          >
                            <span>Link: {currentOffer.target_url}</span>
                            <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
                          </a>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                          {lead.tailoredAdCopy}
                        </p>
                      </div>
                    )}

                    {isSaved && (
                      <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Ad copy successfully updated and saved!</span>
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
};
