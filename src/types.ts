export interface MicroSearchTool {
  id?: string;
  tool_title: string;
  search_box_placeholder: string;
  target_intent: string;
  deep_link_base_url: string;
}

export interface PlatformCopyStrategy {
  copy: string;
  strategy?: string;
  hook?: string;
  visual_concept?: string;
}

export interface PlatformCopy {
  target_platforms: string[];
  keywords: string[];
  questions: string[];
  platform_copy: Record<string, PlatformCopyStrategy | string>;
  micro_search_tools: MicroSearchTool[];
}

export interface BuyerLead {
  id: string;
  platform: 'Reddit' | 'Quora' | 'Forum' | 'Twitter/X' | 'Facebook Group';
  communityName: string;
  threadTitle: string;
  threadUrl: string;
  buyerIntentScore: number;
  buyerPainPoint: string;
  tailoredAdCopy: string;
  affiliateDeepLink: string;
  status: 'Discovered' | 'Ready to Post' | 'Posted' | 'Auto-Deployed';
  postedAt?: string;
}

export interface Offer {
  id: string;
  product_name: string;
  product_description: string;
  affiliate_id: string;
  category?: string;
  target_url?: string;
  image_url?: string;
  keywords?: string[];
  platform_copy?: PlatformCopy;
  buyer_leads?: BuyerLead[];
  created_at: string;
  clicks?: number;
  conversions?: number;
  revenue?: number;
}

export interface TrackingMetrics {
  clicks: number;
  conversions: number;
  revenue: number;
  lastUpdated?: string;
}

export interface ClickEvent {
  id: string;
  offerId: string;
  offerName: string;
  affiliateId: string;
  query?: string;
  targetUrl: string;
  timestamp: string;
  converted?: boolean;
}

export interface BuildLogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface AffiliateProConfig {
  enabled: boolean;
  appUrl: string;
  webhookUrl: string;
  syncMode: 'redirect' | 'webhook' | 'embed';
  lastSynced?: string;
}
