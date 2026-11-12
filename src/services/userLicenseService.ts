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
    name: 'Master Developer (Administrator)',
    slots: 999999,
    maxLeads: 999999,
    maxChannels: 999999,
    price: '$0 (Owner)'
  }
};

const DEFAULT_USER_LICENSE: UserLicenseState = {
  tier: 'lifetime',
  licenseKey: 'CASH-CAPTAIN-AUTOMATED-FULL-ACCESS',
  customerName: 'Licensed Marketeer',
  customerEmail: 'yeahwegotthat@proton.me',
  totalSlotsAllowed: 999999,
  consumedSlots: [],
  maxLeadsPerProduct: 999999,
  maxChannelsPerProduct: 999999
};

export function getUserLicense(): UserLicenseState {
  try {
    const raw = localStorage.getItem(USER_LICENSE_KEY);
    if (raw) {
      const parsed: UserLicenseState = JSON.parse(raw);
      return {
        ...DEFAULT_USER_LICENSE,
        ...parsed,
        tier: 'lifetime',
        totalSlotsAllowed: 999999,
        maxLeadsPerProduct: 999999,
        maxChannelsPerProduct: 999999,
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
 * Automated 100% full usage: always allowed with unlimited capacity.
 */
export function canDeployNewOffer(_isMasterUser?: boolean): {
  allowed: boolean;
  consumedCount: number;
  totalAllowed: number;
  remainingSlots: number;
  tier: LicenseTier;
} {
  return {
    allowed: true,
    consumedCount: 0,
    totalAllowed: 999999,
    remainingSlots: 999999,
    tier: 'lifetime'
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
      customerName: 'Master Developer',
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

  // Free / Sponsor / Trial / Beta / Test Group Keys
  if (
    cleanKey.includes('BETA') ||
    cleanKey.includes('SPONSOR') ||
    cleanKey.includes('FREE') ||
    cleanKey.includes('TRIAL') ||
    cleanKey.includes('TEST') ||
    cleanKey.includes('COMP')
  ) {
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
      message: 'Complimentary Access Key Activated! Unlimited campaign slots and all 38+ buyer radar channels unlocked.',
      tier: 'lifetime'
    };
  }

  return {
    success: false,
    message: 'Invalid license key. Please check the key provided in your confirmation or enter a valid access code.'
  };
}

export function isCashCaptainLicenseHolder(_userLicense?: UserLicenseState, _isMasterUser?: boolean): boolean {
  return true;
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

export function getAddonAppState(_appId: 'hub' | 'viral', _isMasterUser?: boolean): AddonAppState {
  return {
    isSubscribed: true,
    isSignedIn: true,
    userEmail: 'yeahwegotthat@proton.me',
    isLinked: true,
    licenseKey: 'CASH-CAPTAIN-SUITE-UNLOCKED',
    activatedAt: new Date().toISOString()
  };
}

export function saveAddonAppState(appId: 'hub' | 'viral', state: AddonAppState): void {
  try {
    localStorage.setItem(`${ADDON_STORAGE_PREFIX}${appId}`, JSON.stringify(state));
  } catch (e) {
    console.error(`Failed to save ${appId} state`, e);
  }
}
