import React, { useState, useEffect } from 'react';
import { AffiliateProConfig, Offer, MasterAuthSession } from '../types';
import { AppUserProfile } from '../services/userAuthService';
import {
  getUserLicense,
  isCashCaptainLicenseHolder,
  getAddonAppState,
  saveAddonAppState,
  AddonAppState
} from '../services/userLicenseService';
import {
  Link2,
  ExternalLink,
  Flame,
  Globe,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  Crown,
  X,
  Zap,
  Check
} from 'lucide-react';

interface AffiliateProConnectProps {
  config: AffiliateProConfig;
  onSaveConfig: (config: AffiliateProConfig) => void;
  offers: Offer[];
  onImportOffers?: (offers: Offer[]) => void;
  masterSession?: MasterAuthSession;
  currentUser?: AppUserProfile | null;
  onOpenLicenseModal?: () => void;
}

// Fixed official app addresses for our 3-in-1 suite
const DEFAULT_AI_HUB_URL = 'https://affiliatepro.netlify.app';
const DEFAULT_AI_ASSISTANT_URL = 'https://affiliateviralai.netlify.app';

export const AffiliateProConnect: React.FC<AffiliateProConnectProps> = ({
  config,
  onSaveConfig,
  offers,
  masterSession,
  currentUser,
  onOpenLicenseModal
}) => {
  const isMasterUser = !!masterSession?.isMasterLoggedIn;
  const userLicense = getUserLicense();
  const isLicensedCaptain = isCashCaptainLicenseHolder(userLicense, isMasterUser);

  // App Addon States (Subscription, Sign-In, Linked)
  const [hubState, setHubState] = useState<AddonAppState>(() => getAddonAppState('hub', isMasterUser));
  const [viralState, setViralState] = useState<AddonAppState>(() => getAddonAppState('viral', isMasterUser));

  // Sync state if master owner logs in
  useEffect(() => {
    if (isMasterUser) {
      setHubState(getAddonAppState('hub', true));
      setViralState(getAddonAppState('viral', true));
    }
  }, [isMasterUser]);

  // Modal State for Subscription / Sign-In
  const [modalTarget, setModalTarget] = useState<'hub' | 'viral' | null>(null);
  const [activeModalType, setActiveModalType] = useState<'subscribe' | 'signin' | null>(null);

  // Form states in modal
  const [modalKeyInput, setModalKeyInput] = useState('');
  const [modalEmailInput, setModalEmailInput] = useState(currentUser?.email || '');
  const [modalPasswordInput, setModalPasswordInput] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  const triggerAlert = (text: string, type: 'success' | 'info' = 'success') => {
    setActionAlert({ type, text });
    setTimeout(() => setActionAlert(null), 3500);
  };

  // Pricing:
  // Standard: $47 each.
  // Cash Captain License Holders: $24 each (over 50% discount!) or $39 for both!
  const hubPrice = isLicensedCaptain ? 24 : 47;
  const viralPrice = isLicensedCaptain ? 24 : 47;
  const dualBundlePrice = isLicensedCaptain ? 39 : 94;

  const persistLinkUpdate = (newHub: AddonAppState, newViral: AddonAppState) => {
    onSaveConfig({
      ...config,
      enabled: true,
      appUrl: DEFAULT_AI_HUB_URL,
      app3Url: DEFAULT_AI_ASSISTANT_URL,
      isHubLinked: newHub.isLinked,
      hubUserEmail: newHub.userEmail,
      isViralLinked: newViral.isLinked,
      viralUserEmail: newViral.userEmail,
      lastSynced: new Date().toISOString()
    });
  };

  // Push Button Linking Handler for AI Hub or AI Assistant
  const handleInitiateLink = (app: 'hub' | 'viral') => {
    const currentState = app === 'hub' ? hubState : viralState;
    const appLabel = app === 'hub' ? 'AI Hub' : 'AI Assistant';

    // 1. Must be subscribed
    if (!currentState.isSubscribed) {
      setModalTarget(app);
      setActiveModalType('subscribe');
      setModalKeyInput('');
      setModalError(null);
      setModalSuccess(null);
      return;
    }

    // 2. Must be signed into that app
    if (!currentState.isSignedIn) {
      setModalTarget(app);
      setActiveModalType('signin');
      setModalEmailInput(currentState.userEmail || currentUser?.email || '');
      setModalPasswordInput('');
      setModalError(null);
      setModalSuccess(null);
      return;
    }

    // 3. Both requirements met: Link to Cash Captain!
    const updated: AddonAppState = {
      ...currentState,
      isLinked: true
    };

    if (app === 'hub') {
      setHubState(updated);
      saveAddonAppState('hub', updated);
      persistLinkUpdate(updated, viralState);
    } else {
      setViralState(updated);
      saveAddonAppState('viral', updated);
      persistLinkUpdate(hubState, updated);
    }

    triggerAlert(`🔗 ${appLabel} is now linked to Cash Captain!`, 'success');
  };

  // Unlink Handler
  const handleUnlink = (app: 'hub' | 'viral') => {
    const currentState = app === 'hub' ? hubState : viralState;
    const appLabel = app === 'hub' ? 'AI Hub' : 'AI Assistant';

    const updated: AddonAppState = {
      ...currentState,
      isLinked: false
    };

    if (app === 'hub') {
      setHubState(updated);
      saveAddonAppState('hub', updated);
      persistLinkUpdate(updated, viralState);
    } else {
      setViralState(updated);
      saveAddonAppState('viral', updated);
      persistLinkUpdate(hubState, updated);
    }

    triggerAlert(`Unlinked ${appLabel} from Cash Captain.`, 'info');
  };

  // Activate Subscription via Key
  const handleActivateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTarget) return;

    const cleanKey = modalKeyInput.trim().toUpperCase();
    if (!cleanKey) {
      setModalError('Please enter your license key or PayPal transaction ID.');
      return;
    }

    const app = modalTarget;
    const appLabel = app === 'hub' ? 'AI Hub' : 'AI Assistant';
    const currentState = app === 'hub' ? hubState : viralState;

    const updated: AddonAppState = {
      ...currentState,
      isSubscribed: true,
      licenseKey: cleanKey,
      activatedAt: new Date().toISOString()
    };

    if (app === 'hub') {
      setHubState(updated);
      saveAddonAppState('hub', updated);
      persistLinkUpdate(updated, viralState);
    } else {
      setViralState(updated);
      saveAddonAppState('viral', updated);
      persistLinkUpdate(hubState, updated);
    }

    setModalSuccess(`Subscription verified for ${appLabel}! Next, sign into ${appLabel} to link.`);
    setTimeout(() => {
      setActiveModalType('signin');
      setModalEmailInput(currentUser?.email || '');
      setModalPasswordInput('');
      setModalSuccess(null);
      setModalError(null);
    }, 1100);
  };

  // Instant Demo Activation
  const handleInstantSubscription = () => {
    if (!modalTarget) return;
    const app = modalTarget;
    const appLabel = app === 'hub' ? 'AI Hub' : 'AI Assistant';
    const currentState = app === 'hub' ? hubState : viralState;

    const mockKey = `${app.toUpperCase()}-VIP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const updated: AddonAppState = {
      ...currentState,
      isSubscribed: true,
      licenseKey: mockKey,
      activatedAt: new Date().toISOString()
    };

    if (app === 'hub') {
      setHubState(updated);
      saveAddonAppState('hub', updated);
      persistLinkUpdate(updated, viralState);
    } else {
      setViralState(updated);
      saveAddonAppState('viral', updated);
      persistLinkUpdate(hubState, updated);
    }

    setModalSuccess(`Subscription activated! Proceeding to Sign In...`);
    setTimeout(() => {
      setActiveModalType('signin');
      setModalEmailInput(currentUser?.email || 'member@cashcaptain.com');
      setModalPasswordInput('');
      setModalSuccess(null);
      setModalError(null);
    }, 900);
  };

  // Sign In to App Handler
  const handleSignInApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTarget) return;

    if (!modalEmailInput.trim()) {
      setModalError('Please enter your account email.');
      return;
    }
    if (modalPasswordInput.length < 4) {
      setModalError('Please enter your password (minimum 4 characters).');
      return;
    }

    const app = modalTarget;
    const appLabel = app === 'hub' ? 'AI Hub' : 'AI Assistant';
    const currentState = app === 'hub' ? hubState : viralState;

    // Save signed in state and automatically link upon sign in
    const updated: AddonAppState = {
      ...currentState,
      isSignedIn: true,
      userEmail: modalEmailInput.trim(),
      isLinked: true
    };

    if (app === 'hub') {
      setHubState(updated);
      saveAddonAppState('hub', updated);
      persistLinkUpdate(updated, viralState);
    } else {
      setViralState(updated);
      saveAddonAppState('viral', updated);
      persistLinkUpdate(hubState, updated);
    }

    setModalSuccess(`Signed in to ${appLabel} and linked to Cash Captain!`);
    setTimeout(() => {
      setActiveModalType(null);
      setModalTarget(null);
      setModalSuccess(null);
      setModalError(null);
      triggerAlert(`🎉 ${appLabel} is linked and ready to launch!`, 'success');
    }, 1100);
  };

  // 1-Click SSO with Cash Captain Session
  const handleQuickSSO = () => {
    if (!modalTarget) return;
    const app = modalTarget;
    const appLabel = app === 'hub' ? 'AI Hub' : 'AI Assistant';
    const ssoEmail = currentUser?.email || (isMasterUser ? 'yeahwegotthat@proton.me' : 'captain@cashcaptain.com');
    const currentState = app === 'hub' ? hubState : viralState;

    const updated: AddonAppState = {
      ...currentState,
      isSignedIn: true,
      userEmail: ssoEmail,
      isLinked: true
    };

    if (app === 'hub') {
      setHubState(updated);
      saveAddonAppState('hub', updated);
      persistLinkUpdate(updated, viralState);
    } else {
      setViralState(updated);
      saveAddonAppState('viral', updated);
      persistLinkUpdate(hubState, updated);
    }

    setModalSuccess(`Signed in with Cash Captain credentials & linked!`);
    setTimeout(() => {
      setActiveModalType(null);
      setModalTarget(null);
      setModalSuccess(null);
      setModalError(null);
      triggerAlert(`🎉 ${appLabel} is linked via Cash Captain Single Sign-On!`, 'success');
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {actionAlert && (
        <div className={`p-4 rounded-xl border text-sm flex items-center gap-3 shadow-lg transition-all ${
          actionAlert.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            : 'bg-blue-950/90 border-blue-500/50 text-blue-200'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-semibold">{actionAlert.text}</span>
        </div>
      )}

      {/* Main Suite Card */}
      <div className="bg-[#0c1222] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-2xl shadow">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">3-in-1 Marketing Suite</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  Push-Button Linking
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Link the <strong>AI Hub</strong> and <strong>AI Assistant</strong> to Cash Captain at the push of a button.
              </p>
            </div>
          </div>
        </div>

        {/* CASH CAPTAIN LICENSE HOLDER VIP DISCOUNT CALLOUT */}
        {isLicensedCaptain ? (
          <div className="bg-gradient-to-r from-emerald-950/80 via-blue-950/60 to-purple-950/80 border-2 border-emerald-500/60 p-4 rounded-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shrink-0 mt-0.5">
                <Crown className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Cash Captain Member 50% VIP Discount
                  </h3>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
                    SAVE $23 EACH
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Because you bought a license to Cash Captain, you get the <strong>AI Hub</strong> and <strong>AI Assistant</strong> for only <strong>$24 each</strong> (regular $47)! We want you running all three apps together.
                </p>
              </div>
            </div>

            <a
              href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                'yeahwegotthat@proton.me'
              )}&item_name=Dual+Power+AI+Hub+and+Assistant+(Cash+Captain+VIP+Licensee+Special)&amount=${dualBundlePrice}.00&currency_code=USD`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>Get Both for ${dualBundlePrice} &rarr;</span>
            </a>
          </div>
        ) : (
          <div className="bg-[#060913] border border-blue-500/30 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white">Own a Cash Captain License? </span>
                <span className="text-slate-400">
                  Cash Captain license holders receive <strong>50% OFF</strong> both the AI Hub and AI Assistant ($24 each instead of $47).
                </span>
              </div>
            </div>
            {onOpenLicenseModal && (
              <button
                onClick={onOpenLicenseModal}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition shrink-0 cursor-pointer"
              >
                Buy License
              </button>
            )}
          </div>
        )}

        {/* 3 Apps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* APP 1: Cash Captain Marketeer (Base App) */}
          <div className="bg-[#060913] p-5 rounded-xl border border-emerald-500/40 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  BASE APP • INCLUDED
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-base font-black text-white">
                  Cash Captain Marketeer™
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {isLicensedCaptain ? '⭐ Licensed Base Station' : 'Active App'}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous buyer intent radar, viral ad copy writer, video ad scripts, and 1-click ad placement.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                <span>● Host Station Active</span>
                <span className="text-slate-300">Offers: {offers.length}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium text-center">
                Central Host Ready for Linking
              </div>
            </div>
          </div>

          {/* APP 2: Affiliate Pro (AI Hub) */}
          <div className={`bg-[#060913] p-5 rounded-xl border transition flex flex-col justify-between space-y-4 ${
            hubState.isLinked
              ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'border-blue-500/30 hover:border-blue-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                  APP 2 • AI HUB
                </span>
                <span className="text-xs font-black text-blue-300 font-mono bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  {isLicensedCaptain ? `$${hubPrice} VIP Rate` : '$47 One-Time'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Affiliate Pro (AI Hub)</span>
                </h3>
                <span className="text-xs font-medium text-slate-300">Centralized Multi-Offer Management</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize unlimited affiliate campaigns across networks, deep-link routing &amp; centralized payout analytics.
              </p>
            </div>

            {/* Hub Push-Button Control Area */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              {hubState.isLinked ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Linked to Cash Captain
                      </span>
                      <button
                        onClick={() => handleUnlink('hub')}
                        className="text-[10px] text-slate-400 hover:text-red-400 cursor-pointer transition"
                      >
                        Unlink
                      </button>
                    </div>
                    {hubState.userEmail && (
                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        Account: {hubState.userEmail}
                      </div>
                    )}
                  </div>

                  <a
                    href={DEFAULT_AI_HUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <span>Open AI Hub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono px-1">
                    <span className="text-slate-400">Subscription:</span>
                    <span className={hubState.isSubscribed ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {hubState.isSubscribed ? '● Subscribed' : 'Required'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono px-1">
                    <span className="text-slate-400">App Sign-In:</span>
                    <span className={hubState.isSignedIn ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {hubState.isSignedIn ? '● Signed In' : 'Required'}
                    </span>
                  </div>

                  {/* Main Push Button */}
                  <button
                    onClick={() => handleInitiateLink('hub')}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black rounded-lg transition flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Link AI Hub</span>
                  </button>

                  <div className="text-[10px] text-center text-slate-500">
                    Push button to link (subscription &amp; sign-in required)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* APP 3: Affiliate Viral AI (AI Assistant) */}
          <div className={`bg-[#060913] p-5 rounded-xl border transition flex flex-col justify-between space-y-4 ${
            viralState.isLinked
              ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10'
              : 'border-purple-500/30 hover:border-purple-500/50'
          }`}>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                  APP 3 • AI ASSISTANT
                </span>
                <span className="text-xs font-black text-purple-300 font-mono bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                  {isLicensedCaptain ? `$${viralPrice} VIP Rate` : '$47 One-Time'}
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-purple-400" />
                  <span>Affiliate Viral AI (Assistant)</span>
                </h3>
                <span className="text-xs font-medium text-slate-300">Automated Traffic &amp; Viral Hooks</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                AI Traffic Assistant generating viral short-form hooks, TikTok/Shorts scripts &amp; organic social syndication loops.
              </p>
            </div>

            {/* Viral AI Push-Button Control Area */}
            <div className="pt-2 border-t border-slate-800 space-y-2.5">
              {viralState.isLinked ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Linked to Cash Captain
                      </span>
                      <button
                        onClick={() => handleUnlink('viral')}
                        className="text-[10px] text-slate-400 hover:text-red-400 cursor-pointer transition"
                      >
                        Unlink
                      </button>
                    </div>
                    {viralState.userEmail && (
                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        Account: {viralState.userEmail}
                      </div>
                    )}
                  </div>

                  <a
                    href={DEFAULT_AI_ASSISTANT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <span>Open AI Assistant</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono px-1">
                    <span className="text-slate-400">Subscription:</span>
                    <span className={viralState.isSubscribed ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {viralState.isSubscribed ? '● Subscribed' : 'Required'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono px-1">
                    <span className="text-slate-400">App Sign-In:</span>
                    <span className={viralState.isSignedIn ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {viralState.isSignedIn ? '● Signed In' : 'Required'}
                    </span>
                  </div>

                  {/* Main Push Button */}
                  <button
                    onClick={() => handleInitiateLink('viral')}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black rounded-lg transition flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 cursor-pointer"
                  >
                    <Link2 className="w-4 h-4" />
                    <span>Link AI Assistant</span>
                  </button>

                  <div className="text-[10px] text-center text-slate-500">
                    Push button to link (subscription &amp; sign-in required)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Triple-Power Suite Complete Bundle Offer */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-purple-950/60 border border-emerald-500/40 p-5 rounded-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm sm:text-base font-black text-white">
                Complete 3-in-1 Triple Power Bundle
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                OFFICIAL ECOSYSTEM
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-xl">
              Equip your affiliate business with the full arsenal: <strong>Cash Captain Marketeer</strong> + <strong>Affiliate Pro AI Multi-Offer Hub</strong> + <strong>Affiliate Viral AI Assistant</strong>.
            </p>
          </div>

          <a
            href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
              'yeahwegotthat@proton.me'
            )}&item_name=${encodeURIComponent(
              isLicensedCaptain
                ? 'Cash Captain Member 3-in-1 Add-On Bundle (VIP Discount)'
                : 'Cash Captain Triple Power Suite All 3 Apps Bundle'
            )}&amount=${isLicensedCaptain ? dualBundlePrice : 147}.00&currency_code=USD`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>
              {isLicensedCaptain ? `Unlock Both Add-Ons for $${dualBundlePrice}` : 'Get All 3 Apps Bundle ($147)'} &rarr;
            </span>
          </a>
        </div>
      </div>

      {/* SUBSCRIPTION REQUIRED MODAL WITH CASH CAPTAIN LICENSE HOLDER DISCOUNT */}
      {activeModalType === 'subscribe' && modalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0b1020] border-2 border-slate-700 max-w-lg w-full rounded-2xl shadow-2xl p-6 space-y-5 relative">
            <button
              onClick={() => {
                setActiveModalType(null);
                setModalTarget(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold">
                  {modalTarget === 'hub' ? <Globe className="w-5 h-5" /> : <Flame className="w-5 h-5" />}
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Subscribe to {modalTarget === 'hub' ? 'AI Hub (Affiliate Pro)' : 'AI Assistant (Affiliate Viral AI)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    You must be subscribed to this app before linking it to Cash Captain.
                  </p>
                </div>
              </div>
            </div>

            {/* Special Cash Captain Licensee Discount Alert */}
            {isLicensedCaptain ? (
              <div className="bg-emerald-950/60 border border-emerald-500/50 p-4 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <Crown className="w-4 h-4" />
                    CASH CAPTAIN LICENSEE VIP RATE
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-xs font-black">
                    50% OFF
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">${modalTarget === 'hub' ? hubPrice : viralPrice}</span>
                  <span className="text-xs text-slate-400 line-through">$47.00</span>
                  <span className="text-xs text-emerald-300 font-semibold">One-time payment</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Your Cash Captain license entitles you to our exclusive member pricing so you can easily run all apps together.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">$47.00</span>
                  <span className="text-xs text-slate-400">One-time lifetime access</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Own a Cash Captain license? Activate your license in Cash Captain to get 50% OFF ($24)!
                </p>
              </div>
            )}

            {/* Option 1: Purchase via PayPal */}
            <div className="space-y-2">
              <a
                href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                  'yeahwegotthat@proton.me'
                )}&item_name=${encodeURIComponent(
                  modalTarget === 'hub'
                    ? `Affiliate Pro AI Hub (${isLicensedCaptain ? 'Cash Captain VIP Discount' : 'Standard License'})`
                    : `Affiliate Viral AI Assistant (${isLicensedCaptain ? 'Cash Captain VIP Discount' : 'Standard License'})`
                )}&amount=${(modalTarget === 'hub' ? hubPrice : viralPrice)}.00&currency_code=USD`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Subscribe via PayPal (${modalTarget === 'hub' ? hubPrice : viralPrice}) &rarr;</span>
              </a>
              <p className="text-[11px] text-center text-slate-500">
                Official payment to <strong>yeahwegotthat@proton.me</strong> with instant receipt.
              </p>
            </div>

            {/* Option 2: Enter License Key or Order Email */}
            <form onSubmit={handleActivateSubscription} className="pt-3 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                Already Subscribed? Enter Activation Key or Order Email:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={modalTarget === 'hub' ? 'e.g. HUB-PRO-XXXX or receipt email' : 'e.g. VIRAL-AI-XXXX or receipt email'}
                  value={modalKeyInput}
                  onChange={(e) => setModalKeyInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#060913] border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition shrink-0"
                >
                  Activate
                </button>
              </div>

              {/* Developer / Evaluation Instant Activation */}
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={handleInstantSubscription}
                  className="text-xs text-slate-400 hover:text-emerald-400 underline cursor-pointer"
                >
                  Quick Demo / Instant Activation &rarr;
                </button>
              </div>
            </form>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                {modalError}
              </div>
            )}
            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs">
                {modalSuccess}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SIGN IN REQUIRED MODAL: USER MUST BE SIGNED INTO APP TO LINK */}
      {activeModalType === 'signin' && modalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0b1020] border-2 border-slate-700 max-w-md w-full rounded-2xl shadow-2xl p-6 space-y-5 relative">
            <button
              onClick={() => {
                setActiveModalType(null);
                setModalTarget(null);
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 font-bold">
                  <Lock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    Sign In to {modalTarget === 'hub' ? 'AI Hub (Affiliate Pro)' : 'AI Assistant (Viral AI)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sign into your account for this app to authorize linking to Cash Captain.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Subscription Verified</span>
              </div>
              <p className="text-[11px] text-slate-300">
                You must be signed into each app so Cash Captain can securely link your account.
              </p>
            </div>

            <form onSubmit={handleSignInApp} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">
                  {modalTarget === 'hub' ? 'Affiliate Pro' : 'Viral AI'} Account Email:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="account@example.com"
                    value={modalEmailInput}
                    onChange={(e) => setModalEmailInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#060913] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300">Password:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={modalPasswordInput}
                    onChange={(e) => setModalPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#060913] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Link2 className="w-4 h-4" />
                <span>Sign In &amp; Link to Cash Captain</span>
              </button>

              {/* Convenience 1-Click SSO with Cash Captain Session */}
              {currentUser?.email && (
                <div className="pt-2 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={handleQuickSSO}
                    className="text-xs text-slate-400 hover:text-emerald-400 underline cursor-pointer"
                  >
                    Use same login as Cash Captain ({currentUser.email}) &rarr;
                  </button>
                </div>
              )}
            </form>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                {modalError}
              </div>
            )}
            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs">
                {modalSuccess}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
