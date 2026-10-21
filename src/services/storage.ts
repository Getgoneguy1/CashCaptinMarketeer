import { Offer, TrackingMetrics, ClickEvent, BuildLogEntry, AffiliateProConfig } from '../types';
import { INITIAL_OFFERS, INITIAL_TRACKING } from '../data/initialData';
import { generateMarketingStrategy } from './aiGenerator';

const STORAGE_KEYS = {
  OFFERS: 'cashcaptin_offers',
  TRACKING: 'cashcaptin_tracking',
  CLICKS: 'cashcaptin_click_events',
  LOGS: 'cashcaptin_build_logs',
  AFFILIATE_PRO: 'cashcaptin_affiliate_pro_config'
};

export const INITIAL_AFFILIATE_PRO: AffiliateProConfig = {
  enabled: false,
  appUrl: '',
  webhookUrl: '',
  syncMode: 'webhook'
};

export function getStoredOffers(): Offer[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFERS);
    if (!raw) {
      saveOffers(INITIAL_OFFERS);
      return INITIAL_OFFERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load offers from localStorage', err);
    return INITIAL_OFFERS;
  }
}

export function saveOffers(offers: Offer[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
  } catch (err) {
    console.error('Failed to save offers', err);
  }
}

export function getStoredTracking(): TrackingMetrics {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRACKING);
    if (!raw) {
      saveTracking(INITIAL_TRACKING);
      return INITIAL_TRACKING;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load tracking', err);
    return INITIAL_TRACKING;
  }
}

export function saveTracking(tracking: TrackingMetrics): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TRACKING, JSON.stringify(tracking));
  } catch (err) {
    console.error('Failed to save tracking', err);
  }
}

export function getStoredClicks(): ClickEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLICKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function getStoredAffiliatePro(): AffiliateProConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AFFILIATE_PRO);
    if (!raw) return INITIAL_AFFILIATE_PRO;
    return JSON.parse(raw);
  } catch {
    return INITIAL_AFFILIATE_PRO;
  }
}

export function saveAffiliatePro(config: AffiliateProConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AFFILIATE_PRO, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save Affiliate Pro config', err);
  }
}

export function recordClick(
  offerId: string,
  offerName: string,
  affiliateId: string,
  targetUrl: string,
  query?: string
): ClickEvent {
  const currentClicks = getStoredClicks();
  const currentTracking = getStoredTracking();
  const offers = getStoredOffers();
  const proConfig = getStoredAffiliatePro();

  const newEvent: ClickEvent = {
    id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    offerId,
    offerName,
    affiliateId,
    targetUrl,
    query,
    timestamp: new Date().toISOString(),
    converted: false
  };

  const updatedEvents = [newEvent, ...currentClicks].slice(0, 100);
  try {
    localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(updatedEvents));
  } catch (err) {
    console.error('Failed to save click event', err);
  }

  // Update total tracking metrics
  const updatedTracking: TrackingMetrics = {
    ...currentTracking,
    clicks: currentTracking.clicks + 1,
    lastUpdated: new Date().toISOString()
  };
  saveTracking(updatedTracking);

  // Update per-offer clicks
  const updatedOffers = offers.map(o => {
    if (o.id === offerId) {
      return {
        ...o,
        clicks: (o.clicks || 0) + 1
      };
    }
    return o;
  });
  saveOffers(updatedOffers);

  // If Affiliate Pro Webhook is enabled, fire an asynchronous postback ping
  if (proConfig.enabled && proConfig.webhookUrl) {
    try {
      fetch(proConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'click',
          offer_id: offerId,
          offer_name: offerName,
          affiliate_id: affiliateId,
          query: query || '',
          target_url: targetUrl,
          timestamp: newEvent.timestamp,
          source: 'CashCaptinMarketeer'
        })
      }).catch(err => {
        console.warn('Affiliate Pro webhook ping error:', err);
      });
    } catch (e) {
      // safe ignore
    }
  }

  return newEvent;
}

export function recordConversion(
  offerId: string,
  revenueAmount: number,
  clickId?: string
): void {
  const currentTracking = getStoredTracking();
  const offers = getStoredOffers();
  const clicks = getStoredClicks();
  const proConfig = getStoredAffiliatePro();

  saveTracking({
    ...currentTracking,
    conversions: currentTracking.conversions + 1,
    revenue: Number((currentTracking.revenue + revenueAmount).toFixed(2)),
    lastUpdated: new Date().toISOString()
  });

  const updatedOffers = offers.map(o => {
    if (o.id === offerId) {
      return {
        ...o,
        conversions: (o.conversions || 0) + 1,
        revenue: Number(((o.revenue || 0) + revenueAmount).toFixed(2))
      };
    }
    return o;
  });
  saveOffers(updatedOffers);

  if (clickId) {
    const updatedClicks = clicks.map(c => {
      if (c.id === clickId) return { ...c, converted: true };
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(updatedClicks));
  }

  // Notify Affiliate Pro if webhook configured
  if (proConfig.enabled && proConfig.webhookUrl) {
    try {
      fetch(proConfig.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'conversion',
          offer_id: offerId,
          revenue: revenueAmount,
          click_id: clickId,
          timestamp: new Date().toISOString(),
          source: 'CashCaptinMarketeer'
        })
      }).catch(err => console.warn('Affiliate Pro conversion ping error:', err));
    } catch (e) {
      // safe ignore
    }
  }
}

export function buildDeepLink(
  baseUrl: string,
  query: string,
  affiliateId: string
): string {
  const cleanBase = baseUrl.trim();
  const encodedQuery = encodeURIComponent(query.trim());
  const separator = cleanBase.includes('?') ? '&' : '?';
  return `${cleanBase}${encodedQuery}${separator}aff_id=${encodeURIComponent(affiliateId)}`;
}

export async function runBatchPipeline(
  offers: Offer[],
  onLog: (entry: BuildLogEntry) => void
): Promise<Offer[]> {
  onLog({
    id: `log-${Date.now()}-start`,
    timestamp: new Date().toLocaleTimeString(),
    message: `=== Starting Batch Pipeline with Multi-Platform AI Generation for ${offers.length} offer(s) ===`,
    type: 'info'
  });

  const updatedOffers: Offer[] = [];

  for (let i = 0; i < offers.length; i++) {
    const offer = offers[i];
    const itemIdx = i + 1;

    onLog({
      id: `log-${Date.now()}-${itemIdx}-start`,
      timestamp: new Date().toLocaleTimeString(),
      message: `[+] Processing Offer ${itemIdx}: ${offer.product_name}`,
      type: 'info'
    });

    const aiData = await generateMarketingStrategy(
      offer.product_name,
      offer.product_description,
      offer.affiliate_id
    );

    const slug = offer.product_name.toLowerCase().replace(/[^a-z0-9]/g, '_');

    onLog({
      id: `log-${Date.now()}-${itemIdx}-copy`,
      timestamp: new Date().toLocaleTimeString(),
      message: `    └─ Generated Platform Content & Strategies for ${aiData.target_platforms.join(', ')}: output/${slug}/platform_copy.json`,
      type: 'success'
    });

    aiData.micro_search_tools.forEach((tool, tIdx) => {
      onLog({
        id: `log-${Date.now()}-${itemIdx}-tool-${tIdx}`,
        timestamp: new Date().toLocaleTimeString(),
        message: `    └─ Generated Tool: output/${slug}/tool_${tIdx + 1}.html ("${tool.tool_title}")`,
        type: 'info'
      });
    });

    onLog({
      id: `log-${Date.now()}-${itemIdx}-hub`,
      timestamp: new Date().toLocaleTimeString(),
      message: `    └─ Generated Hub Index: output/${slug}/index.html`,
      type: 'success'
    });

    updatedOffers.push({
      ...offer,
      platform_copy: aiData
    });
  }

  onLog({
    id: `log-${Date.now()}-manifest`,
    timestamp: new Date().toLocaleTimeString(),
    message: `[+] Generated Root Portal Homepage: output/index.html & Master Manifest: output/manifest.json`,
    type: 'success'
  });

  onLog({
    id: `log-${Date.now()}-complete`,
    timestamp: new Date().toLocaleTimeString(),
    message: `=== Batch Pipeline Complete: ${updatedOffers.length} offer hubs and ${updatedOffers.reduce((acc, o) => acc + (o.platform_copy?.micro_search_tools.length || 0), 0)} search tools active ===`,
    type: 'success'
  });

  saveOffers(updatedOffers);
  return updatedOffers;
}
