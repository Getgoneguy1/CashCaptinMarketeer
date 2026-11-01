import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Check,
  Zap,
  KeyRound,
  ExternalLink,
  Layers,
  Crown,
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  getUserLicense,
  activateLicenseKey,
  saveUserLicense,
  UserLicenseState,
  TIER_LIMITS
} from '../services/userLicenseService';
import { MasterAppSettings } from '../types';
import { PayPalBuyButton } from './PayPalBuyButton';

interface UserLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMasterUser: boolean;
  appSettings: MasterAppSettings;
  onLicenseChanged?: () => void;
}

export const UserLicenseModal: React.FC<UserLicenseModalProps> = ({
  isOpen,
  onClose,
  isMasterUser,
  appSettings,
  onLicenseChanged
}) => {
  const [licenseState, setLicenseState] = useState<UserLicenseState>(() => getUserLicense());
  const [inputKey, setInputKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [activationResult, setActivationResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const currentTierInfo = isMasterUser
    ? TIER_LIMITS.master_developer
    : TIER_LIMITS[licenseState.tier] || TIER_LIMITS.starter;

  const consumedSlots = licenseState.consumedSlots || [];
  const totalSlots = isMasterUser ? 999999 : licenseState.totalSlotsAllowed;
  const remainingSlots = isMasterUser ? 999999 : Math.max(0, totalSlots - consumedSlots.length);

  const paypalRecipient = appSettings?.paypalEmail || 'yeahwegotthat@proton.me';

  // Direct PayPal links to official business account
  const PAYPAL_PRO_URL = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
    paypalRecipient
  )}&item_name=Cash+Captain+Marketeer+Captain+Pro+License+(15+Slots)&amount=97.00&currency_code=USD`;

  const PAYPAL_LIFETIME_URL = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
    paypalRecipient
  )}&item_name=Cash+Captain+Marketeer+Founder+Lifetime+Master+License+(Unlimited)&amount=197.00&currency_code=USD`;

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    const res = activateLicenseKey(inputKey, userEmail);
    setActivationResult(res);
    if (res.success) {
      setLicenseState(getUserLicense());
      if (onLicenseChanged) onLicenseChanged();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <KeyRound className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">License Status &amp; Campaign Slots</h2>
            <p className="text-xs text-slate-400">
              Manage your product deployment capacity and upgrade for higher buyer volume.
            </p>
          </div>
        </div>

        {/* Active Tier Overview */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active License Tier:</span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              {currentTierInfo.name}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-center">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Slots Deployed</span>
              <span className="text-base font-bold text-white font-mono">
                {isMasterUser ? '0 (Owner)' : `${consumedSlots.length} / ${totalSlots}`}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Available Slots</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {isMasterUser ? 'Unlimited' : remainingSlots}
              </span>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Buyer Radar Scope</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {licenseState.tier === 'starter' && !isMasterUser ? 'Top 5 / Product' : 'Full (38+ Channels)'}
              </span>
            </div>
          </div>

          {/* Slot Loophole Protection Notice */}
          <div className="flex items-start gap-2 bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Campaign Integrity Protection:</strong> Each deployed offer permanently consumes 1 campaign slot on our auto-placement radar network. Deleting an offer from your local view does not free up a slot, preventing automated network spam and ensuring uninterrupted buyer placement.
            </p>
          </div>
        </div>

        {/* If on Starter or Pro, show the upgrade offers */}
        {(!isMasterUser && licenseState.tier !== 'lifetime') && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#39ff14]" />
              <span>Upgrade Campaign Slots (Direct PayPal Checkout)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: Pro */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Captain Pro</span>
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      $97 One-Time
                    </span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 mt-2">
                    <li className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>15 Permanent Campaign Slots</strong></span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Full Auto-Placement across all 38+ buyer threads</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Daily trends &amp; comparison debates unlocked</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-slate-900">
                  <PayPalBuyButton
                    hostedButtonId="ZGT7S2VPTE4D4"
                    itemName="Cash Captain Marketeer Captain Pro License (15 Slots)"
                    amount={97}
                    businessEmail={paypalRecipient}
                  />
                </div>
              </div>

              {/* Option 2: Founder Lifetime */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/40 relative shadow-lg shadow-emerald-500/5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      <span>Founder Lifetime</span>
                    </span>
                    <span className="text-xs font-black text-slate-950 bg-emerald-400 px-2 py-0.5 rounded font-mono">
                      $197 Best Value
                    </span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 mt-2">
                    <li className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>Unlimited Campaign Slots (Forever)</strong></span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Unmetered Buyer Radar Scrapes</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Affiliate Pro AI Hub Cross-Connection</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-slate-900">
                  <PayPalBuyButton
                    hostedButtonId="ZGT7S2VPTE4D4"
                    itemName="Cash Captain Marketeer Founder Lifetime License (Unlimited Slots)"
                    amount={197}
                    businessEmail={paypalRecipient}
                  />
                </div>
              </div>
            </div>

            {/* Commercial Add-ons */}
            <div className="bg-[#060913] p-3.5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  Power Suite Add-Ons:
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Pay Once &bull; Lifetime Use</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-blue-500/30 flex items-center justify-between gap-2">
                  <div>
                    <strong className="text-white block text-xs">Add AI Multi-Offer Hub</strong>
                    <span className="text-slate-400 text-[11px]">Affiliate Pro Syndicator</span>
                  </div>
                  <a
                    href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                      paypalRecipient
                    )}&item_name=Affiliate+Pro+AI+Multi-Offer+Hub+Add-on&amount=47.00&currency_code=USD`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs rounded transition whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    Add (+$47) &rarr;
                  </a>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-purple-500/30 flex items-center justify-between gap-2">
                  <div>
                    <strong className="text-white block text-xs">Add AI Traffic Assistant</strong>
                    <span className="text-slate-400 text-[11px]">Viral Video Hooks &amp; Shorts</span>
                  </div>
                  <a
                    href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
                      paypalRecipient
                    )}&item_name=Affiliate+Viral+AI+Traffic+Assistant+Add-on&amount=47.00&currency_code=USD`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs rounded transition whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    Add (+$47) &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* License Key Activation Form */}
        <div className="border-t border-slate-800/80 pt-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Already Bought? Activate Your License Key:</span>
          </h3>

          <form onSubmit={handleActivate} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter License Key (e.g. CCM-PRO-... or CCM-7A8B-...)"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Activate Key
              </button>
            </div>

            {activationResult && (
              <div
                className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  activationResult.success
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-300 border border-red-500/30'
                }`}
              >
                {activationResult.success ? (
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{activationResult.message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
