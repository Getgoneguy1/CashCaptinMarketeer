import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Crown,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogOut,
  ExternalLink,
  Zap,
  ArrowRight
} from 'lucide-react';
import {
  AppUserProfile,
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  continueAsGuest,
  logoutUser,
  requestPasswordReset
} from '../services/userAuthService';
import {
  MASTER_OWNER_EMAIL,
  DEFAULT_MASTER_KEY,
  getMasterPin,
  loginWithMasterCredentials,
  quickLoginMaster
} from '../services/masterAuthService';
import { MasterAuthSession } from '../types';
import { getUserLicense, activateLicenseKey, TIER_LIMITS } from '../services/userLicenseService';
import { CashCaptainLogo } from './CashCaptainLogo';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUserProfile | null;
  onUserChanged: (user: AppUserProfile | null) => void;
  onMasterSessionChanged: (session: MasterAuthSession) => void;
  onOpenLicenseModal?: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  onMasterSessionChanged,
  onOpenLicenseModal
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'master' | 'account'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [masterPin, setMasterPinInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const license = getUserLicense();
  const currentTierInfo = TIER_LIMITS[license.tier] || TIER_LIMITS.starter;
  const consumed = license.consumedSlots || [];
  const remainingSlots = Math.max(0, license.totalSlotsAllowed - consumed.length);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter your email and password.' });
      return;
    }
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const user = await loginWithEmail(email, password);
      onUserChanged(user);
      if (user.isMasterOwner) {
        onMasterSessionChanged({
          isMasterLoggedIn: true,
          userEmail: MASTER_OWNER_EMAIL,
          userName: 'Master Administrator',
          role: 'master_creator',
          viewMode: 'admin',
          loginTimestamp: new Date().toISOString()
        });
      }
      setStatusMsg({ type: 'success', text: `Welcome back, ${user.displayName}!` });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Invalid email or password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter your email and password.' });
      return;
    }
    if (password.length < 6) {
      setStatusMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const user = await registerWithEmail(email, password, fullName);
      onUserChanged(user);
      setStatusMsg({ type: 'success', text: 'Account created! 3 Free Campaign Slots activated.' });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to create account.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setStatusMsg(null);
    try {
      const user = await loginWithGoogle();
      onUserChanged(user);
      setStatusMsg({ type: 'success', text: `Signed in as ${user.displayName} via Google!` });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Google sign in failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = () => {
    const guest = continueAsGuest();
    onUserChanged(guest);
    setStatusMsg({ type: 'success', text: 'Continuing as Guest Marketeer (Local Session Active).' });
    setTimeout(() => {
      setStatusMsg(null);
      onClose();
    }, 1000);
  };

  const handleMasterLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStatusMsg(null);
    const valid = loginWithMasterCredentials(MASTER_OWNER_EMAIL, masterPin);
    if (valid) {
      activateLicenseKey('CAPTAIN-MASTER-2026-VIRBIS', MASTER_OWNER_EMAIL);
      const masterProfile: AppUserProfile = {
        uid: 'master_administrator',
        email: MASTER_OWNER_EMAIL,
        displayName: 'Master Administrator',
        isAnonymous: false,
        isMasterOwner: true,
        licenseTier: 'master_developer',
        createdAt: new Date().toISOString()
      };
      onUserChanged(masterProfile);
      onMasterSessionChanged({
        isMasterLoggedIn: true,
        userEmail: MASTER_OWNER_EMAIL,
        userName: 'Master Administrator',
        role: 'master_creator',
        viewMode: 'admin',
        loginTimestamp: new Date().toISOString()
      });
      setStatusMsg({ type: 'success', text: 'Master Administrator Access Unlocked!' });
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1200);
    } else {
      setStatusMsg({ type: 'error', text: 'Invalid Master PIN.' });
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    onUserChanged(null);
    onMasterSessionChanged({
      isMasterLoggedIn: false,
      userEmail: '',
      userName: 'Guest',
      role: 'guest',
      viewMode: 'customer'
    });
    setStatusMsg({ type: 'success', text: 'Signed out successfully.' });
    setTimeout(() => {
      setStatusMsg(null);
      setActiveTab('signin');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0a0f1d] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#060913]">
          <div className="flex items-center gap-2.5">
            <CashCaptainLogo className="w-8 h-8" />
            <div>
              <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>Cash Captain Marketeer</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/20">
                  Account Portal
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Sign in to save your offers, links &amp; placement radar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 p-1 gap-1 text-xs">
          {currentUser ? (
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'account'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Account</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setActiveTab('signin');
                  setStatusMsg(null);
                }}
                className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'signin'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setStatusMsg(null);
                }}
                className={`flex-1 py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'register'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Register (Free)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenLicenseModal) onOpenLicenseModal();
                }}
                className="px-3 py-2 rounded-lg font-black transition flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-md shadow-emerald-500/20"
                title="Purchase License or Activate Key"
              >
                <span>💳 Buy License</span>
              </button>
            </>
          )}
        </div>

        {/* Toast Notification */}
        {statusMsg && (
          <div
            className={`mx-4 mt-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto max-h-[75vh]">
          {/* TAB 1: SIGN IN */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!email) {
                        setStatusMsg({ type: 'error', text: 'Enter your email above first.' });
                        return;
                      }
                      requestPasswordReset(email)
                        .then(() => setStatusMsg({ type: 'success', text: 'Password reset link sent to your email.' }))
                        .catch((e) => setStatusMsg({ type: 'error', text: e.message }));
                    }}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to My Account'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-slate-800 w-full"></div>
                <span className="bg-[#0a0f1d] px-2 text-[10px] text-slate-500 uppercase tracking-widest absolute">or</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.37 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Guest Mode</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Choose Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Free Starter Plan Included:</span>
                </div>
                <p>&bull; 3 Permanent Autonomous Campaign Slots</p>
                <p>&bull; Top 5 High-Intent Buyer Discussions Per Offer</p>
                <p>&bull; 100% Free Lifetime Account</p>
              </div>

              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-[11px] text-slate-300 flex items-center justify-between gap-2">
                <div>
                  <strong className="text-white block text-xs">Want More Campaign Slots?</strong>
                  <span className="text-slate-400">Upgrade to Pro ($97) or Founder Lifetime ($197)</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenLicenseModal) onOpenLicenseModal();
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition shrink-0 cursor-pointer shadow-sm"
                >
                  Buy License &rarr;
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Create Free Account & Claim 3 Slots'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </form>
          )}

          {/* TAB 3: MASTER ACCESS (TY BIRCHFIELD) */}
          {activeTab === 'master' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start gap-2.5">
                <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300">Creator &amp; Proprietary Owner Portal</strong>
                  Enter Master PIN (777888) to unlock full administrator privileges, unmetered campaign slots, and commercial controls.
                </div>
              </div>

              <form onSubmit={handleMasterLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Master PIN or Owner Key</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={masterPin}
                      onChange={(e) => setMasterPinInput(e.target.value)}
                      placeholder="Enter 777888 or Owner Key"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>Verify Master Credentials</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: MY ACCOUNT (LOGGED IN) */}
          {activeTab === 'account' && currentUser && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400">Signed In As</span>
                    <h3 className="text-sm font-black text-white">{currentUser.displayName}</h3>
                    <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black uppercase font-mono border ${
                      currentUser.isMasterOwner
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : license.tier === 'lifetime'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : license.tier === 'pro'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {currentUser.isMasterOwner ? 'Master Creator' : currentTierInfo.name}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Campaign Slot Quota:</span>
                  <span className="font-bold text-white font-mono">
                    {currentUser.isMasterOwner ? 'Unlimited (∞)' : `${consumed.length} / ${license.totalSlotsAllowed} Consumed`}
                  </span>
                </div>

                {!currentUser.isMasterOwner && (
                  <button
                    onClick={() => {
                      onClose();
                      if (onOpenLicenseModal) onOpenLicenseModal();
                    }}
                    className="w-full py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buy License or Activate Key</span>
                  </button>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
