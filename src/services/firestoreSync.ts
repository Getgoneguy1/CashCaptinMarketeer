import {
  collection,
  doc,
  setDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db, ensureAuthUser } from '../firebase';
import { Offer, TrackingMetrics, ClickEvent } from '../types';

export interface SocialAdRecord {
  id: string;
  userId: string;
  offerId: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'Twitter' | 'Reddit' | 'LinkedIn';
  headline: string;
  bodyText: string;
  hashtags?: string;
  deepLink?: string;
  status: 'draft' | 'scheduled' | 'dispatched' | 'live';
  dispatchedAt?: string;
}

/**
 * Syncs an offer to user-isolated Firestore collection: /users/{userId}/offers/{offerId}
 */
export async function syncOfferToCloud(offer: Offer): Promise<boolean> {
  try {
    const user = await ensureAuthUser();
    if (!user || !user.uid) return false;

    const offerRef = doc(db, 'users', user.uid, 'offers', offer.id);
    await setDoc(
      offerRef,
      {
        id: offer.id,
        userId: user.uid,
        product_name: offer.product_name,
        product_description: offer.product_description,
        affiliate_id: offer.affiliate_id,
        category: offer.category || 'General',
        target_url: offer.target_url || '',
        clicks: offer.clicks || 0,
        conversions: offer.conversions || 0,
        revenue: offer.revenue || 0,
        created_at: offer.created_at || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.warn('Firestore cloud sync warning for offer:', err);
    return false;
  }
}

/**
 * Syncs a click traffic event to Firestore: /users/{userId}/click_events/{clickId}
 */
export async function syncClickToCloud(click: ClickEvent): Promise<boolean> {
  try {
    const user = await ensureAuthUser();
    if (!user || !user.uid) return false;

    const clickRef = doc(db, 'users', user.uid, 'click_events', click.id);
    await setDoc(clickRef, {
      id: click.id,
      userId: user.uid,
      offerId: click.offerId,
      offerName: click.offerName || '',
      affiliateId: click.affiliateId || '',
      targetUrl: click.targetUrl,
      timestamp: click.timestamp || new Date().toISOString(),
      converted: !!click.converted
    });
    return true;
  } catch (err) {
    console.warn('Firestore cloud sync warning for click:', err);
    return false;
  }
}

/**
 * Saves a multi-outlet social media advertisement to Firestore: /users/{userId}/social_ads/{adId}
 */
export async function saveSocialAdToCloud(ad: SocialAdRecord): Promise<boolean> {
  try {
    const user = await ensureAuthUser();
    if (!user || !user.uid) return false;

    const adRef = doc(db, 'users', user.uid, 'social_ads', ad.id);
    await setDoc(adRef, {
      id: ad.id,
      userId: user.uid,
      offerId: ad.offerId,
      platform: ad.platform,
      headline: ad.headline,
      bodyText: ad.bodyText,
      hashtags: ad.hashtags || '',
      deepLink: ad.deepLink || '',
      status: ad.status,
      dispatchedAt: ad.dispatchedAt || new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.warn('Firestore cloud sync warning for social ad:', err);
    return false;
  }
}

/**
 * Records a commercial app sale alert to Firestore: /sales_alerts/{alertId}
 */
export async function recordSaleAlertToCloud(alert: {
  id: string;
  tierName: string;
  amount: number;
  buyerEmail?: string;
  buyerName?: string;
  transactionId?: string;
  licenseKey?: string;
  timestamp: string;
}): Promise<boolean> {
  try {
    const alertRef = doc(db, 'sales_alerts', alert.id);
    await setDoc(alertRef, {
      ...alert,
      recordedAt: new Date().toISOString(),
      ownerAlertEmail: 'yeahwegotthat@proton.me',
      status: 'recorded'
    });
    return true;
  } catch (err) {
    console.warn('Firestore record sale alert warning:', err);
    return false;
  }
}
