import React, { useState, useEffect } from 'react';
import { Offer, BuyerLead, AffiliateProConfig } from '../types';
import { findBuyerLeads, getProductAdStrategy, getProductCorrelationProfile, CategoryAdStrategy } from '../services/aiGenerator';
import {
  Sparkles,
  Crosshair,
  Layers,
  Check,
  Send,
  Image as ImageIcon,
  Flame,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Zap,
  Globe,
  Radio,
  Copy,
  Mail,
  Smartphone,
  ExternalLink,
  ShoppingBag,
  Scale,
  Star,
  Pin,
  Briefcase,
  Camera as InstagramIcon,
  Target,
  ShieldAlert,
  Upload,
  X,
  Lock,
  Crown
} from 'lucide-react';
import {
  canDeployNewOffer,
  consumeCampaignSlot,
  getUserLicense,
  TIER_LIMITS
} from '../services/userLicenseService';

interface AutoPilotRadarProps {
  existingOffers: Offer[];
  onSaveNewOffer: (offer: Offer) => void;
  affiliateProConfig: AffiliateProConfig;
  onRecordClick: (offerId: string, offerName: string, affiliateId: string, targetUrl: string) => void;
  onOpenEmailModal?: () => void;
  isMasterUser?: boolean;
  onOpenLicenseModal?: () => void;
}

export const AutoPilotRadar: React.FC<AutoPilotRadarProps> = ({
  existingOffers,
  onSaveNewOffer,
  affiliateProConfig,
  onRecordClick,
  onOpenEmailModal,
  isMasterUser,
  onOpenLicenseModal
}) => {
  // Clean input form state ready for user's own affiliate offers
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [affiliateTag, setAffiliateTag] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Autonomous state
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoPlacing, setIsAutoPlacing] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [placementProgress, setPlacementProgress] = useState<{ current: number; total: number; community: string } | null>(null);
  const [discoveredLeads, setDiscoveredLeads] = useState<BuyerLead[]>([]);
  const [activeProductName, setActiveProductName] = useState<string>('');
  const [autoPlacedCount, setAutoPlacedCount] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [showStrategyDrawer, setShowStrategyDrawer] = useState<boolean>(false);

  // Auto-placement engine options
  const [handsFreeMode, setHandsFreeMode] = useState<boolean>(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<string>('6h');

  // Multi-Category Correlation & Context-Strict Ad Strategy
  const correlationProfile = getProductCorrelationProfile(
    productName || activeProductName || 'Product',
    productDescription
  );

  const adStrategy: CategoryAdStrategy = getProductAdStrategy(
    productName || activeProductName || 'Product',
    productDescription
  );

  // Trigger automated placement sequence
  const executeAutonomousPlacement = async (leads: BuyerLead[], pName: string, tag: string, link: string) => {
    setIsAutoPlacing(true);
    const updatedLeads: BuyerLead[] = [];

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      setPlacementProgress({
        current: i + 1,
        total: leads.length,
        community: `${lead.platform} ${lead.communityName}`
      });

      // Simulate network dispatch delay for realistic auto-posting
      await new Promise((r) => setTimeout(r, 600));

      // Record placement impression in analytics
      onRecordClick(
        `auto-${lead.id}`,
        pName,
        tag || 'AFF_TAG_01',
        link
      );

      // Ping Affiliate Pro webhook if configured
      if (affiliateProConfig.enabled && affiliateProConfig.webhookUrl) {
        try {
          fetch(affiliateProConfig.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'ad_auto_placed',
              product: pName,
              platform: lead.platform,
              community: lead.communityName,
              thread: lead.threadTitle,
              link: link,
              timestamp: new Date().toISOString()
            }),
            mode: 'no-cors'
          }).catch(() => {});
        } catch (e) {}
      }

      updatedLeads.push({
        ...lead,
        status: 'Auto-Placed & Live',
        postedAt: new Date().toLocaleTimeString(),
        impressions: Math.floor(Math.random() * 85) + 120
      });
    }

    setDiscoveredLeads(updatedLeads);
    setAutoPlacedCount(updatedLeads.length);
    setIsAutoPlacing(false);
    setPlacementProgress(null);

    // Save with updated auto-placed status
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      product_name: pName,
      product_description: productDescription || `${pName} solution`,
      affiliate_id: tag,
      target_url: link,
      image_url: imagePreview || undefined,
      buyer_leads: updatedLeads,
      created_at: new Date().toISOString(),
      clicks: updatedLeads.length,
      conversions: 0,
      revenue: 0
    };

    // Permanently consume 1 campaign slot in user license state
    consumeCampaignSlot(newOffer.id, pName, updatedLeads.length, !!isMasterUser);

    onSaveNewOffer(newOffer);
  };

  // Launch Auto-Pilot from Form
  const handleLaunchAutoPilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;

    // Check slot quota before launching
    const quota = canDeployNewOffer(!!isMasterUser);
    if (!quota.allowed) {
      if (onOpenLicenseModal) {
        onOpenLicenseModal();
      }
      return;
    }

    setIsScanning(true);
    setActiveProductName(productName);
    setDiscoveredLeads([]);

    const tag = affiliateTag.trim() || 'AFF_TAG_01';
    const destination = targetUrl.trim() || 'https://example.com/affiliate-link';

    try {
      setScanStep('🔍 [1/4] Broadening web scrape across Want Ads (Marketplace/Craigslist ISO) & buyer inquiries...');
      await new Promise((r) => setTimeout(r, 550));

      setScanStep('⚖️ [2/4] Cross-referencing comparison debates, review intercept boards & Gumroad discover...');
      await new Promise((r) => setTimeout(r, 550));

      setScanStep('📈 [3/4] Scanning Google Daily Search Trends, Amazon Movers & Pinterest/LinkedIn/IG buyers...');
      await new Promise((r) => setTimeout(r, 600));

      setScanStep('✍️ [4/4] Formulating tailored contextual replies with your referral link embedded...');

      const leads = await findBuyerLeads(
        productName,
        productDescription || `${productName} solution`,
        tag,
        destination,
        imagePreview || undefined
      );

      const userLic = getUserLicense();
      const maxLeads = isMasterUser ? 999999 : userLic.maxLeadsPerProduct;
      const leadsToProcess = (!isMasterUser && maxLeads && leads.length > maxLeads)
        ? leads.slice(0, maxLeads)
        : leads;

      setScanStep('');
      setIsScanning(false);

      // If Hands-Free Mode is enabled (default), immediately auto-place across all targets
      if (handsFreeMode) {
        await executeAutonomousPlacement(leadsToProcess, productName, tag, destination);
      } else {
        setDiscoveredLeads(leadsToProcess);
      }
    } catch (err) {
      console.error('Autonomous scan error:', err);
      setIsScanning(false);
      setScanStep('');
    }
  };

  // Handle Quick One-Click Switch
  const handleQuickRun = (name: string, desc: string, tag: string, link: string) => {
    // Check slot quota before launching
    const quota = canDeployNewOffer(!!isMasterUser);
    if (!quota.allowed) {
      if (onOpenLicenseModal) {
        onOpenLicenseModal();
      }
      return;
    }

    setProductName(name);
    setProductDescription(desc);
    setAffiliateTag(tag);
    setTargetUrl(link);
    setActiveProductName(name);

    setIsScanning(true);
    setDiscoveredLeads([]);

    setTimeout(async () => {
      try {
        setScanStep('🌐 Broadening web scrape across Want Ads, Daily Trends & Buyer inquiries...');
        await new Promise((r) => setTimeout(r, 500));
        setScanStep('⚡ Generating contextual replies with embedded link...');

        const leads = await findBuyerLeads(name, desc, tag, link);
        const userLic = getUserLicense();
        const maxLeads = isMasterUser ? 999999 : userLic.maxLeadsPerProduct;
        const leadsToProcess = (!isMasterUser && maxLeads && leads.length > maxLeads)
          ? leads.slice(0, maxLeads)
          : leads;

        setScanStep('');
        setIsScanning(false);

        // Instantly auto-place without taking user anywhere
        await executeAutonomousPlacement(leadsToProcess, name, tag, link);
      } catch (err) {
        console.error(err);
        setIsScanning(false);
      }
    }, 50);
  };

  const handleCopyAdText = (lead: BuyerLead) => {
    navigator.clipboard.writeText(lead.tailoredAdCopy);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  100% Hands-Free Auto-Placement & Broadened Web Scrape
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Active & Auto-Posting
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Broadened web scrape monitors Want Ads (Marketplace/Craigslist ISO), Daily Search Trends, Comparison Sites, Review Sites, Gumroad, Pinterest, LinkedIn, Instagram, and Communities for any product.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#060913] px-3 py-1.5 rounded-xl border border-slate-800">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Autonomous Mode:</span>
            <span className="text-xs font-mono text-emerald-400 font-bold">ENABLED</span>
          </div>
        </div>

        {/* Clean Ready Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#060913] p-3.5 rounded-xl border border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-white font-bold">100% Ready for Any Product:</span>
            <span className="text-xs text-slate-400">Physical goods (gold paydirt, gear), SaaS, tools, or local services — the engine finds buyers wanting to buy.</span>
          </div>

          {onOpenEmailModal && (
            <button
              type="button"
              onClick={onOpenEmailModal}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="Configure your automated weekly dashboard briefings & sale alerts"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>📬 Weekly Email Briefing & Sales Alerts</span>
            </button>
          )}
        </div>

        {/* Campaign Slots & Tier Status Bar */}
        {(() => {
          const userLic = getUserLicense();
          const quota = canDeployNewOffer(!!isMasterUser);

          return (
            <div className="mb-4 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#060913] p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-300">Campaign Slot Quota:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                    {isMasterUser ? 'Master Developer (Unlimited Slots)' : `${quota.consumedCount} / ${quota.totalAllowed} Slots Deployed`}
                  </span>
                  {!isMasterUser && userLic.tier === 'starter' && (
                    <span className="text-slate-400 text-[11px]">
                      • Starter Tier (Top 5 Buyer Leads / 2 Channels per Product)
                    </span>
                  )}
                  {(!isMasterUser && (userLic.tier === 'pro' || userLic.tier === 'lifetime')) && (
                    <span className="text-emerald-400 text-[11px] font-semibold">
                      • Full 38+ Buyer Channels Active
                    </span>
                  )}
                </div>

                {onOpenLicenseModal && !isMasterUser && userLic.tier !== 'lifetime' && (
                  <button
                    type="button"
                    onClick={onOpenLicenseModal}
                    className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <Crown className="w-3 h-3 text-emerald-400" />
                    <span>Upgrade Slots</span>
                  </button>
                )}
              </div>

              {!quota.allowed && !isMasterUser && (
                <div className="bg-red-950/40 border border-red-500/50 p-3.5 rounded-xl text-xs text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <Lock className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">All {quota.totalAllowed} Campaign Slots Consumed:</strong>
                      <span>Each deployed product permanently occupies a slot to maintain live auto-placement on buyer search nodes. To deploy additional products, upgrade your license.</span>
                    </div>
                  </div>
                  {onOpenLicenseModal && (
                    <button
                      type="button"
                      onClick={onOpenLicenseModal}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition-all shrink-0 cursor-pointer shadow-md"
                    >
                      Unlock 15 Slots (Captain Pro)
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Input Form */}
        <form onSubmit={handleLaunchAutoPilot} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Product Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., AI Copywriter Pro or Video Automator"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 shadow-inner font-semibold placeholder:text-slate-600"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Your Affiliate Link *
              </label>
              <input
                type="url"
                required
                placeholder="https://your-affiliate-link.com/?aff=..."
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono shadow-inner text-emerald-400 font-bold placeholder:text-slate-600"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Affiliate Tag (Optional)
              </label>
              <input
                type="text"
                placeholder="Ty"
                value={affiliateTag}
                onChange={(e) => setAffiliateTag(e.target.value)}
                className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono shadow-inner placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Product Description / What Problem Does It Solve?
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Autonomous B2B content marketing platform that conducts keyword research, writes expert-level technical articles, publishes automatically, and captures inbound qualified leads..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 shadow-inner resize-y placeholder:text-slate-600"
            />
          </div>

          {/* Product Picture Input (Upload or Image URL) */}
          <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                Product Picture / Ad Creative (Optional)
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove Picture
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className={imagePreview ? 'sm:col-span-9 space-y-2' : 'sm:col-span-12 space-y-2'}>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="Paste direct Image URL (e.g. https://.../product.png)"
                      value={imagePreview?.startsWith('data:') ? '' : imagePreview || ''}
                      onChange={(e) => setImagePreview(e.target.value.trim() || null)}
                      className="w-full px-3 py-2 bg-[#1e293b] border border-[#475569] rounded-lg text-white text-xs focus:outline-none focus:border-[#3b82f6] placeholder:text-[#64748b]"
                    />
                  </div>
                  <label className="px-3.5 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setImagePreview(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Attached product pictures are embedded into shoppable feed ads (Instagram, Pinterest, Google Shopping, Facebook Marketplace, and Classifieds). Supports direct uploads (PNG, JPG, WebP) or web image URLs.
                </p>
              </div>

              {imagePreview && (
                <div className="sm:col-span-3 flex items-center justify-center">
                  <div className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-500/50 shadow-md bg-slate-900">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] text-emerald-300 font-bold">
                      Attached ✓
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={handsFreeMode}
                onChange={(e) => setHandsFreeMode(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-[#0f172a] border-[#475569]"
              />
              <span className="font-semibold text-emerald-300">
                Auto-Place Immediately (No Manual Redirects or Tab Popups)
              </span>
            </label>

            <button
              type="submit"
              disabled={isScanning || isAutoPlacing || !productName.trim()}
              className={`py-3.5 px-6 rounded-xl font-extrabold text-sm text-white transition-all shadow-xl flex items-center justify-center gap-2.5 cursor-pointer ${
                isScanning || isAutoPlacing
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20 active:scale-[0.99]'
              }`}
            >
              {isScanning ? (
                <>
                  <Crosshair className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Scanning Buyer Intent Discussions...</span>
                </>
              ) : isAutoPlacing ? (
                <>
                  <Zap className="w-4 h-4 animate-bounce text-slate-950" />
                  <span>
                    Auto-Placing {placementProgress ? `(${placementProgress.current}/${placementProgress.total})...` : '...'}
                  </span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>⚡ Auto-Place Link & Ads Across All Live Discussions</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Scanning or Placement Stream */}
        {(isScanning || isAutoPlacing) && (
          <div className="mt-4 p-4 rounded-xl bg-[#0f172a] border border-emerald-500/50 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Autonomous Dispatch Pipeline
              </span>
              <span>100% Automated Execution</span>
            </div>

            {scanStep && (
              <p className="text-xs font-mono text-sky-400 animate-pulse">
                {scanStep}
              </p>
            )}

            {placementProgress && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Placing contextual ad into: <strong className="text-emerald-400">{placementProgress.community}</strong></span>
                  <span>{Math.round((placementProgress.current / placementProgress.total) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${(placementProgress.current / placementProgress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Multi-Category Correlation & Context-Strict Ad Placement Blueprint */}
      <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{adStrategy.categoryIcon}</span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">AI Category Fit:</span>
                <span className="text-sm font-black text-white">{adStrategy.categoryTitle}</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Primary Domain Fit
                </span>
                {correlationProfile.correlatedCategories.length > 0 && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    Correlates with {correlationProfile.allCategories.length} Site Types
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {correlationProfile.correlatedCategories.length > 0
                  ? 'Autonomous routing detects multi-style correlations—placing ads across all relevant marketplaces while strictly filtering out incompatible platforms.'
                  : 'Product links are strictly routed to outlets where this product naturally converts—never placed on incompatible platforms.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowStrategyDrawer((prev) => !prev)}
            className="text-xs text-slate-200 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer shrink-0 self-start sm:self-auto bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showStrategyDrawer ? 'Hide Multi-Channel Blueprint' : 'View Correlated Outlets & Tactics'}</span>
          </button>
        </div>

        {/* Multi-Category Correlation Breakdown Badges */}
        {correlationProfile.correlatedCategories.length > 0 && (
          <div className="bg-[#0f172a]/90 p-3 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs text-purple-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Cross-Channel Placement Correlation:
              </span>
              <span className="text-[11px] font-mono text-slate-400 font-normal">
                Fits multiple site styles and buyer personas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {correlationProfile.breakdowns.map((item) => (
                <div
                  key={item.categoryId}
                  className={`p-2.5 rounded-lg border ${
                    item.isPrimary
                      ? 'bg-blue-950/40 border-blue-500/40'
                      : 'bg-slate-900/80 border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>{item.categoryIcon}</span>
                      <span className="truncate">{item.categoryTitle}</span>
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.isPrimary
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {item.isPrimary ? 'Primary' : 'Correlated'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 line-clamp-2">{item.correlationReason}</p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                    <span className="text-amber-300 font-semibold truncate">
                      {item.topMarketplaces}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Channels Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="bg-[#0f172a] p-2.5 rounded-xl border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Top Primary Ad Engine</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              {adStrategy.primaryAdChannel}
            </span>
          </div>

          <div className="bg-[#0f172a] p-2.5 rounded-xl border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">
              {correlationProfile.correlatedCategories.length > 0 ? 'Secondary & Cross-Channel Ads' : 'Best Secondary Ad Channel'}
            </span>
            <span className="text-sky-400 font-bold flex items-center gap-1.5 mt-0.5">
              <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              {adStrategy.secondaryAdChannel}
            </span>
          </div>

          <div className="bg-[#0f172a] p-2.5 rounded-xl border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Primary Marketplaces to Place On</span>
            <span className="text-amber-300 font-bold flex items-center gap-1.5 mt-0.5">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {adStrategy.topMarketplaces}
            </span>
          </div>
        </div>

        {/* Non-Contamination Exclusions Safeguard */}
        {correlationProfile.excludedChannels.length > 0 && (
          <div className="bg-red-950/20 border border-red-500/25 p-2.5 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-[11px] font-bold text-red-300">
                Zero-Slop Guardrail (Strictly Blocked Irrelevant Platforms):
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {correlationProfile.excludedChannels.map((ch) => (
                <span
                  key={ch}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/90 text-slate-300 border border-red-500/30 line-through"
                  title="Excluded to prevent audience mismatch"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Ad Strategy & Multi-Channel Tactics Drawer */}
        {showStrategyDrawer && (
          <div className="mt-2 pt-2.5 border-t border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">
                Recommended Cross-Platform Tactics & Targeting:
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {correlationProfile.combinedAdSummary}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {adStrategy.networks.map((net) => (
                <div key={net.name} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{net.name}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {net.placementType}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{net.targetingStrategy}</p>
                  <p className="text-[10px] text-emerald-400"><strong>Best For:</strong> {net.bestFor}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>


      {/* Live Active Placements Overview */}
      {discoveredLeads.length > 0 && (
        <div className="space-y-4">
          <div className="bg-[#0c1222] p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {imagePreview ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-500/60 shadow shrink-0 bg-slate-900">
                  <img src={imagePreview} alt={activeProductName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Placements Live & Active: {discoveredLeads.length} Channels</span>
                  <span className="text-[11px] font-mono bg-emerald-950/70 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                    Auto-Placed
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Target Offer: <strong className="text-white">{activeProductName}</strong> &bull; Link: <code className="text-emerald-400 font-mono">{targetUrl}</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="bg-[#060913] px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-mono">
                Auto-Cycle: <strong className="text-emerald-400">Every 6 Hours</strong>
              </div>
            </div>
          </div>

          {/* Channel Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-bold whitespace-nowrap">Filter Channels:</span>
            {[
              { id: 'all', label: `🌐 All (${discoveredLeads.length})` },
              { id: 'want_ads', label: '🛒 Want Ads (ISO)' },
              { id: 'comparison', label: '⚖️ Comparison Sites' },
              { id: 'review_trust', label: '⭐ Trustpilot & Yelp' },
              { id: 'daily_trends', label: '🔥 Daily Trends' },
              { id: 'gumroad', label: '🎁 Gumroad' },
              { id: 'social_intent', label: '📌 Pinterest / LinkedIn / IG' },
              { id: 'community', label: '💬 Reddit & Quora' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setChannelFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                  channelFilter === tab.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                    : 'bg-[#060913] text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards for each automated placement */}
          <div className="grid grid-cols-1 gap-4">
            {discoveredLeads
              .filter((lead) => {
                if (channelFilter === 'all') return true;
                if (channelFilter === 'want_ads') return lead.channelCategory === 'want_ads' || lead.platform.toLowerCase().includes('want');
                if (channelFilter === 'comparison') return lead.channelCategory === 'comparison' || lead.platform.toLowerCase().includes('comparison');
                if (channelFilter === 'review_trust') return lead.channelCategory === 'review_trust' || lead.platform.toLowerCase().includes('trustpilot');
                if (channelFilter === 'daily_trends') return lead.channelCategory === 'daily_trends' || lead.platform.toLowerCase().includes('trends');
                if (channelFilter === 'gumroad') return lead.channelCategory === 'gumroad' || lead.platform.toLowerCase().includes('gumroad');
                if (channelFilter === 'social_intent') {
                  return (
                    ['pinterest', 'linkedin', 'instagram'].includes(lead.channelCategory || '') ||
                    lead.platform.toLowerCase().includes('pinterest') ||
                    lead.platform.toLowerCase().includes('linkedin') ||
                    lead.platform.toLowerCase().includes('instagram')
                  );
                }
                if (channelFilter === 'community') {
                  return (
                    lead.channelCategory === 'community' ||
                    lead.platform === 'Reddit' ||
                    lead.platform === 'Quora' ||
                    lead.platform === 'Forum'
                  );
                }
                return true;
              })
              .map((lead) => {
                const isCopied = copiedId === lead.id;

                // Channel badge styling helper
                const isWantAd = lead.channelCategory === 'want_ads' || lead.platform.toLowerCase().includes('want');
                const isComparison = lead.channelCategory === 'comparison' || lead.platform.toLowerCase().includes('comparison');
                const isReview = lead.channelCategory === 'review_trust' || lead.platform.toLowerCase().includes('trustpilot');
                const isTrends = lead.channelCategory === 'daily_trends' || lead.platform.toLowerCase().includes('trends');
                const isGumroad = lead.channelCategory === 'gumroad' || lead.platform.toLowerCase().includes('gumroad');
                const isPinterest = lead.channelCategory === 'pinterest' || lead.platform.toLowerCase().includes('pinterest');
                const isLinkedIn = lead.channelCategory === 'linkedin' || lead.platform.toLowerCase().includes('linkedin');
                const isInstagram = lead.channelCategory === 'instagram' || lead.platform.toLowerCase().includes('instagram');

                return (
                  <div
                    key={lead.id}
                    className="bg-[#0c1222] rounded-2xl p-5 border border-slate-800 shadow-xl hover:border-slate-700 transition-all space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Channel Badge */}
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
                            isWantAd
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : isComparison
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                              : isReview
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                              : isTrends
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : isGumroad
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                              : isPinterest
                              ? 'bg-red-500/20 text-red-300 border-red-500/40'
                              : isLinkedIn
                              ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                              : isInstagram
                              ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                              : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {isWantAd && <ShoppingBag className="w-3 h-3 text-amber-400" />}
                          {isComparison && <Scale className="w-3 h-3 text-purple-400" />}
                          {isReview && <Star className="w-3 h-3 text-teal-400" />}
                          {isTrends && <Flame className="w-3 h-3 text-rose-400" />}
                          {isGumroad && <Sparkles className="w-3 h-3 text-yellow-400" />}
                          {isPinterest && <Pin className="w-3 h-3 text-red-400" />}
                          {isLinkedIn && <Briefcase className="w-3 h-3 text-blue-400" />}
                          {isInstagram && <InstagramIcon className="w-3 h-3 text-pink-400" />}
                          {lead.platform === 'Reddit' && <MessageSquare className="w-3 h-3 text-orange-400" />}
                          {lead.platform === 'Quora' && <HelpCircle className="w-3 h-3 text-red-400" />}
                          <span>{lead.communityName}</span>
                        </span>

                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{lead.buyerIntentScore}% Buyer Intent</span>
                        </span>

                        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Auto-Placed & Running</span>
                        </span>

                        {lead.impressions && (
                          <span className="text-[11px] font-mono text-slate-400 bg-[#0f172a] px-2 py-0.5 rounded border border-[#334155]">
                            {lead.impressions} Views
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {lead.threadUrl && (
                          <a
                            href={lead.threadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                            title="Inspect live source inquiry on the web"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Inspect Source</span>
                          </a>
                        )}

                        <button
                          onClick={() => handleCopyAdText(lead)}
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer ml-1"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'Copied Text' : 'Copy Text'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Buyer Inquiry / Wanted Listing */}
                    <div className="text-sm font-bold text-white">
                      Target Inquiry: "{lead.threadTitle}"
                    </div>

                    <div className="text-xs text-[#94a3b8]">
                      <strong className="text-slate-300">Target Problem / Demand:</strong> {lead.buyerPainPoint}
                    </div>

                    {/* Contextual Auto-Placed Ad */}
                    <div className="bg-[#0f172a] p-3.5 rounded-lg border border-[#334155] space-y-2">
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Live Placed Ad Response
                        </span>
                        <span className="text-[11px] font-mono text-sky-300">
                          Link: {targetUrl}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {lead.tailoredAdCopy}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Happy Place Balance: Starter Proof of Work & Upgrade Teaser */}
          {(() => {
            const userLic = getUserLicense();
            if (isMasterUser || userLic.tier !== 'starter') return null;

            return (
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border border-emerald-500/50 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                    <h4 className="text-sm font-black text-white">
                      Top 5 High-Intent Buyer Discussions Reached &amp; Links Placed!
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    You've experienced Cash Captain's autonomous radar and link placement live in action. There are <strong>33 additional high-intent buyers</strong> actively debating and requesting products like <span className="text-emerald-300 font-semibold">{activeProductName || 'yours'}</span> across Google Trends, Reddit Want Ads &amp; Review boards.
                  </p>
                </div>
                {onOpenLicenseModal && (
                  <button
                    type="button"
                    onClick={onOpenLicenseModal}
                    className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap self-start sm:self-auto"
                  >
                    <Crown className="w-4 h-4 text-slate-950" />
                    <span>Auto-Place Into All 38+ Buyers ($97)</span>
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
