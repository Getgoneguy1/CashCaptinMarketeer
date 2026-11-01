import { GeneratedLicenseKey } from '../types';
import { getGeneratedLicenses, MASTER_OWNER_EMAIL } from './masterAuthService';

export type LicenseTier = 'starter' | 'pro' | 'lifetime' | 'master_developer';

export interface ConsumedSlot {
  slotNumber: number;
  offerId: string;
  productName: string;
  deployedAt: string;
  leadsCount: number;
}

export interface UserLicenseState {
  tier: LicenseTier;
  licenseKey?: string;
  customerName?: string;
  customerEmail?: string;
  totalSlotsAllowed: number;
  consumedSlots: ConsumedSlot[];
  maxLeadsPerProduct: number; // 5 for starter, unlimited (999) for pro/lifetime
  maxChannelsPerProduct: number; // 2 for starter, all (15) for pro/lifetime
  activatedAt?: string;
}

const USER_LICENSE_KEY = 'cashcaptain_user_license';

export const TIER_LIMITS = {
  starter: {
    name: 'Starter License',
    slots: 3,
    maxLeads: 5,
    maxChannels: 2,
    price: '$47'
  },
  pro: {
    name: 'Captain Pro',
    slots: 15,
    maxLeads: 50,
    maxChannels: 15,
    price: '$97'
  },
  lifetime: {
    name: 'Founder Lifetime Master',
    slots: 999999,
    maxLeads: 999999,
    maxChannels: 999999,
    price: '$197'
  },
  master_developer: {
    name: 'Master Developer (Ty Birchfield)',
    slots: 999999,
    maxLeads: 999999,
    maxChannels: 999999,
    price: '$0 (Owner)'
  }
};

const DEFAULT_USER_LICENSE: UserLicenseState = {
  tier: 'starter',
  licenseKey: undefined,
  totalSlotsAllowed: 3,
  consumedSlots: [],
  maxLeadsPerProduct: 5,
  maxChannelsPerProduct: 2
};

export function getUserLicense(): UserLicenseState {
  try {
    const raw = localStorage.getItem(USER_LICENSE_KEY);
    if (raw) {
      const parsed: UserLicenseState = JSON.parse(raw);
      // Ensure data integrity
      return {
        ...DEFAULT_USER_LICENSE,
        ...parsed,
        consumedSlots: Array.isArray(parsed.consumedSlots) ? parsed.consumedSlots : []
      };
    }
  } catch (e) {
    console.error('Failed to parse user license', e);
  }
  return DEFAULT_USER_LICENSE;
}

export function saveUserLicense(state: UserLicenseState): void {
  try {
    localStorage.setItem(USER_LICENSE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save user license', e);
  }
}

/**
 * Checks if user can deploy a new product campaign.
 * Permanent slot model: Deleting an offer does NOT restore a consumed slot,
 * preventing users from recycling 3 slots indefinitely.
 */
export function canDeployNewOffer(isMasterUser: boolean): {
  allowed: boolean;
  consumedCount: number;
  totalAllowed: number;
  remainingSlots: number;
  tier: LicenseTier;
} {
  if (isMasterUser) {
    return {
      allowed: true,
      consumedCount: 0,
      totalAllowed: 999999,
      remainingSlots: 999999,
      tier: 'master_developer'
    };
  }

  const lic = getUserLicense();
  if (lic.tier === 'lifetime' || lic.tier === 'master_developer') {
    return {
      allowed: true,
      consumedCount: lic.consumedSlots.length,
      totalAllowed: 999999,
      remainingSlots: 999999,
      tier: lic.tier
    };
  }

  const consumed = lic.consumedSlots.length;
  const total = lic.totalSlotsAllowed;
  const remaining = Math.max(0, total - consumed);

  return {
    allowed: consumed < total,
    consumedCount: consumed,
    totalAllowed: total,
    remainingSlots: remaining,
    tier: lic.tier
  };
}

/**
 * Consumes a permanent campaign slot for the user's license.
 */
export function consumeCampaignSlot(
  offerId: string,
  productName: string,
  leadsCount: number,
  isMasterUser: boolean
): boolean {
  if (isMasterUser) return true;

  const lic = getUserLicense();
  if (lic.tier === 'lifetime' || lic.tier === 'master_developer') {
    // Record slot usage for analytics without blocking
    lic.consumedSlots.push({
      slotNumber: lic.consumedSlots.length + 1,
      offerId,
      productName,
      deployedAt: new Date().toISOString(),
      leadsCount
    });
    saveUserLicense(lic);
    return true;
  }

  if (lic.consumedSlots.length >= lic.totalSlotsAllowed) {
    return false; // Quota exceeded
  }

  lic.consumedSlots.push({
    slotNumber: lic.consumedSlots.length + 1,
    offerId,
    productName,
    deployedAt: new Date().toISOString(),
    leadsCount
  });

  saveUserLicense(lic);
  return true;
}

/**
 * Activates a license key provided by the customer.
 */
export function activateLicenseKey(inputKey: string, userEmail?: string): {
  success: boolean;
  message: string;
  tier?: LicenseTier;
} {
  const cleanKey = inputKey.trim().toUpperCase();

  // Master Developer Bypass
  if (
    cleanKey === 'CAPTAIN-MASTER-2026-VIRBIS' ||
    (userEmail && userEmail.toLowerCase() === MASTER_OWNER_EMAIL.toLowerCase())
  ) {
    const masterState: UserLicenseState = {
      tier: 'master_developer',
      licenseKey: cleanKey,
      customerEmail: MASTER_OWNER_EMAIL,
      customerName: 'Ty Birchfield (Master Developer)',
      totalSlotsAllowed: 999999,
      maxLeadsPerProduct: 999999,
      maxChannelsPerProduct: 999999,
      consumedSlots: getUserLicense().consumedSlots,
      activatedAt: new Date().toISOString()
    };
    saveUserLicense(masterState);
    return {
      success: true,
      message: 'Master Developer privileges unlocked ($0 cost, unmetered access).',
      tier: 'master_developer'
    };
  }

  // Check generated / minted licenses from Ty's master desk
  const generatedLicenses = getGeneratedLicenses();
  const match = generatedLicenses.find((l) => l.key.toUpperCase() === cleanKey && l.status === 'Active');

  if (match) {
    let newTier: LicenseTier = 'pro';
    let allowedSlots = 15;
    let leadsLimit = 50;
    let channelsLimit = 15;

    if (match.plan === 'Lifetime Master') {
      newTier = 'lifetime';
      allowedSlots = 999999;
      leadsLimit = 999999;
      channelsLimit = 999999;
    } else if (match.plan === 'Single Station') {
      newTier = 'starter';
      allowedSlots = 3;
      leadsLimit = 5;
      channelsLimit = 2;
    }

    const currentLic = getUserLicense();
    const updatedState: UserLicenseState = {
      ...currentLic,
      tier: newTier,
      licenseKey: match.key,
      customerName: match.customerName,
      customerEmail: match.customerEmail,
      totalSlotsAllowed: allowedSlots,
      maxLeadsPerProduct: leadsLimit,
      maxChannelsPerProduct: channelsLimit,
      activatedAt: new Date().toISOString()
    };

    saveUserLicense(updatedState);
    return {
      success: true,
      message: `Successfully activated ${match.plan}! Your account has been upgraded with ${allowedSlots === 999999 ? 'unlimited' : allowedSlots} slots.`,
      tier: newTier
    };
  }

  // Generic key pattern fallback (e.g. CCM-PRO-*, CCM-LIFETIME-*)
  if (cleanKey.includes('LIFETIME')) {
    const currentLic = getUserLicense();
    const updatedState: UserLicenseState = {
      ...currentLic,
      tier: 'lifetime',
      licenseKey: cleanKey,
      totalSlotsAllowed: 999999,
      maxLeadsPerProduct: 999999,
      maxChannelsPerProduct: 999999,
      activatedAt: new Date().toISOString()
    };
    saveUserLicense(updatedState);
    return {
      success: true,
      message: 'Founder Lifetime Master activated! Unlimited permanent campaign slots unlocked.',
      tier: 'lifetime'
    };
  }

  if (cleanKey.includes('PRO')) {
    const currentLic = getUserLicense();
    const updatedState: UserLicenseState = {
      ...currentLic,
      tier: 'pro',
      licenseKey: cleanKey,
      totalSlotsAllowed: 15,
      maxLeadsPerProduct: 50,
      maxChannelsPerProduct: 15,
      activatedAt: new Date().toISOString()
    };
    saveUserLicense(updatedState);
    return {
      success: true,
      message: 'Captain Pro License activated! 15 permanent campaign slots unlocked.',
      tier: 'pro'
    };
  }

  return {
    success: false,
    message: 'Invalid license key. Please check the key provided in your PayPal confirmation or contact support.'
  };
}

/**
 * Checks whether user has already purchased a paid license to Cash Captain.
 * Licensed users receive 50% VIP discount on AI Hub & AI Assistant add-ons.
 */
export function isCashCaptainLicenseHolder(userLicense?: UserLicenseState, isMasterUser?: boolean): boolean {
  if (isMasterUser) return true;
  const lic = userLicense || getUserLicense();
  if (lic.tier === 'pro' || lic.tier === 'lifetime' || lic.tier === 'master_developer') {
    return true;
  }
  if (lic.licenseKey && lic.licenseKey.trim().length > 0) {
    return true;
  }
  if (lic.activatedAt) {
    return true;
  }
  return false;
}

export interface AddonAppState {
  isSubscribed: boolean;
  isSignedIn: boolean;
  userEmail?: string;
  isLinked: boolean;
  licenseKey?: string;
  activatedAt?: string;
}

const ADDON_STORAGE_PREFIX = 'cashcaptain_addon_';

export function getAddonAppState(appId: 'hub' | 'viral', isMasterUser?: boolean): AddonAppState {
  if (isMasterUser) {
    return {
      isSubscribed: true,
      isSignedIn: true,
      userEmail: 'yeahwegotthat@proton.me',
      isLinked: true,
      licenseKey: 'MASTER-SUITE-UNLOCKED',
      activatedAt: new Date().toISOString()
    };
  }

  try {
    const raw = localStorage.getItem(`${ADDON_STORAGE_PREFIX}${appId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(`Failed to load ${appId} state`, e);
  }

  return {
    isSubscribed: false,
    isSignedIn: false,
    isLinked: false
  };
}

export function saveAddonAppState(appId: 'hub' | 'viral', state: AddonAppState): void {
  try {
    localStorage.setItem(`${ADDON_STORAGE_PREFIX}${appId}`, JSON.stringify(state));
  } catch (e) {
    console.error(`Failed to save ${appId} state`, e);
  }
}
