import React, { useState, useEffect } from 'react';
import { Offer, TrackingMetrics, ClickEvent, BuildLogEntry, MicroSearchTool, AffiliateProConfig } from './types';
import {
  getStoredOffers,
  saveOffers,
  getStoredTracking,
  saveTracking,
  getStoredClicks,
  getStoredAffiliatePro,
  saveAffiliatePro,
  recordClick,
  recordConversion,
  runBatchPipeline,
  buildDeepLink
} from './services/storage';
import { generateMarketingStrategy } from './services/aiGenerator';
import { Header, NavTab } from './components/Header';
import { AutoPilotRadar } from './components/AutoPilotRadar';
import { AccountingCard } from './components/AccountingCard';
import { PipelineCard } from './components/PipelineCard';
import { OfferForm } from './components/OfferForm';
import { OfferList } from './components/OfferList';
import { SearchToolHub } from './components/SearchToolHub';
import { ClickTrackerLog } from './components/ClickTrackerLog';
import { SearchToolWidget } from './components/SearchToolWidget';
import { BulkOfferModal } from './components/BulkOfferModal';
import { AffiliateProConnect } from './components/AffiliateProConnect';
import { PromoCopyCenter } from './components/PromoCopyCenter';
import { PlusCircle, UploadCloud } from 'lucide-react';

export const App: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [tracking, setTracking] = useState<TrackingMetrics>({
    clicks: 0,
    conversions: 0,
    revenue: 0
  });
  const [clickEvents, setClickEvents] = useState<ClickEvent[]>([]);
  const [buildLogs, setBuildLogs] = useState<BuildLogEntry[]>([]);
  const [affiliateProConfig, setAffiliateProConfig] = useState<AffiliateProConfig>({
    enabled: false,
    appUrl: '',
    webhookUrl: '',
    syncMode: 'webhook'
  });
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavTab>('autopilot');

  // Modals
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showSingleAddForm, setShowSingleAddForm] = useState<boolean>(false);
  const [activeModalTool, setActiveModalTool] = useState<{
    tool: MicroSearchTool;
    offer: Offer;
  } | null>(null);
  const [selectedHubOffer, setSelectedHubOffer] = useState<Offer | null>(null);

  // Initialize
  useEffect(() => {
    const loadedOffers = getStoredOffers();
    const loadedTracking = getStoredTracking();
    const loadedClicks = getStoredClicks();
    const loadedPro = getStoredAffiliatePro();

    setOffers(loadedOffers);
    setTracking(loadedTracking);
    setClickEvents(loadedClicks);
    setAffiliateProConfig(loadedPro);

    setBuildLogs([
      {
        id: 'init-1',
        timestamp: new Date().toLocaleTimeString(),
        message: `[+] Autonomous AI Engine ready with ${loadedOffers.length} offer profiles.`,
        type: 'info'
      }
    ]);
  }, []);

  // Handler: Rebuild / Sync all pipeline assets
  const handleRebuildAll = async () => {
    if (isBuilding) return;
    setIsBuilding(true);

    try {
      const updated = await runBatchPipeline(offers, (entry) => {
        setBuildLogs((prev) => [entry, ...prev].slice(0, 150));
      });
      setOffers(updated);
    } catch (err) {
      console.error('Rebuild failed', err);
    } finally {
      setIsBuilding(false);
    }
  };

  // Handler: Save New Offer from AutoPilot or Form
  const handleSaveNewOffer = (newOffer: Offer) => {
    const existingIndex = offers.findIndex((o) => o.product_name.toLowerCase() === newOffer.product_name.toLowerCase());
    let updated: Offer[];
    if (existingIndex >= 0) {
      updated = offers.map((o, idx) => (idx === existingIndex ? { ...o, ...newOffer } : o));
    } else {
      updated = [newOffer, ...offers];
    }
    setOffers(updated);
    saveOffers(updated);
  };

  // Handler: Single Add Offer
  const handleAddOffer = async (offerData: {
    product_name: string;
    product_description: string;
    affiliate_id: string;
    category?: string;
    target_url?: string;
  }) => {
    const aiData = await generateMarketingStrategy(
      offerData.product_name,
      offerData.product_description,
      offerData.affiliate_id
    );

    const newOffer: Offer = {
      id: `offer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product_name: offerData.product_name,
      product_description: offerData.product_description,
      affiliate_id: offerData.affiliate_id,
      category: offerData.category || 'Digital Marketing',
      target_url: offerData.target_url,
      keywords: aiData.keywords,
      platform_copy: aiData,
      created_at: new Date().toISOString(),
      clicks: 0,
      conversions: 0,
      revenue: 0
    };

    const updated = [newOffer, ...offers];
    setOffers(updated);
    saveOffers(updated);
    setShowSingleAddForm(false);
  };

  // Handler: Bulk Import
  const handleBulkImport = (newOffers: Offer[]) => {
    const updated = [...newOffers, ...offers];
    setOffers(updated);
    saveOffers(updated);
  };

  // Handler: Delete Offer
  const handleDeleteOffer = (id: string) => {
    const updated = offers.filter((o) => o.id !== id);
    setOffers(updated);
    saveOffers(updated);
    if (selectedHubOffer?.id === id) {
      setSelectedHubOffer(null);
    }
  };

  // Handler: Regenerate Offer
  const handleRegenerateOffer = async (offer: Offer) => {
    const aiData = await generateMarketingStrategy(
      offer.product_name,
      offer.product_description,
      offer.affiliate_id
    );

    const updated = offers.map((o) => {
      if (o.id === offer.id) {
        return {
          ...o,
          platform_copy: aiData,
          keywords: aiData.keywords
        };
      }
      return o;
    });

    setOffers(updated);
    saveOffers(updated);
  };

  // Handler: Update Metrics
  const handleUpdateMetrics = (conversions: number, revenue: number) => {
    const updated: TrackingMetrics = {
      ...tracking,
      conversions,
      revenue: Number(revenue.toFixed(2)),
      lastUpdated: new Date().toISOString()
    };
    setTracking(updated);
    saveTracking(updated);
  };

  // Handler: Execute Search from Widget
  const handleExecuteSearch = (
    offer: Offer,
    tool: MicroSearchTool,
    query: string,
    targetUrl: string
  ) => {
    const newEvent = recordClick(
      offer.id,
      offer.product_name,
      offer.affiliate_id,
      targetUrl,
      query
    );

    setClickEvents((prev) => [newEvent, ...prev].slice(0, 100));
    setTracking(getStoredTracking());
    setOffers(getStoredOffers());
  };

  // Handler: Record Click from AutoPilot
  const handleRecordClick = (
    offerId: string,
    offerName: string,
    affiliateId: string,
    targetUrl: string
  ) => {
    const newEvent = recordClick(offerId, offerName, affiliateId, targetUrl, 'autopilot_deployed');
    setClickEvents((prev) => [newEvent, ...prev].slice(0, 100));
    setTracking(getStoredTracking());
    setOffers(getStoredOffers());
  };

  // Handler: Simulate Click
  const handleSimulateClick = (offerId: string, customQuery?: string) => {
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return;

    const base = offer.target_url || 'https://www.example.com/search?q=';
    const deepLink = buildDeepLink(base, customQuery || 'traffic scout', offer.affiliate_id);

    const newEvent = recordClick(
      offer.id,
      offer.product_name,
      offer.affiliate_id,
      deepLink,
      customQuery
    );

    setClickEvents((prev) => [newEvent, ...prev].slice(0, 100));
    setTracking(getStoredTracking());
    setOffers(getStoredOffers());
  };

  // Handler: Conversion attribution
  const handleTriggerConversion = (offerId: string, amount: number, clickId?: string) => {
    recordConversion(offerId, amount, clickId);
    setTracking(getStoredTracking());
    setOffers(getStoredOffers());
    setClickEvents(getStoredClicks());
  };

  // Handler: Save Affiliate Pro Config
  const handleSaveAffiliatePro = (cfg: AffiliateProConfig) => {
    setAffiliateProConfig(cfg);
    saveAffiliatePro(cfg);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex flex-col selection:bg-blue-600 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'hubs') setSelectedHubOffer(null);
        }}
        offerCount={offers.length}
        totalClicks={tracking.clicks}
        isBuilding={isBuilding}
        onRebuild={handleRebuildAll}
        onOpenBulkAdd={() => setShowBulkModal(true)}
        affiliateProEnabled={affiliateProConfig.enabled}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* TAB 0: AUTONOMOUS AI BUYER FINDER (DEFAULT) */}
        {activeTab === 'autopilot' && (
          <AutoPilotRadar
            existingOffers={offers}
            onSaveNewOffer={handleSaveNewOffer}
            affiliateProConfig={affiliateProConfig}
            onRecordClick={handleRecordClick}
          />
        )}

        {/* TAB 1: OFFERS */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1e293b] p-4 rounded-lg border border-[#334155]">
              <div>
                <h2 className="text-base font-bold text-white">Your Affiliate Offers</h2>
                <p className="text-xs text-[#94a3b8]">
                  Manage your products, generate instant promo copy, and launch micro-search tools.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Bulk Add Offers</span>
                </button>

                <button
                  onClick={() => setShowSingleAddForm((prev) => !prev)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-[#334155] rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>{showSingleAddForm ? 'Cancel' : 'Add Single Offer'}</span>
                </button>
              </div>
            </div>

            {showSingleAddForm && (
              <OfferForm onAddOffer={handleAddOffer} />
            )}

            <OfferList
              offers={offers}
              onDeleteOffer={handleDeleteOffer}
              onRegenerateOffer={handleRegenerateOffer}
              onTestSearchTool={(tool, offer) => setActiveModalTool({ tool, offer })}
              onViewOfferHub={(offer) => {
                setSelectedHubOffer(offer);
                setActiveTab('hubs');
              }}
            />
          </div>
        )}

        {/* TAB 2: 1-CLICK PROMO COPY */}
        {activeTab === 'copy' && (
          <PromoCopyCenter
            offers={offers}
            onOpenSearchTool={(offer) => {
              const tool = offer.platform_copy?.micro_search_tools?.[0];
              if (tool) {
                setActiveModalTool({ tool, offer });
              }
            }}
          />
        )}

        {/* TAB 3: SEARCH HUBS & DIRECTORY */}
        {activeTab === 'hubs' && (
          <SearchToolHub
            offers={offers}
            selectedOffer={selectedHubOffer}
            onSelectOffer={(off) => setSelectedHubOffer(off)}
            onExecuteSearch={(offer, tool, query, targetUrl) =>
              handleExecuteSearch(offer, tool, query, targetUrl)
            }
          />
        )}

        {/* TAB 4: CONNECT AFFILIATE PRO */}
        {activeTab === 'affiliate_pro' && (
          <AffiliateProConnect
            config={affiliateProConfig}
            onSaveConfig={handleSaveAffiliatePro}
            offers={offers}
            onImportOffers={handleBulkImport}
          />
        )}

        {/* TAB 5: TRACKING & LEDGER */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <AccountingCard
              tracking={tracking}
              offers={offers}
              onUpdateMetrics={handleUpdateMetrics}
              onSimulateClick={handleSimulateClick}
              onRecordConversion={(offerId, amt) => handleTriggerConversion(offerId, amt)}
            />

            <ClickTrackerLog
              clickEvents={clickEvents}
              offers={offers}
              onTriggerConversion={handleTriggerConversion}
            />

            <div className="pt-2">
              <PipelineCard
                offers={offers}
                logs={buildLogs}
                isBuilding={isBuilding}
                onRebuild={handleRebuildAll}
                onViewHubs={() => setActiveTab('hubs')}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modal: Bulk Add Offers */}
      {showBulkModal && (
        <BulkOfferModal
          onClose={() => setShowBulkModal(false)}
          onImportOffers={handleBulkImport}
        />
      )}

      {/* Modal: Interactive Search Box Preview */}
      {activeModalTool && (
        <SearchToolWidget
          tool={activeModalTool.tool}
          offer={activeModalTool.offer}
          isModal={true}
          onClose={() => setActiveModalTool(null)}
          onExecuteSearch={(query, targetUrl) =>
            handleExecuteSearch(activeModalTool.offer, activeModalTool.tool, query, targetUrl)
          }
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[#334155]/60 bg-[#1e293b]/60 py-4 mt-12 text-center text-xs text-[#64748b]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            CashCaptin AI &bull; Autonomous Affiliate Placement Engine
          </span>
          <span className="font-mono text-[11px] text-[#94a3b8]">
            {affiliateProConfig.enabled ? 'Linked to Affiliate Pro' : 'Auto-Pilot Placement Active'}
          </span>
        </div>
      </footer>
    </div>
  );
};
