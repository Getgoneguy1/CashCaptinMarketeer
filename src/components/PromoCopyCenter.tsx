import React, { useState } from 'react';
import { Offer, PlatformCopyStrategy } from '../types';
import { Copy, Check, Sparkles, MessageSquare, Share2, HelpCircle, Flame, Search } from 'lucide-react';

interface PromoCopyCenterProps {
  offers: Offer[];
  onOpenSearchTool: (offer: Offer) => void;
}

export const PromoCopyCenter: React.FC<PromoCopyCenterProps> = ({
  offers,
  onOpenSearchTool
}) => {
  const [selectedOfferId, setSelectedOfferId] = useState<string>(offers[0]?.id || '');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('Reddit');
  const [copied, setCopied] = useState(false);

  const currentOffer = offers.find((o) => o.id === selectedOfferId) || offers[0];

  if (!currentOffer) {
    return (
      <div className="bg-[#0c1222] p-8 rounded-2xl border border-slate-800 text-center text-slate-400 shadow-xl">
        No offers available. Add an offer first.
      </div>
    );
  }

  const platforms = currentOffer.platform_copy?.target_platforms || ['Reddit', 'Facebook Groups', 'Quora', 'Twitter/X'];
  const platformData = currentOffer.platform_copy?.platform_copy?.[selectedPlatform];

  const copyText = typeof platformData === 'string'
    ? platformData
    : (platformData as PlatformCopyStrategy)?.copy || 'No copy generated for this platform.';
  const strategyTip = typeof platformData === 'object' ? (platformData as PlatformCopyStrategy)?.strategy : undefined;
  const hookText = typeof platformData === 'object' ? (platformData as PlatformCopyStrategy)?.hook : undefined;
  const visualConcept = typeof platformData === 'object' ? (platformData as PlatformCopyStrategy)?.visual_concept : undefined;

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Selector Card */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              1-Click Ready-to-Post Copy
            </h2>
            <p className="text-xs text-slate-400">
              Compliance-safe social posts, replies, and hooks engineered to drive clicks without bans
            </p>
          </div>

          {currentOffer.platform_copy?.micro_search_tools?.[0] && (
            <button
              onClick={() => onOpenSearchTool(currentOffer)}
              className="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Launch Live Search Tool</span>
            </button>
          )}
        </div>

        {/* Step 1: Pick Offer */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Step 1: Select Your Offer
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {offers.map((offer) => (
                <button
                  key={offer.id}
                  onClick={() => setSelectedOfferId(offer.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                    currentOffer.id === offer.id
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-[#060913] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{offer.product_name}</p>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-1">
                    Tag: {offer.affiliate_id}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Pick Social Platform */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
              Step 2: Choose Social Channel
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedPlatform === platform
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-[#060913] text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {platform === 'Reddit' && <MessageSquare className="w-3.5 h-3.5 text-orange-400" />}
                  {platform === 'Facebook Groups' && <Share2 className="w-3.5 h-3.5 text-blue-400" />}
                  {platform === 'Quora' && <HelpCircle className="w-3.5 h-3.5 text-red-400" />}
                  {platform === 'Twitter/X' && <Flame className="w-3.5 h-3.5 text-sky-400" />}
                  <span>{platform}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copy Output Display */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Ready to Paste on {selectedPlatform}
            </span>
            <p className="text-xs text-slate-400">
              Promoting: <strong className="text-white">{currentOffer.product_name}</strong>
            </p>
          </div>

          <button
            onClick={handleCopy}
            className={`py-2.5 px-5 rounded-xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-950" />
                <span>Copy Post to Clipboard</span>
              </>
            )}
          </button>
        </div>

        {hookText && (
          <div className="bg-[#060913] border border-slate-800 p-3.5 rounded-xl text-xs text-slate-200">
            <strong className="text-emerald-400 block mb-1">Attention-Grabbing Hook:</strong>
            {hookText}
          </div>
        )}

        <div className="bg-[#060913] p-4 sm:p-5 rounded-xl border border-slate-800 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed font-sans shadow-inner">
          {copyText}
        </div>

        {visualConcept && (
          <div className="bg-[#060913] border border-slate-800 p-3.5 rounded-xl text-xs text-slate-200">
            <strong className="text-amber-400 block mb-1">Suggested Image / Visual Pairing:</strong>
            {visualConcept}
          </div>
        )}

        {strategyTip && (
          <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong className="text-slate-200">Where & When to Post:</strong> {strategyTip}
          </div>
        )}
      </div>
    </div>
  );
};
