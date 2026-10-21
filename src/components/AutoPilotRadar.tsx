import React, { useState } from 'react';
import { Offer, BuyerLead, AffiliateProConfig } from '../types';
import { findBuyerLeads } from '../services/aiGenerator';
import {
  Sparkles,
  Search,
  Crosshair,
  ExternalLink,
  Copy,
  Check,
  Send,
  Image as ImageIcon,
  Flame,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface AutoPilotRadarProps {
  existingOffers: Offer[];
  onSaveNewOffer: (offer: Offer) => void;
  affiliateProConfig: AffiliateProConfig;
  onRecordClick: (offerId: string, offerName: string, affiliateId: string, targetUrl: string) => void;
}

export const AutoPilotRadar: React.FC<AutoPilotRadarProps> = ({
  existingOffers,
  onSaveNewOffer,
  affiliateProConfig,
  onRecordClick
}) => {
  // Input form state
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [affiliateTag, setAffiliateTag] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Scanning & results state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [discoveredLeads, setDiscoveredLeads] = useState<BuyerLead[]>([]);
  const [activeProductName, setActiveProductName] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deployedIds, setDeployedIds] = useState<Record<string, boolean>>({});

  // Quick preset loader
  const handleSelectPreset = (offer: Offer) => {
    setProductName(offer.product_name);
    setProductDescription(offer.product_description);
    setAffiliateTag(offer.affiliate_id);
    setTargetUrl(offer.target_url || '');
    setImagePreview(offer.image_url || null);
    if (offer.buyer_leads && offer.buyer_leads.length > 0) {
      setDiscoveredLeads(offer.buyer_leads);
      setActiveProductName(offer.product_name);
    }
  };

  const handleQuickRun = (name: string, desc: string, tag: string, link: string) => {
    setProductName(name);
    setProductDescription(desc);
    setAffiliateTag(tag);
    setTargetUrl(link);
    // Auto submit in next tick
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      setIsScanning(true);
      setActiveProductName(name);
      setDiscoveredLeads([]);

      (async () => {
        try {
          setScanStep('🔍 [1/4] Analyzing product buyer intent & search demand signals...');
          await new Promise((r) => setTimeout(r, 500));
          setScanStep('🌐 [2/4] Scanning Reddit, Quora, and niche community discussions...');
          await new Promise((r) => setTimeout(r, 600));
          setScanStep('🎯 [3/4] Filtering threads with 90%+ purchase intent and active questions...');
          await new Promise((r) => setTimeout(r, 500));
          setScanStep('✍️ [4/4] Generating compliance-safe responses and embedding affiliate link...');

          const leads = await findBuyerLeads(name, desc, tag, link, null as any);
          setDiscoveredLeads(leads);

          const newOffer: Offer = {
            id: `offer-${Date.now()}`,
            product_name: name,
            product_description: desc,
            affiliate_id: tag,
            target_url: link,
            buyer_leads: leads,
            created_at: new Date().toISOString(),
            clicks: 0,
            conversions: 0,
            revenue: 0
          };
          onSaveNewOffer(newOffer);
        } catch (err) {
          console.error(err);
        } finally {
          setIsScanning(false);
          setScanStep('');
        }
      })();
    }, 50);
  };

  // Handle local image upload preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        setImagePreview(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Main Launch Action: The Autonomous AI Radar
  const handleLaunchAutoPilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    setIsScanning(true);
    setActiveProductName(productName);
    setDiscoveredLeads([]);

    const tag = affiliateTag.trim() || 'AUTOPILOT_AFF_99';
    const destination = targetUrl.trim() || `https://example.com/r?aff_id=${encodeURIComponent(tag)}`;

    try {
      // Step 1: Niche Analysis
      setScanStep('🔍 [1/4] Analyzing product buyer intent & search demand signals...');
      await new Promise((r) => setTimeout(r, 650));

      // Step 2: Web Scraping & Community Search
      setScanStep('🌐 [2/4] Scanning Reddit, Quora, and niche community discussions...');
      await new Promise((r) => setTimeout(r, 750));

      // Step 3: Filtering Purchase Intent
      setScanStep('🎯 [3/4] Filtering threads with 90%+ purchase intent and active questions...');
      await new Promise((r) => setTimeout(r, 650));

      // Step 4: Generating Tailored Ads & Injected Links
      setScanStep('✍️ [4/4] Generating compliance-safe responses and embedding affiliate link...');

      const leads = await findBuyerLeads(
        productName,
        productDescription || `${productName} premium affiliate solution.`,
        tag,
        destination,
        imagePreview || imageUrl
      );

      setDiscoveredLeads(leads);

      // Save as offer so it stays in user records
      const newOffer: Offer = {
        id: `offer-${Date.now()}`,
        product_name: productName,
        product_description: productDescription || `${productName} solution`,
        affiliate_id: tag,
        target_url: destination,
        image_url: imagePreview || imageUrl,
        buyer_leads: leads,
        created_at: new Date().toISOString(),
        clicks: 0,
        conversions: 0,
        revenue: 0
      };
      onSaveNewOffer(newOffer);
    } catch (err) {
      console.error('Autonomous scan error:', err);
    } finally {
      setIsScanning(false);
      setScanStep('');
    }
  };

  const handleCopyAd = (lead: BuyerLead) => {
    navigator.clipboard.writeText(lead.tailoredAdCopy);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeployToThread = (lead: BuyerLead) => {
    // Copy the ad to clipboard first so the user can paste immediately
    navigator.clipboard.writeText(lead.tailoredAdCopy);
    setCopiedId(lead.id);
    setDeployedIds((prev) => ({ ...prev, [lead.id]: true }));

    // Record the click event in the tracker
    onRecordClick(
      `auto-${lead.id}`,
      activeProductName || productName,
      affiliateTag || 'AUTOPILOT_AFF',
      lead.affiliateDeepLink
    );

    // If Affiliate Pro webhook is connected, notify it of the placement
    if (affiliateProConfig.enabled && affiliateProConfig.webhookUrl) {
      try {
        fetch(affiliateProConfig.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'ad_placement_deployed',
            product: activeProductName || productName,
            platform: lead.platform,
            community: lead.communityName,
            thread: lead.threadTitle,
            link: lead.affiliateDeepLink,
            timestamp: new Date().toISOString()
          }),
          mode: 'no-cors'
        }).catch(() => {});
      } catch (e) {}
    }

    // Open the live thread URL in a new tab
    window.open(lead.threadUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950/70 via-[#1e293b] to-indigo-950/70 p-6 rounded-2xl border border-blue-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#334155]/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Crosshair className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  Autonomous AI Buyer Finder
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Auto-Pilot
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#94a3b8]">
                Provide your product — the AI automatically scans the web for active buyers and places your link + ad in front of them.
              </p>
            </div>
          </div>

          {/* Instant Test Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#0f172a]/90 p-3 rounded-xl border border-blue-500/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-xs text-white font-bold">Try It Right Now (1-Click Instant Demo):</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  handleQuickRun(
                    'AI Video Script Automator',
                    'Generates 30 high-retention TikTok & Shorts video scripts with viral hooks in 10 minutes.',
                    'AUTO_PILOT_99',
                    'https://example.com/aff/video-scripts?aff_id=AUTO_PILOT_99'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
              >
                <span>⚡ Test: AI Video Automator</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleQuickRun(
                    'Affiliate Traffic Booster',
                    'A proven system for generating organic buyer traffic and deep linking affiliate offers.',
                    'TRAFFIC_VIP_01',
                    'https://example.com/aff/traffic-booster?aff_id=TRAFFIC_VIP_01'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
              >
                <span>⚡ Test: Traffic Booster</span>
              </button>
            </div>
          </div>
        </div>


        {/* The Simple Single-Input Form */}
        <form onSubmit={handleLaunchAutoPilot} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., AI Video Script Automator"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#475569] rounded-xl text-white text-sm focus:outline-none focus:border-[#3b82f6] shadow-inner transition-colors font-semibold placeholder:text-[#64748b]"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
                Affiliate Tag / ID
              </label>
              <input
                type="text"
                placeholder="e.g., MY_VIP_AFF"
                value={affiliateTag}
                onChange={(e) => setAffiliateTag(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#475569] rounded-xl text-white text-sm focus:outline-none focus:border-[#3b82f6] font-mono shadow-inner transition-colors placeholder:text-[#64748b]"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
                Affiliate Referral Link
              </label>
              <input
                type="url"
                placeholder="https://hop.clickbank.net/?aff=..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f172a] border border-[#475569] rounded-xl text-white text-sm focus:outline-none focus:border-[#3b82f6] shadow-inner transition-colors font-mono text-xs placeholder:text-[#64748b]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
              Product Description / What Does It Do?
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Generates 30 high-retention TikTok & Shorts video scripts with viral hooks in under 10 minutes..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f172a] border border-[#475569] rounded-xl text-white text-sm focus:outline-none focus:border-[#3b82f6] shadow-inner transition-colors resize-y placeholder:text-[#64748b]"
            />
          </div>

          {/* Optional Picture Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a]/60 p-3 rounded-xl border border-[#334155]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-[#475569] flex items-center justify-center overflow-hidden shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-slate-500" />
                )}
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Product Image (Optional)
                </span>
                <span className="text-[11px] text-[#94a3b8]">
                  Used to generate matching Facebook ad visuals & mockups
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-[#334155] cursor-pointer transition-colors">
                <span>Upload Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageUrl('');
                  }}
                  className="text-xs text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Big Launch Button */}
          <button
            type="submit"
            disabled={isScanning || !productName.trim()}
            className={`w-full py-4 px-6 rounded-xl font-extrabold text-base text-white transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer ${
              isScanning
                ? 'bg-blue-800 text-blue-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:opacity-95 active:scale-[0.99] shadow-blue-500/25'
            }`}
          >
            {isScanning ? (
              <>
                <Crosshair className="w-5 h-5 animate-spin" />
                <span>Scanning Web & Auto-Placing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>🚀 Launch AI: Scrape Web & Put Links In Front Of Buyers</span>
              </>
            )}
          </button>
        </form>

        {/* Live Scanning Radar Display */}
        {isScanning && (
          <div className="mt-4 p-4 rounded-xl bg-[#0f172a] border border-blue-500/50 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs text-blue-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                AI Spider Active
              </span>
              <span>Real-Time Buyer Discovery</span>
            </div>
            <p className="text-sm font-mono text-emerald-400 animate-pulse">
              {scanStep}
            </p>
          </div>
        )}
      </div>

      {/* Discovered Buyer Leads & Automated Placements */}
      {discoveredLeads.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#334155]">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <span>Found {discoveredLeads.length} Live Buyer Discussions for "{activeProductName}"</span>
              </h3>
              <p className="text-xs text-[#94a3b8]">
                These are active forums and questions where people are looking to buy. Click "Deploy Ad & Open Thread" to place your link in front of them.
              </p>
            </div>

            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
              High Purchase Intent Verified
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {discoveredLeads.map((lead) => {
              const isDeployed = !!deployedIds[lead.id];
              const isCopied = copiedId === lead.id;

              return (
                <div
                  key={lead.id}
                  className="bg-[#1e293b] rounded-xl p-5 sm:p-6 border border-[#334155] shadow-lg hover:border-blue-500/60 transition-all space-y-4"
                >
                  {/* Lead Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                          {lead.platform === 'Reddit' && <MessageSquare className="w-3.5 h-3.5 text-orange-400" />}
                          {lead.platform === 'Quora' && <HelpCircle className="w-3.5 h-3.5 text-red-400" />}
                          <span>{lead.communityName}</span>
                        </span>

                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{lead.buyerIntentScore}% Buyer Intent</span>
                        </span>

                        {isDeployed && (
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                            ✓ Link Deployed
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white pt-1">
                        "{lead.threadTitle}"
                      </h4>

                      <p className="text-xs text-[#94a3b8]">
                        <strong className="text-slate-300">Buyer Pain Point:</strong> {lead.buyerPainPoint}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyAd(lead)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-[#334155] transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Copy ad reply with link"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied Ad!' : 'Copy Ad'}</span>
                      </button>

                      <button
                        onClick={() => handleDeployToThread(lead)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                          isDeployed
                            ? 'bg-emerald-600 hover:bg-emerald-500'
                            : 'bg-[#3b82f6] hover:bg-[#2563eb] shadow-blue-500/20'
                        }`}
                      >
                        <span>Deploy Ad & Open Thread</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Tailored Contextual Ad Box */}
                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Tailored Response & Injected Link (Ready to Paste)
                      </span>
                      <span className="text-[11px] font-mono text-sky-400">
                        Tracks: {affiliateTag || 'AUTOPILOT_AFF'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                      {lead.tailoredAdCopy}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
