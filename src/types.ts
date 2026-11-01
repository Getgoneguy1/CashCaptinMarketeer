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

export type ProductMarketplaceCategory =
  | 'saas_digital'
  | 'electronics_tech'
  | 'apparel_fashion'
  | 'b2b_commodities'
  | 'travel_experiences'
  | 'general_marketplaces'
  | 'custom';

export interface CategoryCorrelationItem {
  categoryId: ProductMarketplaceCategory;
  categoryTitle: string;
  categoryIcon: string;
  isPrimary: boolean;
  correlationReason: string;
  topMarketplaces: string;
  primaryAdChannel: string;
  adRole: 'Primary Engine' | 'Correlated Ad Channel' | 'Cross-Platform Expansion';
  platforms?: { name: string; type: string; urlTemplate: string; buyerFocus: string }[];
}


export interface ProductCorrelationProfile {
  primaryCategory: ProductMarketplaceCategory;
  correlatedCategories: ProductMarketplaceCategory[];
  allCategories: ProductMarketplaceCategory[];
  breakdowns: CategoryCorrelationItem[];
  allPlatforms: { name: string; type: string; urlTemplate: string; buyerFocus: string; categoryTitle: string }[];
  excludedChannels: string[];
  combinedAdSummary: string;
}


export type BuyerChannelCategory =
  | 'saas_digital'
  | 'electronics_tech'
  | 'apparel_fashion'
  | 'b2b_commodities'
  | 'travel_experiences'
  | 'general_marketplaces'
  | 'want_ads'
  | 'comparison'
  | 'review_trust'
  | 'gumroad'
  | 'daily_trends'
  | 'pinterest'
  | 'linkedin'
  | 'instagram'
  | 'social_intent'
  | 'community';

export interface BuyerLead {
  id: string;
  platform:
    | 'Reddit'
    | 'Quora'
    | 'Forum'
    | 'Twitter/X'
    | 'Facebook Group'
    | 'Want Ads (Marketplace/Craigslist)'
    | 'Comparison (Versus / AlternativeTo)'
    | 'Trustpilot & Yelp Reviews'
    | 'Gumroad Discover'
    | 'Daily Trends (Google & Amazon)'
    | 'Pinterest'
    | 'LinkedIn'
    | 'Instagram'
    | string;
  channelCategory?: BuyerChannelCategory;
  marketplaceName?: string;
  communityName: string;
  threadTitle: string;
  threadUrl: string;
  buyerIntentScore: number;
  buyerPainPoint: string;
  tailoredAdCopy: string;
  affiliateDeepLink: string;
  status: 'Discovered' | 'Ready to Post' | 'Posted' | 'Auto-Deployed' | 'Auto-Placed & Live';
  postedAt?: string;
  impressions?: number;
  adType?: 'discussion' | 'video_ad' | 'classified' | 'social_hook';
  viralHook?: string;
  videoScript?: {
    hook: string;
    visualDirection: string;
    voiceoverScript: string;
    caption: string;
  };
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
  status?: string;
}

export interface AffiliateProConfig {
  enabled: boolean;
  appUrl: string;
  webhookUrl: string;
  syncMode: 'redirect' | 'webhook' | 'embed';
  lastSynced?: string;
  // Multi-App Virbis Ecosystem Expansion (All 3 apps hosted together for free)
  app3Name?: string;
  app3Url?: string;
  app3Description?: string;
  ecosystemDomain?: string;
  isHubLinked?: boolean;
  hubUserEmail?: string;
  isViralLinked?: boolean;
  viralUserEmail?: string;
}

export interface MasterAuthSession {
  isMasterLoggedIn: boolean;
  userEmail: string;
  userName: string;
  role: 'master_creator' | 'license_holder' | 'guest';
  viewMode: 'admin' | 'customer';
  loginTimestamp?: string;
  masterKey?: string;
  licensedBuyerId?: string;
}

export interface MasterAppSettings {
  appName: string;
  brandTagline: string;
  companyName: string;
  supportEmail: string;
  paypalEmail: string;
  liveDomain: string;
  announcementBarText?: string;
  showAnnouncementBar?: boolean;
}

export interface GeneratedLicenseKey {
  id: string;
  key: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  plan: 'Single Station' | 'Commercial Agency' | 'Lifetime Master';
  status: 'Active' | 'Revoked';
  activationsCount: number;
}

