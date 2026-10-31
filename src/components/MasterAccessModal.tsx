import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Crown,
  Lock,
  Unlock,
  Check,
  Copy,
  Plus,
  AlertCircle,
  Sparkles,
  LogOut,
  Eye,
  Sliders
} from 'lucide-react';
import {
  MasterAuthSession,
  GeneratedLicenseKey
} from '../types';
import {
  MASTER_OWNER_EMAIL,
  MASTER_OWNER_NAME,
  DEFAULT_MASTER_KEY,
  getMasterPin,
  setMasterPin,
  loginWithMasterCredentials,
  quickLoginMaster,
  logoutMaster,
  getGeneratedLicenses,
  mintNewLicenseKey,
  revokeLicenseKey,
  toggleMasterViewMode
} from '../services/masterAuthService';
import { activateLicenseKey } from '../services/userLicenseService';
import firebaseConfig from '../../firebase-applet-config.json';
import { CashCaptainLogo } from './CashCaptainLogo';

interface MasterAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterSession: MasterAuthSession;
  onSessionChange: (session: MasterAuthSession) => void;
}

export const MasterAccessModal: React.FC<MasterAccessModalProps> = ({
  isOpen,
  onClose,
  masterSession,
  onSessionChange
}) => {
  const [emailInput, setEmailInput] = useState(MASTER_OWNER_EMAIL);
  const [keyInput, setKeyInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // License Generator State
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPlan, setBuyerPlan] = useState<'Single Station' | 'Commercial Agency' | 'Lifetime Master'>('Single Station');
  const [licenses, setLicenses] = useState<GeneratedLicenseKey[]>(() => getGeneratedLicenses());

  // Master PIN change state
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinVal, setNewPinVal] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const success = loginWithMasterCredentials(emailInput, keyInput);
    if (success) {
      activateLicenseKey('CAPTAIN-MASTER-2026-VIRBIS', MASTER_OWNER_EMAIL);
      setSuccessMsg('Master Access granted! Welcome, Ty.');
      const updated: MasterAuthSession = {
        isMasterLoggedIn: true,
        userEmail: MASTER_OWNER_EMAIL,
        userName: MASTER_OWNER_NAME,
        role: 'master_creator',
        viewMode: 'admin',
        loginTimestamp: new Date().toISOString()
      };
      onSessionChange(updated);
      setKeyInput('');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg('Invalid credentials. Enter your Master PIN (777888) or Owner Key.');
    }
  };

  const handleQuickBypass = () => {
    activateLicenseKey('CAPTAIN-MASTER-2026-VIRBIS', MASTER_OWNER_EMAIL);
    const session = quickLoginMaster();
    onSessionChange(session);
    setSuccessMsg('Instant Master Access unlocked for Ty Birchfield.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleToggleMode = () => {
    const nextSession = toggleMasterViewMode();
    onSessionChange(nextSession);
    setSuccessMsg(`Switched view to: ${nextSession.viewMode === 'admin' ? 'Master Admin Mode' : 'Customer View Mode'}`);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleLogout = () => {
    logoutMaster();
    onSessionChange({
      isMasterLoggedIn: false,
      userEmail: '',
      userName: 'Customer / Guest',
      role: 'guest',
      viewMode: 'customer'
    });
    setSuccessMsg('Master session locked. Viewing as normal customer.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleMintLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      setErrorMsg('Please enter customer name or organization.');
      return;
    }
    const minted = mintNewLicenseKey(buyerName, buyerEmail, buyerPlan);
    setLicenses(getGeneratedLicenses());
    setBuyerName('');
    setBuyerEmail('');
    setSuccessMsg(`Minted license ${minted.key} for ${minted.customerName}!`);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  const handleRevoke = (id: string) => {
    const updated = revokeLicenseKey(id);
    setLicenses(updated);
  };

  const handleSavePin = () => {
    if (newPinVal.trim().length < 4) {
      setErrorMsg('PIN must be at least 4 digits/characters.');
      return;
    }
    setMasterPin(newPinVal.trim());
    setNewPinVal('');
    setIsChangingPin(false);
    setSuccessMsg('Master PIN successfully updated.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl shadow-emerald-500/10 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CashCaptainLogo className="w-12 h-12 shrink-0 drop-shadow-[0_2px_14px_rgba(57,255,20,0.35)]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Master Access Portal
                </h2>
                {masterSession.isMasterLoggedIn ? (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Registered Owner: <strong className="text-slate-200">{MASTER_OWNER_NAME}</strong> ({MASTER_OWNER_EMAIL})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
          {!masterSession.isMasterLoggedIn ? (
            /* LOCKED: Master Login Form */
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4" />
                  <span>Owner Authentication</span>
                </div>
                <p className="text-slate-400">
                  Enter your Master credentials to unlock full administrative authority, manage customer licenses, or edit application settings.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-3 bg-slate-950/90 p-4 rounded-xl border border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Owner Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="tymesup4us@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Master Security PIN / Key</span>
                    <span className="text-[11px] text-emerald-400 font-normal">PIN: 777888</span>
                  </label>
                  <input
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none tracking-widest"
                    placeholder="Enter Master PIN or Master Key"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Master Control</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickBypass}
                    className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    title="1-Click Owner Verification"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Owner 1-Click Verification</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* UNLOCKED: Master Control Center */
            <div className="space-y-5">
              {/* Active Master Banner with View Mode Switcher */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                    👑
                  </div>
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>Owner: {MASTER_OWNER_NAME}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold">
                        Mode: {masterSession.viewMode === 'admin' ? 'Master Admin' : 'Customer View'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Firebase: <span className="text-slate-300 font-mono">{firebaseConfig.projectId}</span> &bull; Alerts to <span className="text-emerald-300">{MASTER_OWNER_EMAIL}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMode}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    title="Toggle between Master Admin Mode and Customer View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{masterSession.viewMode === 'admin' ? 'Switch to Customer View' : 'Switch to Admin Mode'}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                    title="Lock session to test as a normal visitor"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Lock Master</span>
                  </button>
                </div>
              </div>

              {/* Master Credentials & Quick PIN Management */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>Master Security Credentials</span>
                  </div>
                  <button
                    onClick={() => setIsChangingPin(!isChangingPin)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer"
                  >
                    {isChangingPin ? 'Cancel' : 'Change Master PIN'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Primary Owner Email</div>
                    <div className="font-mono text-emerald-300 font-bold select-all">{MASTER_OWNER_EMAIL}</div>
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-slate-400 text-[11px]">Active Master PIN</div>
                      <div className="font-mono text-emerald-300 font-bold tracking-wider select-all">
                        {getMasterPin()}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(getMasterPin(), 'pin')}
                      className="text-slate-400 hover:text-white p-1"
                      title="Copy PIN"
                    >
                      {copiedKey === 'pin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {isChangingPin && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={newPinVal}
                      onChange={(e) => setNewPinVal(e.target.value)}
                      placeholder="Enter new 6-digit Master PIN"
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none flex-1"
                    />
                    <button
                      onClick={handleSavePin}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Save New PIN
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION: Mint Buyer License Keys */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Mint & Issue Buyer License Keys</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    For buyers purchasing via PayPal or Stripe
                  </span>
                </div>

                <form onSubmit={handleMintLicense} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Customer Name / Business"
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none sm:col-span-1"
                    required
                  />
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="Customer Email"
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none sm:col-span-1"
                  />
                  <select
                    value={buyerPlan}
                    onChange={(e) => setBuyerPlan(e.target.value as any)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none sm:col-span-1"
                  >
                    <option value="Single Station">Single Station ($149)</option>
                    <option value="Commercial Agency">Commercial Agency ($299)</option>
                    <option value="Lifetime Master">Lifetime Master ($499)</option>
                  </select>
                  <button
                    type="submit"
                    className="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-xs transition-all flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 cursor-pointer sm:col-span-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Mint Key</span>
                  </button>
                </form>

                {/* Issued License Keys Table */}
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Active Customer Licenses ({licenses.length})
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-800 rounded-lg p-2 bg-slate-900">
                    {licenses.map((lic) => (
                      <div
                        key={lic.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded bg-slate-950 border border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-300 font-bold">{lic.key}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                            {lic.plan}
                          </span>
                          <span className="text-slate-400 text-[11px]">• {lic.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lic.status === 'Active' ? (
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                              Revoked
                            </span>
                          )}
                          <button
                            onClick={() => copyToClipboard(lic.key, lic.id)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                            title="Copy License Key"
                          >
                            {copiedKey === lic.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {lic.status === 'Active' && (
                            <button
                              onClick={() => handleRevoke(lic.id)}
                              className="text-[10px] text-rose-400 hover:text-rose-300 underline cursor-pointer"
                              title="Revoke License"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Master System Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
