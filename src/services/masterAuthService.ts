import { MasterAuthSession, GeneratedLicenseKey, MasterAppSettings } from '../types';

const MASTER_SESSION_KEY = 'cashcaptin_master_auth';
const MASTER_PIN_KEY = 'cashcaptin_master_pin';
const LICENSES_KEY = 'cashcaptin_generated_licenses';
const APP_SETTINGS_KEY = 'cashcaptin_master_app_settings';

// Master Owner Defaults
export const MASTER_OWNER_EMAIL = 'tymesup4us@gmail.com';
export const MASTER_OWNER_NAME = 'Ty Birchfield';
export const DEFAULT_MASTER_KEY = 'CAPTAIN-MASTER-2026-VIRBIS';
export const DEFAULT_MASTER_PIN = '777888';

// Live application URL helper
export function getLiveAppOrigin(): string {
  if (typeof window !== 'undefined' && window.location.origin) {
    const origin = window.location.origin;
    if (origin.includes('ais-pre-')) {
      return origin.replace('ais-pre-', 'ais-dev-');
    }
    if (origin.startsWith('https://') && !origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return origin;
    }
    return origin;
  }
  return 'https://ais-dev-qys7kmq2tbrzxgktb5qd4i-21093015917.us-east1.run.app';
}

export const DEFAULT_APP_SETTINGS: MasterAppSettings = {
  appName: 'Cash Captain Marketeer™',
  brandTagline: 'Autonomous AI Buyer Radar, Zero-Ban Compliance & Automatic Link Placement',
  companyName: 'Y.W.G.T Online! • A Virbis.com Company',
  supportEmail: 'yeahwegotthat@proton.me',
  paypalEmail: 'yeahwegotthat@proton.me',
  liveDomain: getLiveAppOrigin(),
  showAnnouncementBar: false,
  announcementBarText: 'Official Commercial Release • Verified Live Engine'
};

export function getMasterAppSettings(): MasterAppSettings {
  const currentOrigin = getLiveAppOrigin();
  try {
    const raw = localStorage.getItem(APP_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate dead / unhosted placeholder domain or 404 pre domain to verified live URL
      if (
        !parsed.liveDomain ||
        parsed.liveDomain.includes('cash-captain.web.app') ||
        parsed.liveDomain.includes('ais-pre-')
      ) {
        parsed.liveDomain = currentOrigin;
      }
      // Ensure business payment address is set to official yeahwegotthat@proton.me
      if (!parsed.paypalEmail || parsed.paypalEmail.includes('tybirchfield42')) {
        parsed.paypalEmail = 'yeahwegotthat@proton.me';
      }
      return { ...DEFAULT_APP_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse app settings', e);
  }
  return { ...DEFAULT_APP_SETTINGS, liveDomain: currentOrigin };
}

export function saveMasterAppSettings(settings: MasterAppSettings): void {
  try {
    localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save app settings', e);
  }
}

export function getMasterPin(): string {
  try {
    return localStorage.getItem(MASTER_PIN_KEY) || DEFAULT_MASTER_PIN;
  } catch {
    return DEFAULT_MASTER_PIN;
  }
}

export function setMasterPin(newPin: string): void {
  try {
    localStorage.setItem(MASTER_PIN_KEY, newPin.trim());
  } catch (e) {
    console.error('Failed to save master PIN', e);
  }
}

export function getMasterSession(): MasterAuthSession {
  try {
    const raw = localStorage.getItem(MASTER_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.isMasterLoggedIn === 'boolean') {
        return {
          ...parsed,
          viewMode: parsed.viewMode || (parsed.isMasterLoggedIn ? 'admin' : 'customer')
        };
      }
    }
  } catch (e) {
    console.error('Failed to parse master session', e);
  }

  // DEFAULT FOR ALL VISITORS / CUSTOMERS: Locked by default
  // No master banners, no owner emails, pure customer view
  return {
    isMasterLoggedIn: false,
    userEmail: '',
    userName: 'Customer / Guest',
    role: 'guest',
    viewMode: 'customer',
    loginTimestamp: new Date().toISOString()
  };
}

export function saveMasterSession(session: MasterAuthSession): void {
  try {
    localStorage.setItem(MASTER_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save master session', e);
  }
}

export function toggleMasterViewMode(targetMode?: 'admin' | 'customer'): MasterAuthSession {
  const current = getMasterSession();
  const nextMode: 'admin' | 'customer' = targetMode || (current.viewMode === 'admin' ? 'customer' : 'admin');
  const updated: MasterAuthSession = {
    ...current,
    viewMode: nextMode
  };
  saveMasterSession(updated);
  return updated;
}

export function loginWithMasterCredentials(email: string, keyOrPin: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanKey = keyOrPin.trim();
  const activePin = getMasterPin();

  // Validate either Ty's email with PIN/Key OR direct Master Key
  const isEmailMatch = cleanEmail === MASTER_OWNER_EMAIL || cleanEmail === 'virbis.com' || cleanEmail.includes('tymesup');
  const isKeyMatch =
    cleanKey === activePin ||
    cleanKey === DEFAULT_MASTER_PIN ||
    cleanKey === DEFAULT_MASTER_KEY ||
    cleanKey.toUpperCase() === 'VIRBIS' ||
    cleanKey.toUpperCase() === 'CAPTAIN';

  if ((isEmailMatch && isKeyMatch) || cleanKey === DEFAULT_MASTER_KEY || cleanKey === activePin) {
    const session: MasterAuthSession = {
      isMasterLoggedIn: true,
      userEmail: MASTER_OWNER_EMAIL,
      userName: MASTER_OWNER_NAME,
      role: 'master_creator',
      viewMode: 'admin',
      loginTimestamp: new Date().toISOString()
    };
    saveMasterSession(session);
    return true;
  }
  return false;
}

export function quickLoginMaster(): MasterAuthSession {
  const session: MasterAuthSession = {
    isMasterLoggedIn: true,
    userEmail: MASTER_OWNER_EMAIL,
    userName: MASTER_OWNER_NAME,
    role: 'master_creator',
    viewMode: 'admin',
    loginTimestamp: new Date().toISOString()
  };
  saveMasterSession(session);
  return session;
}

export function logoutMaster(): void {
  const session: MasterAuthSession = {
    isMasterLoggedIn: false,
    userEmail: '',
    userName: 'Customer / Guest',
    role: 'guest',
    viewMode: 'customer',
    loginTimestamp: new Date().toISOString()
  };
  saveMasterSession(session);
}

// License Key Minting & Management
const INITIAL_LICENSES: GeneratedLicenseKey[] = [
  {
    id: 'lic-master-001',
    key: 'CCM-7A8B-9C0D-TY01',
    customerName: 'Ty Birchfield (Master Account)',
    customerEmail: 'tymesup4us@gmail.com',
    createdAt: '2026-10-30T10:00:00.000Z',
    plan: 'Lifetime Master',
    status: 'Active',
    activationsCount: 1
  },
  {
    id: 'lic-demo-002',
    key: 'CCM-VIP-COMMERCIAL-99',
    customerName: 'Virbis Enterprise Station',
    customerEmail: 'support@virbis.com',
    createdAt: '2026-10-30T11:00:00.000Z',
    plan: 'Commercial Agency',
    status: 'Active',
    activationsCount: 1
  }
];

export function getGeneratedLicenses(): GeneratedLicenseKey[] {
  try {
    const raw = localStorage.getItem(LICENSES_KEY);
    if (!raw) {
      localStorage.setItem(LICENSES_KEY, JSON.stringify(INITIAL_LICENSES));
      return INITIAL_LICENSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LICENSES;
  }
}

export function mintNewLicenseKey(
  customerName: string,
  customerEmail: string,
  plan: 'Single Station' | 'Commercial Agency' | 'Lifetime Master'
): GeneratedLicenseKey {
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const key = `CCM-${randomPart}-${randomPart2}-2026`;

  const newLicense: GeneratedLicenseKey = {
    id: `lic-${Date.now()}`,
    key,
    customerName: customerName.trim() || 'New Customer',
    customerEmail: customerEmail.trim() || 'buyer@example.com',
    createdAt: new Date().toISOString(),
    plan,
    status: 'Active',
    activationsCount: 0
  };

  const existing = getGeneratedLicenses();
  const updated = [newLicense, ...existing];
  try {
    localStorage.setItem(LICENSES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save minted license', e);
  }
  return newLicense;
}

export function revokeLicenseKey(id: string): GeneratedLicenseKey[] {
  const existing = getGeneratedLicenses();
  const updated = existing.map((lic) => (lic.id === id ? { ...lic, status: 'Revoked' as const } : lic));
  try {
    localStorage.setItem(LICENSES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update license', e);
  }
  return updated;
}
