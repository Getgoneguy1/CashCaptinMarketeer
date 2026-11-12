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
import { CashCaptainLogo } from './components/CashCaptainLogo';
import { AutoPilotRadar } from './components/AutoPilotRadar';
import { AccountingCard } from './components/AccountingCard';
import { PipelineCard } from './components/PipelineCard';
import { OfferForm } from './components/OfferForm';
import { OfferList } from './components/OfferList';
import { AiCommander } from './components/AiCommander';
import { SearchToolHub } from './components/SearchToolHub';
import { ClickTrackerLog } from './components/ClickTrackerLog';
import { SearchToolWidget } from './components/SearchToolWidget';
import { BulkOfferModal } from './components/BulkOfferModal';
import { AffiliateProConnect } from './components/AffiliateProConnect';
import { PromoCopyCenter } from './components/PromoCopyCenter';
import { CommercialSalesKit } from './components/CommercialSalesKit';
import { LandingPagePreview } from './components/LandingPagePreview';
import { EmailReportModal } from './components/EmailReportModal';
import { SocialMediaBlastModal } from './components/SocialMediaBlastModal';
import { SocialMediaCommandCenter } from './components/SocialMediaCommandCenter';
import { FirebaseLiveGuideModal } from './components/FirebaseLiveGuideModal';
import { UserGuideModal } from './components/UserGuideModal';
import { UtilitiesPage } from './components/UtilitiesPage';
import { MasterAccessModal } from './components/MasterAccessModal';
import { CustomerAffiliateProgram } from './components/CustomerAffiliateProgram';
import { UserAuthModal } from './components/UserAuthModal';
import { UserLicenseModal } from './components/UserLicenseModal';
import { EmailUpdatesScreen } from './components/EmailUpdatesScreen';
import { getStoredUserProfile, AppUserProfile } from './services/userAuthService';
import { getMasterSession, getMasterAppSettings, toggleMasterViewMode } from './services/masterAuthService';
import { MasterAuthSession, MasterAppSettings } from './types';
import { checkAndTriggerWeeklySchedule } from './services/emailReportService';
import { PlusCircle, UploadCloud, Lock, Crown, Eye, Sliders } from 'lucide-react';


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

  // Dedicated Landing Page state for external visitors arriving from ads / links
  const [showExternalLanding, setShowExternalLanding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();
      return (
        search.includes('page=landing') ||
        search.includes('landing') ||
        search.includes('ref=') ||
        hash === '#landing' ||
        hash === '#pricing' ||
        hash === '#sales' ||
        pathname.endsWith('/landing')
      );
    }
    return false;
  });

  // Listen for hash changes so users/buttons can toggle #landing easily
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash === '#landing' ||
        hash === '#pricing' ||
        hash === '#sales' ||
        search.includes('page=landing') ||
        search.includes('landing') ||
        search.includes('ref=')
      ) {
        setShowExternalLanding(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Modals
  const [showBulkModal, setShowBulkModal] = useState<boolean>(false);
  const [showSingleAddForm, setShowSingleAddForm] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [showSocialBlastModal, setShowSocialBlastModal] = useState<boolean>(false);
  const [showFirebaseGuideModal, setShowFirebaseGuideModal] = useState<boolean>(false);
  const [showUserGuideModal, setShowUserGuideModal] = useState<boolean>(false);
  const [showMasterModal, setShowMasterModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AppUserProfile | null>(() => getStoredUserProfile());
  const [masterSession, setMasterSession] = useState<MasterAuthSession>(() => getMasterSession());
  const [appSettings, setAppSettings] = useState<MasterAppSettings>(() => getMasterAppSettings());
  const [activeModalTool, setActiveModalTool] = useState<{
    tool: MicroSearchTool;
    offer: Offer;
  } | null>(null);
  const [selectedHubOffer, setSelectedHubOffer] = useState<Offer | null>(null);

  // Automatic redirect if user lands on dead unpublished ais-pre- snapshot URL
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.host.includes('ais-pre-')) {
      window.location.replace(window.location.href.replace('ais-pre-', 'ais-dev-'));
    }
  }, []);

  // Discrete Master Access Entry: check URL queries (?master=1, ?admin=1, #master) and hotkeys
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (search.includes('master') || search.includes('admin') || hash === '#master' || hash === '#admin') {
        setShowMasterModal(true);
      }

      // Keyboard shortcut for owner: Alt + M or Ctrl + Shift + M
      const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.altKey && (e.key === 'm' || e.key === 'M')) || (e.ctrlKey && e.shiftKey && (e.key === 'm' || e.key === 'M'))) {
          e.preventDefault();
          setShowMasterModal((prev) => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  const handleToggleMasterViewMode = () => {
    const next = toggleMasterViewMode();
    setMasterSession(next);
  };

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

    // Automated weekly schedule check (dispatches weekly briefing if 7 days elapsed)
    checkAndTriggerWeeklySchedule(loadedTracking, loadedOffers, []).catch((e) =>
      console.warn('Scheduled email check', e)
    );

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
    image_url?: string;
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
      image_url: offerData.image_url,
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

  // If visitor arrives at the ad landing page URL (?page=landing or #landing or ?ref=...)
  if (showExternalLanding) {
    return (
      <LandingPagePreview
        onEnterApp={() => {
          setShowExternalLanding(false);
          if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#050811] text-[#f8fafc] flex flex-col selection:bg-emerald-500 selection:text-slate-950">
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
        onOpenEmailModal={() => setShowEmailModal(true)}
        onOpenSocialBlast={() => setShowSocialBlastModal(true)}
        onOpenFirebaseGuide={() => setShowFirebaseGuideModal(true)}
        onOpenUserGuide={() => setShowUserGuideModal(true)}
        affiliateProEnabled={affiliateProConfig.enabled}
        masterSession={masterSession}
        onOpenMasterAccess={() => setShowMasterModal(true)}
        onToggleMasterViewMode={handleToggleMasterViewMode}
        onOpenLicenseModal={() => setShowLicenseModal(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {/* TAB 0: AUTONOMOUS AI BUYER FINDER (DEFAULT) - AI COMMANDER RESTRICTED TO FIRST SCREEN ONLY */}
        {activeTab === 'autopilot' && (
          <div className="space-y-6">
            <AiCommander
              offers={offers}
              tracking={tracking}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onSaveNewOffer={handleSaveNewOffer}
              onOpenSocialBlast={() => setShowSocialBlastModal(true)}
              onOpenLicenseModal={() => setShowLicenseModal(true)}
              onOpenAuthModal={() => setShowAuthModal(true)}
              masterSession={masterSession}
              currentUser={currentUser}
            />

            <AutoPilotRadar
              existingOffers={offers}
              onSaveNewOffer={handleSaveNewOffer}
              affiliateProConfig={affiliateProConfig}
              onRecordClick={handleRecordClick}
              onOpenEmailModal={() => setShowEmailModal(true)}
              onOpenLicenseModal={() => setShowLicenseModal(true)}
              onNavigateTab={(tab) => setActiveTab(tab)}
              isMasterUser={true}
            />
          </div>
        )}

        {/* TAB 1: OFFERS */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c1222] p-5 rounded-2xl border border-slate-800 shadow-xl">
              <div>
                <h2 className="text-base font-bold text-white">Your Affiliate Offers</h2>
                <p className="text-xs text-slate-400">
                  Manage your products, generate instant promo copy, and launch micro-search tools.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-slate-950" />
                  <span>Bulk Add Offers</span>
                </button>

                <button
                  onClick={() => setShowSingleAddForm((prev) => !prev)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
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
              onUpdateOffer={(updatedOffer) => {
                const updated = offers.map((o) => (o.id === updatedOffer.id ? updatedOffer : o));
                setOffers(updated);
                saveOffers(updated);
              }}
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
            onUpdateOffer={(updatedOffer) => {
              const updated = offers.map((o) => (o.id === updatedOffer.id ? updatedOffer : o));
              setOffers(updated);
              saveOffers(updated);
            }}
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

        {/* TAB: SOCIAL MEDIA COMMAND CENTER & AD BLAST */}
        {activeTab === 'social' && (
          <SocialMediaCommandCenter
            offers={offers}
            selectedOffer={selectedHubOffer}
          />
        )}

        {/* TAB: DEDICATED EMAIL UPDATES & SALES BRIEFINGS SCREEN */}
        {activeTab === 'email' && (
          <EmailUpdatesScreen
            tracking={tracking}
            offers={offers}
            leads={[]}
          />
        )}

        {/* TAB 4: CONNECT 3-IN-1 AI SUITE */}
        {activeTab === 'affiliate_pro' && (
          <AffiliateProConnect
            config={affiliateProConfig}
            onSaveConfig={handleSaveAffiliatePro}
            offers={offers}
            onImportOffers={handleBulkImport}
            masterSession={masterSession}
            currentUser={currentUser}
            onOpenLicenseModal={() => setShowLicenseModal(true)}
          />
        )}

        {/* TAB 5: TRACKING & LEDGER */}
        {activeTab === 'ledger' && (
          <div className="space-y-6">
            <AccountingCard
              tracking={tracking}
              offers={offers}
              onUpdateMetrics={handleUpdateMetrics}
            />
          </div>
        )}

        {/* TAB 6: CASH CAPTAIN AFFILIATE PARTNER PROGRAM (OPT-IN FOR CUSTOMERS) */}
        {activeTab === 'partner' && (
          <CustomerAffiliateProgram />
        )}

        {/* TAB 7: MASTER DEVELOPER COMMERCIAL SALES KIT (ONLY VISIBLE TO TY IN ADMIN MODE) */}
        {activeTab === 'sales' && masterSession.isMasterLoggedIn && masterSession.viewMode === 'admin' && (
          <CommercialSalesKit appSettings={appSettings} />
        )}

        {/* TAB 7 (VERY LAST PAGE): SYSTEM UTILITIES & BACKUP */}
        {activeTab === 'utilities' && (
          <UtilitiesPage
            offers={offers}
            tracking={tracking}
            isBuilding={isBuilding}
            onRebuild={handleRebuildAll}
            onOpenBulkAdd={() => setShowBulkModal(true)}
            onOpenUserGuide={() => setShowUserGuideModal(true)}
            onOpenFirebaseGuide={() => setShowFirebaseGuideModal(true)}
          />
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

      {/* Modal: Automated Email Reports & Sales Alerts */}
      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        tracking={tracking}
        offers={offers}
        leads={[]}
      />

      {/* Modal: Social Media Multi-Outlet Advertisement Command Center */}
      <SocialMediaBlastModal
        isOpen={showSocialBlastModal}
        onClose={() => setShowSocialBlastModal(false)}
        offers={offers}
        selectedOffer={offers[0]}
      />

      {/* Modal: Firebase Hosting and Cloud Command Center (Master Developer Only) */}
      {masterSession.isMasterLoggedIn && (
        <FirebaseLiveGuideModal
          isOpen={showFirebaseGuideModal}
          onClose={() => setShowFirebaseGuideModal(false)}
        />
      )}

      {/* Modal: Complete User Guide & Operating Manual */}
      <UserGuideModal
        isOpen={showUserGuideModal}
        onClose={() => setShowUserGuideModal(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setShowUserGuideModal(false);
        }}
      />

      {/* Modal: Master Access Login & Security Control */}
      <MasterAccessModal
        isOpen={showMasterModal}
        onClose={() => setShowMasterModal(false)}
        masterSession={masterSession}
        onSessionChange={(newSession) => setMasterSession(newSession)}
      />

      {/* Modal: Customer User Account & Authentication Portal */}
      <UserAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onUserChanged={(user) => {
          setCurrentUser(user);
          if (user?.isMasterOwner) {
            setMasterSession({
              isMasterLoggedIn: true,
              userEmail: user.email,
              userName: user.displayName,
              role: 'master_creator',
              viewMode: 'admin',
              loginTimestamp: new Date().toISOString()
            });
          }
        }}
        onMasterSessionChanged={(session) => setMasterSession(session)}
        onOpenLicenseModal={() => setShowLicenseModal(true)}
      />

      {/* Modal: Customer License Purchase & Key Activation Portal */}
      <UserLicenseModal
        isOpen={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        isMasterUser={true}
        appSettings={appSettings}
        onLicenseChanged={() => {}}
      />

      {/* Footer (Clean, Silver & Neon Green with subtle discrete admin lock) */}
      <footer className="border-t border-slate-700/80 bg-slate-900/90 py-5 mt-12 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <CashCaptainLogo className="w-8 h-8 shrink-0 drop-shadow-[0_2px_8px_rgba(57,255,20,0.3)]" />
            <div className="flex items-baseline tracking-tight">
              <span className="font-black text-[#39ff14] text-sm drop-shadow-[0_0_6px_rgba(57,255,20,0.6)]">C</span>
              <span className="font-bold text-slate-200 text-xs mr-1">ash</span>
              <span className="font-black text-[#39ff14] text-sm drop-shadow-[0_0_6px_rgba(57,255,20,0.6)]">C</span>
              <span className="font-bold text-slate-200 text-xs mr-1">aptain</span>
              <span className="font-extrabold text-[#39ff14] text-xs italic">Marketeer!™</span>
            </div>
            <span>&bull;</span>
            <span className="text-slate-300">Yeah We Got That Online</span>
            <span className="text-amber-300/80 text-[11px]">&bull; A Virbis.com Company</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Encrypted Checkout
            </span>
            <span>&bull;</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
