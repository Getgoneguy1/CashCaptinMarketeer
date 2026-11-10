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
  ArrowRight,
  Copy,
  Gift,
  Users,
  Eye
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

interface GrantedFreeKey {
  id: string;
  key: string;
  recipient: string;
  tierLabel: string;
  date: string;
}

const STORAGE_GRANTED_KEYS = 'cashcaptain_granted_free_keys_v1';

function getStoredGrantedKeys(): GrantedFreeKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_GRANTED_KEYS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'default-1',
      key: 'CCM-SPONSOR-VIP-2026',
      recipient: 'Official Sponsor Trial',
      tierLabel: 'Sponsor Trial (Unlimited Slots)',
      date: new Date().toLocaleDateString()
    },
    {
      id: 'default-2',
      key: 'CCM-TESTGROUP-PILOT-2026',
      recipient: 'Beta Test Group #1',
      tierLabel: 'Beta Test Group (15 Slots)',
      date: new Date().toLocaleDateString()
    }
  ];
}

function saveStoredGrantedKeys(keys: GrantedFreeKey[]) {
  try {
    localStorage.setItem(STORAGE_GRANTED_KEYS, JSON.stringify(keys));
  } catch {}
}

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

  // Free License Key Generator states for Ty (Master User)
  const [grantedKeys, setGrantedKeys] = useState<GrantedFreeKey[]>(() => getStoredGrantedKeys());
  const [grantType, setGrantType] = useState<'sponsor' | 'test_group' | 'trial' | 'vip'>('sponsor');
  const [recipientNote, setRecipientNote] = useState('');
  const [newlyMintedKey, setNewlyMintedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedInvite, setCopiedInvite] = useState<boolean>(false);
  const [showPublicCustomerView, setShowPublicCustomerView] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTierInfo = isMasterUser
    ? TIER_LIMITS.master_developer
    : TIER_LIMITS[licenseState.tier] || TIER_LIMITS.starter;

  const consumedSlots = licenseState.consumedSlots || [];
  const totalSlots = isMasterUser ? 999999 : licenseState.totalSlotsAllowed;
  const remainingSlots = isMasterUser ? 999999 : Math.max(0, totalSlots - consumedSlots.length);

  const paypalRecipient = appSettings?.paypalEmail || 'yeahwegotthat@proton.me';

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

  const handleGenerateFreeKey = (e: React.FormEvent) => {
    e.preventDefault();
    const tag =
      grantType === 'sponsor'
        ? 'SPONSOR'
        : grantType === 'test_group'
        ? 'TESTGROUP'
        : grantType === 'trial'
        ? 'TRIAL'
        : 'VIP';

    const randHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const key = `CCM-${tag}-${randHex}-2026`;

    const tierLabel =
      grantType === 'sponsor'
        ? 'Sponsor VIP Trial (All Channels, Unlimited Slots)'
        : grantType === 'test_group'
        ? 'Beta Test Group (15 Campaign Slots)'
        : grantType === 'trial'
        ? 'Sponsor 30-Day Campaign Trial'
        : 'VIP Partner / Influencer Pass';

    const newRecord: GrantedFreeKey = {
      id: `grant-${Date.now()}`,
      key,
      recipient: recipientNote.trim() || `${tag} Partner`,
      tierLabel,
      date: new Date().toLocaleDateString()
    };

    const updated = [newRecord, ...grantedKeys];
    setGrantedKeys(updated);
    saveStoredGrantedKeys(updated);
    setNewlyMintedKey(key);
    setRecipientNote('');
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(identifier);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const inviteMessage = newlyMintedKey
    ? `Here is your complimentary access key to Cash Captain Marketeer: ${newlyMintedKey}\n\n1. Open the app\n2. Click "Buy License" or "Log In"\n3. Enter your key in "Activate Your License Key" for instant full access.`
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b101d] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <KeyRound className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">License &amp; Access Center</h2>
            <p className="text-xs text-slate-400">
              {isMasterUser && !showPublicCustomerView
                ? 'Your Master Version is 100% unlocked. Issue free trial keys for sponsors, test groups & partners.'
                : 'Choose your license tier to unlock campaign slots and autonomous buyer radar placement.'}
            </p>
          </div>
        </div>

        {/* Master User Status Overview */}
        {isMasterUser && (
          <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Master Creator Version: 100% Usage Unlocked (Unlimited Slots)</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                Permanent Lifetime
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Your version has all 38+ buyer radar channels and unmetered campaign slots permanently active with zero quota limits.
            </p>
          </div>
        )}

        {/* MASTER USER TOOL: GRANT FREE LICENSES (SPONSORS, TEST GROUPS, TRIALS) */}
        {isMasterUser && !showPublicCustomerView && (
          <div className="bg-[#060913] p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-400" />
                <span>Grant Free License Key (Sponsors, Test Groups &amp; Trials)</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">$0 Cost &bull; Instant Activation</span>
            </div>
            <p className="text-xs text-slate-400">
              Generate complimentary full-access license keys for a test group, a trial for a sponsor, or promotional partners.
            </p>

            <form onSubmit={handleGenerateFreeKey} className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Free License Purpose:
                  </label>
                  <select
                    value={grantType}
                    onChange={(e) => setGrantType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sponsor">Sponsor VIP Trial (Unlimited Access)</option>
                    <option value="test_group">Beta Test Group (15 Slots)</option>
                    <option value="trial">Sponsor 30-Day Campaign Trial</option>
                    <option value="vip">VIP Partner Pass (Unlimited Lifetime)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Recipient / Sponsor Name:
                  </label>
                  <input
                    type="text"
                    value={recipientNote}
                    onChange={(e) => setRecipientNote(e.target.value)}
                    placeholder="e.g. Acme Media Sponsor or Test Pilot #1"
                    className="w-full px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-slate-950" />
                <span>Generate Free License Key Now</span>
              </button>
            </form>

            {/* Display Newly Minted Key */}
            {newlyMintedKey && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    New Free License Key Generated:
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">Ready For Recipient</span>
                </div>
                <div className="p-2.5 bg-[#060913] rounded-lg border border-emerald-500/30 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-black text-emerald-400 tracking-wide select-all">
                    {newlyMintedKey}
                  </span>
                  <button
                    onClick={() => copyToClipboard(newlyMintedKey, newlyMintedKey)}
                    className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === newlyMintedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === newlyMintedKey ? 'Copied Key!' : 'Copy Key'}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteMessage);
                    setCopiedInvite(true);
                    setTimeout(() => setCopiedInvite(false), 2500);
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedInvite ? 'Invite Note Copied to Clipboard!' : 'Copy Full Invite Message for Sponsor/Tester'}</span>
                </button>
              </div>
            )}

            {/* Issued Keys Table */}
            {grantedKeys.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Previously Issued Free &amp; Trial Keys:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {grantedKeys.map((k) => (
                    <div
                      key={k.id}
                      className="p-2.5 rounded-lg bg-[#0c1222] border border-slate-800 flex items-center justify-between text-xs gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white truncate">{k.recipient}</span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                            {k.key}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">{k.tierLabel}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(k.key, k.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-semibold transition shrink-0 cursor-pointer"
                      >
                        {copiedKey === k.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle to Preview Public Customer Checkout View */}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowPublicCustomerView(true)}
                className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                Preview Public Customer Checkout View &rarr;
              </button>
            </div>
          </div>
        )}

        {/* PUBLIC CUSTOMER PACKAGES (SHOWN TO VISITORS/CUSTOMERS OR WHEN TY PREVIEWS IT) */}
        {(!isMasterUser || showPublicCustomerView) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#39ff14]" />
                <span>Purchase App License (Direct PayPal Checkout)</span>
              </h3>
              {isMasterUser && (
                <button
                  type="button"
                  onClick={() => setShowPublicCustomerView(false)}
                  className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  &larr; Back to Grant Free Licenses
                </button>
              )}
            </div>

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

        {/* License Key Activation Form (For Buyers, Sponsors & Testers) */}
        <div className="border-t border-slate-800/80 pt-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Already Have a Key? Activate Your License:</span>
          </h3>

          <form onSubmit={handleActivate} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter License Key (e.g. CCM-SPONSOR-... or CCM-PRO-...)"
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
