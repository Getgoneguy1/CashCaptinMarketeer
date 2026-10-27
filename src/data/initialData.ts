import { Offer, TrackingMetrics } from '../types';

export const INITIAL_TRACKING: TrackingMetrics = {
  clicks: 0,
  conversions: 0,
  revenue: 0.00,
  lastUpdated: new Date().toISOString()
};

export const INITIAL_OFFERS: Offer[] = [];
