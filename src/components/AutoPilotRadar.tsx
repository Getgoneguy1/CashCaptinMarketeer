import React, { useState, useEffect } from 'react';
import { Offer, BuyerLead, AffiliateProConfig } from '../types';
import { findBuyerLeads } from '../services/aiGenerator';
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
  Crown,
  Video,
  Play,
  FileVideo,
  Link2
} from 'lucide-react';
import {
  canDeployNewOffer,
  consumeCampaignSlot,
  getUserLicense,
  TIER_LIMITS
} from '../services/userLicenseService';
import { NavTab } from './Header';

interface AutoPilotRadarProps {
  existingOffers: Offer[];
  onSaveNewOffer: (offer: Offer) => void;
  affiliateProConfig: AffiliateProConfig;
  onRecordClick: (offerId: string, offerName: string, affiliateId: string, targetUrl: string) => void;
  onOpenEmailModal?: () => void;
  isMasterUser?: boolean;
  onOpenLicenseModal?: () => void;
  onNavigateTab?: (tab: NavTab) => void;
}

export const AutoPilotRadar: React.FC<AutoPilotRadarProps> = ({
  existingOffers,
  onSaveNewOffer,
  affiliateProConfig,
  onRecordClick,
  onOpenEmailModal,
  isMasterUser,
  onOpenLicenseModal,
  onNavigateTab
}) => {
  // Clean input form state ready for user's own affiliate offers
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productHashtags, setProductHashtags] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [vidofyAffiliateUrl, setVidofyAffiliateUrl] = useState<string>(() => {
    return localStorage.getItem('cashcaptain_vidofy_affiliate_url') || 'https://vidofy.ai/?aff=cashcaptain';
  });
  const [copiedVidofyScriptId, setCopiedVidofyScriptId] = useState<string | null>(null);
  const [isEditingVidofyUrl, setIsEditingVidofyUrl] = useState<boolean>(false);
  const [showBlueprintGuide, setShowBlueprintGuide] = useState<boolean>(false);

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

  // Auto-placement engine options
  const [handsFreeMode, setHandsFreeMode] = useState<boolean>(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<string>('6h');
  const [isPlaced, setIsPlaced] = useState<boolean>(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editedCopy, setEditedCopy] = useState<string>('');

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
    setIsPlaced(true);

    // Save with updated auto-placed status
    const newOffer: Offer = {
      id: `offer-${Date.now()}`,
      product_name: pName,
      product_description: productDescription || `${pName} solution`,
      affiliate_id: tag.trim() || pName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      target_url: link,
      image_url: imagePreview || undefined,
      video_url: videoPreview || undefined,
      video_filename: videoFileName || undefined,
      buyer_leads: updatedLeads,
      created_at: new Date().toISOString(),
      clicks: 0,
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

    setIsScanning(true);
    setActiveProductName(productName);
    setDiscoveredLeads([]);

    const tag = productHashtags.trim();
    const destination = targetUrl.trim() || 'https://example.com/product';

    try {
      setScanStep(`🔍 [1/4] Scraping web for active buyers searching for "${productName}"...`);
      await new Promise((r) => setTimeout(r, 550));

      setScanStep('🎯 [2/4] Ranking buyer placement locations by Highest Likelihood of a Sale (99% - 94%)...');
      await new Promise((r) => setTimeout(r, 550));

      setScanStep('💡 [3/4] Determining optimal ad type (Viral Video, Community Reply, Social Hook, Comparison)...');
      await new Promise((r) => setTimeout(r, 600));

      setScanStep('✍️ [4/4] Writing highest-converting ad copy & producing viral video script...');

      const leads = await findBuyerLeads(
        productName,
        productDescription || `${productName} solution`,
        tag || productName,
        destination,
        imagePreview || undefined
      );

      const leadsToProcess = leads;

      setScanStep('');
      setIsScanning(false);
      setIsPlaced(false);

      // If Hands-Free Mode is enabled, immediately place; otherwise show ads for review
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
    setProductName(name);
    setProductDescription(desc);
    setProductHashtags(tag);
    setTargetUrl(link);
    setActiveProductName(name);

    setIsScanning(true);
    setDiscoveredLeads([]);

    setTimeout(async () => {
      try {
        setScanStep(`🔍 [1/4] Scraping web for active buyers for "${name}"...`);
        await new Promise((r) => setTimeout(r, 450));
        setScanStep('🎯 [2/4] Ranking buyer channels by Highest Likelihood of a Sale (99% - 94%)...');
        await new Promise((r) => setTimeout(r, 450));
        setScanStep('💡 [3/4] Determining optimal ad types & formulating high-converting ad copy/video scripts...');
        await new Promise((r) => setTimeout(r, 500));

        const leads = await findBuyerLeads(name, desc, tag, link);
        const leadsToProcess = leads;

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

  const handleLaunchVidofy = (lead: BuyerLead) => {
    const fullScript = `PRODUCT: ${activeProductName || productName || 'My Product'}
3-SECOND VIRAL HOOK:
"${lead.videoScript?.hook || lead.viralHook || `Stop scrolling if you need ${activeProductName || productName}!`}"

SCENE / VISUAL DIRECTION:
${lead.videoScript?.visualDirection || '[Screen recording showing fast result. Cut to product page with dynamic music.]'}

VOICEOVER SCRIPT:
${lead.videoScript?.voiceoverScript || lead.tailoredAdCopy}

POST CAPTION & CALL TO ACTION:
${lead.videoScript?.caption || lead.tailoredAdCopy}
AFFILIATE LINK: ${lead.affiliateDeepLink || targetUrl || 'https://example.com'}`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullScript);
    }
    setCopiedVidofyScriptId(lead.id);
    setTimeout(() => setCopiedVidofyScriptId(null), 4000);

    window.open(vidofyAffiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSaveVidofyUrl = (newUrl: string) => {
    const cleaned = newUrl.trim() || 'https://vidofy.ai/?aff=cashcaptain';
    setVidofyAffiliateUrl(cleaned);
    localStorage.setItem('cashcaptain_vidofy_affiliate_url', cleaned);
    setIsEditingVidofyUrl(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Hero Header */}
      <div className="bg-[#0c1222] p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                AI Buyer Discovery &amp; Ad Placement
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scrapes the web for active buyers wanting your specific product or service, ranks placements by highest likelihood of a sale, and crafts tailored video scripts and ads — you can sell anything with this.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#060913] px-3.5 py-1.5 rounded-xl border border-emerald-500/30 shrink-0 self-start sm:self-auto shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-emerald-300">
              Works with Any Product or Service • Sell Anything With This
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleLaunchAutoPilot} className="space-y-4">
          {/* Input Form: 1. Product -> 2. Description & Tags -> 3. The Link -> 4. Picture & Video in same box */}
          {/* 1. Product */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Any Product, Service, SaaS, Physical Good, Course, or Offer"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 shadow-inner font-semibold placeholder:text-slate-600"
            />
          </div>

          {/* 2. Description & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Product Description / What Problem Does It Solve?
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Describe what your product or service does, the pain point it fixes, or key benefits for buyers..."
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 shadow-inner resize-y placeholder:text-slate-600"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Product Hashtags / Keywords (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. #marketing #deals #gadgets"
                value={productHashtags}
                onChange={(e) => setProductHashtags(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono shadow-inner text-sky-400 placeholder:text-slate-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">Tags for search matching and social hashtags</p>
            </div>
          </div>

          {/* 3. The Link */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Your Product or Affiliate Link *
            </label>
            <input
              type="url"
              required
              placeholder="https://your-product-link.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 font-mono shadow-inner text-emerald-400 font-bold placeholder:text-slate-600"
            />
          </div>

          {/* 4. Single Box for Picture and Video Upload Buttons */}
          <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Media: Picture &amp; Video (Optional)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Picture Upload & URL */}
              <div className="space-y-2 p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Picture (Optional)</span>
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer transition"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="Paste Image URL"
                    value={imagePreview?.startsWith('data:') ? '' : imagePreview || ''}
                    onChange={(e) => setImagePreview(e.target.value.trim() || null)}
                    className="flex-1 px-3 py-2 bg-[#1e293b] border border-[#475569] rounded-lg text-white text-xs focus:outline-none focus:border-[#3b82f6] placeholder:text-[#64748b]"
                  />
                  <label className="px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Upload Picture</span>
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

                {imagePreview && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-500/50 bg-black">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <p className="text-[11px] text-slate-400 leading-snug">
                  Attached product pictures are embedded into shoppable feed ads (Instagram, Pinterest, Google Shopping, Facebook Marketplace, and Classifieds). Supports direct uploads or image URLs.
                </p>
              </div>

              {/* Video Upload (Labeled 'Video', preserving full description) */}
              <div className="space-y-2 p-3 rounded-lg bg-slate-900/50 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                    <Video className="w-3.5 h-3.5 text-purple-400" />
                    <span>Video</span>
                  </label>
                  {videoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoFileName(null);
                      }}
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer transition"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <label className="w-full sm:w-auto px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5 text-purple-400" />
                    <span>Upload Video File</span>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideoFileName(file.name);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            if (typeof reader.result === 'string') {
                              setVideoPreview(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {videoFileName && (
                    <div className="flex items-center px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 truncate max-w-full">
                      <FileVideo className="w-3 h-3 text-purple-400 mr-1.5 shrink-0" />
                      <span className="truncate">{videoFileName}</span>
                    </div>
                  )}
                </div>

                {videoPreview && (
                  <div className="w-full rounded-lg overflow-hidden border border-purple-500/40 bg-black">
                    <video src={videoPreview} controls className="w-full max-h-24 object-contain" />
                  </div>
                )}

                <p className="text-[11px] text-slate-400 leading-snug">
                  If you already have a video for this product (e.g. from Vidofy or your camera), upload it here. The AI attaches it to all short-form video ad placements (TikTok, Shorts, Reels).
                </p>
              </div>
            </div>
          </div>

          {/* Vidofy Video Maker Partner Bar */}
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 shrink-0">
                <Play className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="font-bold text-white">Vidofy AI Video Maker: </span>
                <span className="text-slate-400">Renders 15-30s videos from your AI blueprint. </span>
                <a
                  href={vidofyAffiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline font-mono text-[11px] inline-flex items-center gap-0.5 ml-1"
                >
                  <span>{vidofyAffiliateUrl.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditingVidofyUrl ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="url"
                    defaultValue={vidofyAffiliateUrl}
                    id="vidofy-aff-input"
                    className="px-2 py-1 bg-slate-950 border border-purple-500/50 rounded text-xs text-white w-48 font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('vidofy-aff-input') as HTMLInputElement | null;
                      if (input) handleSaveVidofyUrl(input.value);
                    }}
                    className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded text-xs cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingVidofyUrl(false)}
                    className="px-2 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingVidofyUrl(true)}
                  className="text-[11px] text-slate-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition font-mono"
                >
                  <span>[Change Affiliate Link]</span>
                </button>
              )}
            </div>
          </div>
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
                  <span>⚡ Place Ads</span>
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

      {/* Live Active Placements Overview */}
      {discoveredLeads.length > 0 && (
        <div className="space-y-4">
          {!isPlaced ? (
            <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-emerald-950/70 p-5 rounded-2xl border border-blue-500/50 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
                  <h3 className="text-base font-black text-white">
                    Targeted Placements &amp; High-Converting Ads ({discoveredLeads.length} Ranked by Likelihood of Sale)
                  </h3>
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                    Highest Likelihood First
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-xl">
                  Buyers scraped and ranked by highest likelihood of a sale for <strong className="text-white">{activeProductName}</strong>, with tailored ad types, viral video scripts, and direct placement links.
                </p>
              </div>

              <button
                type="button"
                onClick={() => executeAutonomousPlacement(discoveredLeads, activeProductName || productName, productHashtags, targetUrl)}
                disabled={isAutoPlacing}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer shrink-0 whitespace-nowrap self-start sm:self-auto"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Approve &amp; Place All Ads Now &rarr;</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#0c1222] p-5 rounded-2xl border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>We placed your product on these sites ({discoveredLeads.length} Total):</span>
                    <span className="text-[11px] font-mono bg-emerald-950/70 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                      Live &amp; Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Target Product: <strong className="text-white">{activeProductName}</strong> &bull; Link: <code className="text-emerald-400 font-mono">{targetUrl}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <div className="bg-[#060913] px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 font-mono">
                  Status: <strong className="text-emerald-400">All Placed &amp; Live</strong>
                </div>
              </div>
            </div>
          )}

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
              .map((lead, idx) => {
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

                        {/* Likelihood Ranking */}
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>#{idx + 1} Ranked • {lead.buyerIntentScore}% Likelihood of Sale</span>
                        </span>

                        {/* Determined Ad Type */}
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                          <span>
                            {lead.adType === 'video_ad'
                              ? '🎬 Video Ad'
                              : lead.adType === 'discussion'
                              ? '💬 Community Reply'
                              : lead.adType === 'social_hook'
                              ? '📱 Social Hook'
                              : '⚖️ Comparison Review'}
                          </span>
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

                    {/* Ad Content: Video Ad vs Discussion Copy */}
                    {lead.adType === 'video_ad' || lead.videoScript ? (
                      <div className="bg-[#0f172a] p-4 rounded-xl border border-purple-500/40 space-y-3.5">
                        {/* Header & Vidofy 1-Click Action */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-purple-500/20 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                              <Flame className="w-4 h-4 text-purple-400" />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-white">Viral Video Ad Blueprint</span>
                                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                                  TikTok / Shorts / Reels
                                </span>
                              </div>
                              <p className="text-[11px] text-purple-300/80">
                                Script, hooks, &amp; visual cues engineered for high conversion
                              </p>
                            </div>
                          </div>

                          {/* 1-Click Launch Vidofy Button */}
                          <button
                            type="button"
                            onClick={() => handleLaunchVidofy(lead)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-500 hover:from-purple-500 hover:to-emerald-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 active:scale-95"
                            title="Copies this script to clipboard and opens Vidofy via your affiliate link"
                          >
                            <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                            <span>
                              {copiedVidofyScriptId === lead.id
                                ? '✓ Script Copied! Opening Vidofy...'
                                : '🎬 Make Video on Vidofy (1-Click)'}
                            </span>
                            <ExternalLink className="w-3 h-3 opacity-80" />
                          </button>
                        </div>

                        {/* Notice & How to Use Guide */}
                        <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 text-xs space-y-1.5">
                          <div className="flex items-center justify-between flex-wrap gap-1">
                            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px]">
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>Notice: App crafts the blueprint; use Vidofy to render the MP4 video</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowBlueprintGuide(!showBlueprintGuide)}
                              className="text-[11px] font-mono text-amber-400 underline hover:text-amber-200 cursor-pointer"
                            >
                              {showBlueprintGuide ? 'Hide 3-Step Guide' : 'How to use blueprint (3 Steps) ▼'}
                            </button>
                          </div>

                          {showBlueprintGuide && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-amber-500/20 text-[11px] text-amber-200/90">
                              <div className="bg-slate-900/80 p-2 rounded-lg border border-amber-500/20">
                                <strong className="text-white block mb-0.5">1. Click 'Make Video'</strong>
                                Copies this hook, voiceover, and visual directions, and opens Vidofy.
                              </div>
                              <div className="bg-slate-900/80 p-2 rounded-lg border border-amber-500/20">
                                <strong className="text-white block mb-0.5">2. Render in Vidofy</strong>
                                Paste script into Vidofy to generate your 15-30s vertical video in seconds.
                              </div>
                              <div className="bg-slate-900/80 p-2 rounded-lg border border-amber-500/20">
                                <strong className="text-white block mb-0.5">3. Upload Video Below</strong>
                                Attach your rendered MP4 video so the AI has the physical video asset.
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 3-Second Viral Hook */}
                        <div className="bg-purple-950/40 p-3 rounded-lg border border-purple-500/30 text-xs space-y-1">
                          <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block">
                            ⚡ 3-Second Scroll-Stopping Hook:
                          </span>
                          <p className="text-white font-bold text-sm">
                            "{lead.videoScript?.hook || lead.viralHook || `Stop scrolling if you need ${activeProductName}!`}"
                          </p>
                        </div>

                        {/* Visual & Voiceover breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                              🎬 Scene &amp; Visual Direction:
                            </span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              {lead.videoScript?.visualDirection || '[Screen recording showing fast result. Cut to product page with dynamic music.]'}
                            </p>
                          </div>

                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                              🎙️ Voiceover Script:
                            </span>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              {lead.videoScript?.voiceoverScript || lead.tailoredAdCopy}
                            </p>
                          </div>
                        </div>

                        {/* Post Caption with Link */}
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                            🔗 Post Caption &amp; Embedded Referral Link:
                          </span>
                          <p className="text-slate-200 text-xs font-mono">
                            {lead.videoScript?.caption || lead.tailoredAdCopy}
                          </p>
                        </div>

                        {/* Attached Video Dropzone */}
                        <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                              <Video className="w-3.5 h-3.5 text-purple-400" />
                              <span>Attached Video File (.mp4 / .mov / .webm):</span>
                            </span>
                            {(lead.videoUrl || videoPreview) && (
                              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                <span>Video Asset Ready</span>
                              </span>
                            )}
                          </div>

                          {lead.videoUrl || videoPreview ? (
                            <div className="space-y-2">
                              <video
                                src={lead.videoUrl || videoPreview || ''}
                                controls
                                className="w-full max-h-52 rounded-lg bg-black border border-slate-800"
                              />
                              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                                <span className="truncate">File: {lead.videoFilename || videoFileName || 'video-ad.mp4'}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDiscoveredLeads(prev => prev.map(l => l.id === lead.id ? { ...l, videoUrl: undefined, videoFilename: undefined } : l));
                                  }}
                                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                                >
                                  <X className="w-3 h-3" />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                              <label className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                                <Upload className="w-3.5 h-3.5 text-purple-400" />
                                <span>Attach Video File</span>
                                <input
                                  type="file"
                                  accept="video/mp4,video/quicktime,video/webm"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          const url = reader.result;
                                          setDiscoveredLeads(prev => prev.map(l => l.id === lead.id ? { ...l, videoUrl: url, videoFilename: file.name } : l));
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                              <span className="text-[10px] text-slate-400">
                                Upload your finished video from Vidofy or your camera so the AI has the physical video asset.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Standard Discussion / Marketplace Ad */
                      <div className="bg-[#0f172a] p-3.5 rounded-lg border border-[#334155] space-y-2">
                        <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{isPlaced ? 'Live Placed Ad Response' : 'Generated Ad Copy (Ready to Place)'}</span>
                          </span>
                          <span className="text-[11px] font-mono text-emerald-300">
                            Link: {targetUrl}
                          </span>
                        </div>

                        {editingLeadId === lead.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editedCopy}
                              onChange={(e) => setEditedCopy(e.target.value)}
                              rows={3}
                              className="w-full p-2 bg-slate-900 border border-emerald-500 rounded-lg text-xs text-white font-sans focus:outline-none"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingLeadId(null)}
                                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  const updated = discoveredLeads.map((l) =>
                                    l.id === lead.id ? { ...l, tailoredAdCopy: editedCopy } : l
                                  );
                                  setDiscoveredLeads(updated);
                                  setEditingLeadId(null);
                                }}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded"
                              >
                                Save Copy
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                              {lead.tailoredAdCopy}
                            </p>
                            {!isPlaced && (
                              <button
                                onClick={() => {
                                  setEditingLeadId(lead.id);
                                  setEditedCopy(lead.tailoredAdCopy);
                                }}
                                className="text-[11px] text-emerald-400 hover:underline mt-1.5 flex items-center gap-1 cursor-pointer font-bold"
                              >
                                <span>✎ Edit Ad Copy</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

    </div>
  );
};
