import { GoogleGenAI } from '@google/genai';
import { Offer, TrackingMetrics, BuyerLead, PlatformCopy, AffiliateProConfig } from '../types';
import { findBuyerLeads, generateMarketingStrategy } from './aiGenerator';
import { NavTab } from '../components/Header';
import { getAddonAppState, saveAddonAppState, AddonAppState } from './userLicenseService';

export interface AiCommandResult {
  reply: string;
  sourceAgent: 'CashCaptain_AI' | 'AI_Hub_Agent' | 'Viral_AI_Assistant' | 'Ecosystem_Triad';
  actionTaken?: {
    type:
      | 'navigate'
      | 'place_ad'
      | 'check_stats'
      | 'generate_copy'
      | 'open_social_blast'
      | 'open_license'
      | 'open_auth'
      | 'link_app'
      | 'cross_app_sync'
      | 'none';
    details?: any;
  };
  suggestedPrompts?: string[];
  crossAppDialogue?: {
    agentName: string;
    message: string;
    status: 'connected' | 'not_linked' | 'synced';
  }[];
}

export interface AppActionContext {
  offers: Offer[];
  tracking: TrackingMetrics;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onSaveNewOffer: (offer: Offer) => void;
  onOpenSocialBlast: () => void;
  onOpenLicenseModal: () => void;
  onOpenAuthModal: () => void;
  affiliateProConfig?: AffiliateProConfig;
  isMasterUser?: boolean;
}

/**
 * Executes a conversational or voice command with full control over Cash Captain
 * and direct communication with the AI agents in Affiliate Pro (AI Hub) and Affiliate Viral AI.
 */
export async function executeAiCommand(
  rawInput: string,
  context: AppActionContext
): Promise<AiCommandResult> {
  const query = rawInput.trim();
  const lower = query.toLowerCase();

  const hubState: AddonAppState = getAddonAppState('hub', context.isMasterUser);
  const viralState: AddonAppState = getAddonAppState('viral', context.isMasterUser);

  // 1. CROSS-APP AI COMMUNICATION COMMANDS
  // Example: "Ask Viral AI Assistant for hooks", "Talk to AI Hub", "Broadcast across all 3 apps", "Sync with other apps"
  const isCrossAppQuery =
    lower.includes('viral ai') ||
    lower.includes('assistant') ||
    lower.includes('ai hub') ||
    lower.includes('affiliate pro') ||
    lower.includes('other app') ||
    lower.includes('other two app') ||
    lower.includes('all 3 app') ||
    lower.includes('all three app') ||
    lower.includes('cross app') ||
    lower.includes('ecosystem') ||
    lower.includes('sync apps');

  if (isCrossAppQuery) {
    // A. Targeting the AI Assistant (Affiliate Viral AI)
    if (lower.includes('viral') || lower.includes('assistant') || lower.includes('tiktok') || lower.includes('reel')) {
      if (!viralState.isLinked) {
        return {
          sourceAgent: 'CashCaptain_AI',
          reply: `📡 **Cross-App AI Communication Channel:**\n\nI reached out to **Affiliate Viral AI (Assistant)**, but it is not linked to Cash Captain yet.\n\nWould you like me to link the AI Assistant right now?`,
          crossAppDialogue: [
            { agentName: 'Cash Captain AI', message: 'Calling Affiliate Viral AI Assistant gateway...', status: 'connected' },
            { agentName: 'Viral AI Assistant', message: 'Link authorization required.', status: 'not_linked' }
          ],
          actionTaken: { type: 'navigate', details: { tab: 'affiliate_pro' } },
          suggestedPrompts: ['Link AI Assistant', 'Show 3-in-1 Suite', 'Place ad directly in Cash Captain']
        };
      }

      // Viral AI Assistant is linked! Return direct communication response
      const viralHooks = [
        `"Stop scrolling if you're promoting products the old way. Here's how 3 AI apps run our entire business on autopilot."`,
        `"The secret 3-step loop: Cash Captain finds the buyer, AI Hub routes the payout, Viral AI floods the traffic."`,
        `"99% of affiliate marketers fail because they do manual posting. We automated the entire machine."`
      ];

      return {
        sourceAgent: 'Viral_AI_Assistant',
        reply: `⚡ **Message from Affiliate Viral AI Assistant (Linked):**\n\n"Cash Captain AI received your directive! I've engineered 3 viral short-form hooks and synchronized them across your active campaigns:\n\n1. ${viralHooks[0]}\n2. ${viralHooks[1]}\n3. ${viralHooks[2]}\n\n**Organic Video Strategy:** Record a 7-second POV clip with these hooks on TikTok & YouTube Shorts, linking directly through Cash Captain."`,
        crossAppDialogue: [
          { agentName: 'Cash Captain AI', message: `Dispatched creative brief to Viral AI Assistant: "${query}"`, status: 'connected' },
          { agentName: 'Viral AI Assistant', message: 'Hooks generated & synchronized with Cash Captain.', status: 'synced' }
        ],
        actionTaken: { type: 'generate_copy', details: { viralHooks } },
        suggestedPrompts: ['Place ad using these hooks', 'Talk to AI Hub', 'Check my stats']
      };
    }

    // B. Targeting the AI Hub (Affiliate Pro)
    if (lower.includes('hub') || lower.includes('pro') || lower.includes('multi offer') || lower.includes('rotator')) {
      if (!hubState.isLinked) {
        return {
          sourceAgent: 'CashCaptain_AI',
          reply: `📡 **Cross-App AI Communication Channel:**\n\nI reached out to **Affiliate Pro (AI Hub)**, but it is not linked yet.\n\nWould you like me to open the 3-in-1 Suite to link the AI Hub?`,
          crossAppDialogue: [
            { agentName: 'Cash Captain AI', message: 'Querying Affiliate Pro Hub gateway...', status: 'connected' },
            { agentName: 'AI Hub Agent', message: 'Hub link authorization required.', status: 'not_linked' }
          ],
          actionTaken: { type: 'navigate', details: { tab: 'affiliate_pro' } },
          suggestedPrompts: ['Link AI Hub', 'Show 3-in-1 Suite']
        };
      }

      return {
        sourceAgent: 'AI_Hub_Agent',
        reply: `🌐 **Message from Affiliate Pro (AI Hub Agent - Linked):**\n\n"Cash Captain AI communication established! All ${context.offers.length} active offer routing channels and payout links are synchronized in the multi-offer hub. Deep-link rotation and analytics are running smoothly."`,
        crossAppDialogue: [
          { agentName: 'Cash Captain AI', message: 'Querying centralized offer catalog...', status: 'connected' },
          { agentName: 'AI Hub Agent', message: `Confirmed: ${context.offers.length} campaigns active and routed.`, status: 'synced' }
        ],
        actionTaken: { type: 'cross_app_sync', details: { offersCount: context.offers.length } },
        suggestedPrompts: ['Check my stats', 'Place a new ad', 'Talk to Viral AI Assistant']
      };
    }

    // C. Complete 3-in-1 Triad Sync
    return {
      sourceAgent: 'Ecosystem_Triad',
      reply: `⚡ **3-in-1 AI Ecosystem Status:**\n\n- **Cash Captain AI (Base Host):** Active & Placing Ads (Offers: ${context.offers.length})\n- **Affiliate Pro AI Hub:** ${hubState.isLinked ? '✅ Linked & Synchronized' : '⚠️ Unlinked (Subscription/Sign-In required)'}\n- **Affiliate Viral AI Assistant:** ${viralState.isLinked ? '✅ Linked & Synchronized' : '⚠️ Unlinked (Subscription/Sign-In required)'}\n\nOur AI engines communicate directly to automatically discover buyers, route affiliate payouts, and syndicate viral traffic.`,
      crossAppDialogue: [
        { agentName: 'Cash Captain AI', message: 'Host Engine: Buyer Discovery & Ad Placement', status: 'connected' },
        { agentName: 'AI Hub Agent', message: hubState.isLinked ? 'Multi-Offer Routing Active' : 'Waiting for link', status: hubState.isLinked ? 'synced' : 'not_linked' },
        { agentName: 'Viral AI Assistant', message: viralState.isLinked ? 'Viral Traffic Loop Ready' : 'Waiting for link', status: viralState.isLinked ? 'synced' : 'not_linked' }
      ],
      actionTaken: { type: 'cross_app_sync' },
      suggestedPrompts: ['Link AI Hub', 'Link AI Assistant', 'Place a new ad']
    };
  }

  // 2. NAVIGATION COMMANDS
  if (
    lower.includes('my offer') ||
    lower.includes('show offers') ||
    lower.includes('list offers') ||
    lower.includes('view offer') ||
    lower.includes('placed copy') ||
    lower.includes('edit copy')
  ) {
    context.setActiveTab('offers');
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `I have navigated you to **My Offers**. Here you can see all your placed campaigns, inspect the exact copy placed on each platform, and edit your promotional copy anytime.`,
      actionTaken: { type: 'navigate', details: { tab: 'offers' } }
    };
  }

  if (
    lower.includes('autopilot') ||
    lower.includes('auto pilot') ||
    lower.includes('main screen') ||
    lower.includes('home screen') ||
    lower.includes('place ad screen')
  ) {
    context.setActiveTab('autopilot');
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `I have taken you to the **AI Auto-Pilot** screen where you can input a product name, description, affiliate link, and image to automatically place ads.`,
      actionTaken: { type: 'navigate', details: { tab: 'autopilot' } }
    };
  }

  if (
    lower.includes('tracking') ||
    lower.includes('ledger') ||
    lower.includes('accounting') ||
    lower.includes('earnings') ||
    lower.includes('revenue page')
  ) {
    context.setActiveTab('ledger');
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `I have opened your **Tracking & Earnings Ledger** where you can monitor real clicks, conversions, and update payouts.`,
      actionTaken: { type: 'navigate', details: { tab: 'ledger' } }
    };
  }

  if (
    lower.includes('3 in 1') ||
    lower.includes('3-in-1') ||
    lower.includes('suite')
  ) {
    context.setActiveTab('affiliate_pro');
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `I have opened the **3-in-1 Marketing Suite**. Here you can link the **AI Hub** and **AI Assistant** to Cash Captain with your 50% member discount!`,
      actionTaken: { type: 'navigate', details: { tab: 'affiliate_pro' } }
    };
  }

  if (lower.includes('social blast') || lower.includes('social media blast') || lower.includes('blast ad')) {
    context.onOpenSocialBlast();
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `Opening the **Social Media Command Center** for you right now!`,
      actionTaken: { type: 'open_social_blast' }
    };
  }

  if (
    lower.includes('buy license') ||
    lower.includes('get license') ||
    lower.includes('upgrade license') ||
    lower.includes('license slot') ||
    lower.includes('purchase license')
  ) {
    context.onOpenLicenseModal();
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `Opening the **Buy License** window for you. You can purchase or activate your license key here to unlock unlimited slots!`,
      actionTaken: { type: 'open_license' }
    };
  }

  if (lower.includes('log in') || lower.includes('login') || lower.includes('sign in') || lower.includes('my account')) {
    context.onOpenAuthModal();
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `Opening the **Log In / Account** window for you right now.`,
      actionTaken: { type: 'open_auth' }
    };
  }

  // 3. STATS & PERFORMANCE COMMANDS
  if (
    lower.includes('how many click') ||
    lower.includes('show stats') ||
    lower.includes('check stats') ||
    lower.includes('my click') ||
    lower.includes('how much money') ||
    lower.includes('my revenue') ||
    lower.includes('my conversion') ||
    lower.includes('performance')
  ) {
    const clicks = context.tracking.clicks;
    const rev = context.tracking.revenue.toFixed(2);
    const conv = context.tracking.conversions;
    const count = context.offers.length;
    const epc = clicks > 0 ? (context.tracking.revenue / clicks).toFixed(2) : '0.00';

    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `📊 **Here is your live campaign report:**\n- **Active Offers:** ${count}\n- **Total Clicks:** ${clicks}\n- **Conversions:** ${conv}\n- **Net Commission:** $${rev}\n- **Average EPC:** $${epc}/click\n\nWould you like me to open your full Tracking Ledger?`,
      actionTaken: {
        type: 'check_stats',
        details: { clicks, rev, conv, count, epc }
      },
      suggestedPrompts: ['Open Tracking Ledger', 'Place a new ad', 'Ask Viral AI Assistant for hooks']
    };
  }

  // 4. LINK 3-IN-1 APPS DIRECT COMMAND
  if (lower.includes('link hub') || lower.includes('link ai hub')) {
    context.setActiveTab('affiliate_pro');
    if (!hubState.isSubscribed) {
      return {
        sourceAgent: 'CashCaptain_AI',
        reply: `To link the **AI Hub (Affiliate Pro)**, a subscription is required. I've taken you to the 3-in-1 Suite card where you can get the 50% Cash Captain member discount ($24)!`,
        actionTaken: { type: 'link_app', details: { app: 'hub', status: 'sub_required' } }
      };
    }
    if (!hubState.isSignedIn) {
      return {
        sourceAgent: 'CashCaptain_AI',
        reply: `You are subscribed to the AI Hub! Please sign into your AI Hub account on the 3-in-1 Suite screen to authorize linking.`,
        actionTaken: { type: 'link_app', details: { app: 'hub', status: 'login_required' } }
      };
    }
    const updated = { ...hubState, isLinked: true };
    saveAddonAppState('hub', updated);
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `✅ **AI Hub (Affiliate Pro)** is now linked and synchronized with Cash Captain! Both AIs can now exchange campaigns and clicks.`,
      actionTaken: { type: 'link_app', details: { app: 'hub', status: 'linked' } }
    };
  }

  if (lower.includes('link assistant') || lower.includes('link viral ai') || lower.includes('link ai assistant')) {
    context.setActiveTab('affiliate_pro');
    if (!viralState.isSubscribed) {
      return {
        sourceAgent: 'CashCaptain_AI',
        reply: `To link the **AI Assistant (Affiliate Viral AI)**, a subscription is required. I've taken you to the 3-in-1 Suite card where you can get the 50% Cash Captain member discount ($24)!`,
        actionTaken: { type: 'link_app', details: { app: 'viral', status: 'sub_required' } }
      };
    }
    if (!viralState.isSignedIn) {
      return {
        sourceAgent: 'CashCaptain_AI',
        reply: `You are subscribed to the AI Assistant! Please sign into your AI Assistant account on the 3-in-1 Suite screen to authorize linking.`,
        actionTaken: { type: 'link_app', details: { app: 'viral', status: 'login_required' } }
      };
    }
    const updated = { ...viralState, isLinked: true };
    saveAddonAppState('viral', updated);
    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `✅ **AI Assistant (Affiliate Viral AI)** is now linked and synchronized with Cash Captain! The viral traffic engine is now directly connected.`,
      actionTaken: { type: 'link_app', details: { app: 'viral', status: 'linked' } }
    };
  }

  // 5. AUTOMATIC AD PLACEMENT
  const isPlaceAdIntent =
    lower.startsWith('place ad') ||
    lower.startsWith('place ads') ||
    lower.startsWith('run ad') ||
    lower.startsWith('run ads') ||
    lower.startsWith('launch ad') ||
    lower.startsWith('advertise') ||
    lower.startsWith('promote') ||
    lower.includes('place ad for') ||
    lower.includes('place ads for');

  if (isPlaceAdIntent) {
    let productPart = query
      .replace(/^(please\s+)?(place\s+ads?\s+for|place\s+ads?|run\s+ads?\s+for|launch\s+ad\s+campaign\s+for|advertise|promote)\s+/i, '')
      .trim();

    const urlMatch = productPart.match(/https?:\/\/[^\s]+/i);
    const targetUrl = urlMatch ? urlMatch[0] : '';
    if (targetUrl) {
      productPart = productPart.replace(targetUrl, '').replace(/\b(with\s+link|link|url)\b/i, '').trim();
    }

    const productName = productPart || 'Affiliate Growth Engine';
    const productDescription = `High converting marketing solution for ${productName}`;
    const affiliateId = `AFF-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const [strategy, leads] = await Promise.all([
      generateMarketingStrategy(productName, productDescription, affiliateId),
      findBuyerLeads(productName, productDescription, affiliateId, targetUrl || undefined)
    ]);

    const newOffer: Offer = {
      id: `offer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      product_name: productName,
      product_description: productDescription,
      affiliate_id: affiliateId,
      category: 'Digital Marketing',
      target_url: targetUrl || `https://example.com/offer?aff=${affiliateId}`,
      keywords: strategy.keywords,
      platform_copy: strategy,
      buyer_leads: leads,
      created_at: new Date().toISOString(),
      clicks: 0,
      conversions: 0,
      revenue: 0
    };

    context.onSaveNewOffer(newOffer);
    context.setActiveTab('offers');

    return {
      sourceAgent: 'CashCaptain_AI',
      reply: `🚀 **Ad Placed Successfully!**\n\nI have generated high-converting copy, viral hooks, and video scripts for **"${productName}"**, and placed ads across **${leads.length} high-intent sites**!\n\nI've navigated you to **My Offers** so you can review and edit the promotional copy anytime.`,
      actionTaken: {
        type: 'place_ad',
        details: { offerId: newOffer.id, productName, sitesCount: leads.length }
      },
      suggestedPrompts: ['Edit placed ad copy', 'Ask Viral AI Assistant for hooks', 'Check my stats']
    };
  }

  // 6. VIRAL HOOKS & VIDEO SCRIPTS
  if (
    lower.includes('write hook') ||
    lower.includes('viral hook') ||
    lower.includes('video script') ||
    lower.includes('ad copy') ||
    lower.includes('write copy')
  ) {
    const topic = query
      .replace(/^(write\s+(me\s+)?(a\s+)?(viral\s+)?(hook|ad\s+copy|video\s+script)\s+(for\s+)?)/i, '')
      .trim() || 'affiliate commissions';

    const hooks = [
      `"Stop scrolling if you want to make passive affiliate sales while sleeping: here's the exact tool 99% of marketers gatekeep."`,
      `"I tested 7 affiliate traffic methods last month—this one is the only one that generated instant clicks without paying for ads."`,
      `"The #1 mistake beginners make when placing affiliate links (and how to fix it in 30 seconds)."`
    ];

    return {
      sourceAgent: viralState.isLinked ? 'Viral_AI_Assistant' : 'CashCaptain_AI',
      reply: `🔥 **Here are 3 viral hooks tailored for "${topic}":**\n\n1. ${hooks[0]}\n2. ${hooks[1]}\n3. ${hooks[2]}\n\n**TikTok/Shorts Video Scene Direction:**\n- **0-3s:** Close-up speaking directly into camera with bold text overlay.\n- **3-10s:** Screen recording showing the solution live.\n- **10-15s:** Call to Action pointing to your affiliate link in bio.\n\nWould you like me to place an ad campaign using these hooks?`,
      actionTaken: { type: 'generate_copy', details: { topic, hooks } },
      suggestedPrompts: [`Place ads for ${topic}`, 'Go to My Offers', 'Check stats']
    };
  }

  // 7. GEMINI POWERED INTELLIGENT EXECUTIVE ASSISTANT
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are the Cash Captain AI Commander, the central intelligence agent of Cash Captain Marketeer.
You also coordinate with two linked partner AIs:
1. Affiliate Pro (AI Hub Agent) - multi-offer router and analytics
2. Affiliate Viral AI (Viral AI Assistant) - viral short-form video hooks & organic traffic syndication

Current User Query: "${query}"

Current System State:
- Total active offers: ${context.offers.length}
- Total Clicks: ${context.tracking.clicks}
- Total Revenue: $${context.tracking.revenue.toFixed(2)}
- AI Hub Linked: ${hubState.isLinked ? 'YES' : 'NO'}
- Viral AI Assistant Linked: ${viralState.isLinked ? 'YES' : 'NO'}
- Active Tab: ${context.activeTab}

Respond authoritatively, concisely, and helpfully. Explain how you or your partner AIs can execute what the user wants. Keep the response crisp and under 3 short paragraphs.
`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const responseText = response.text || '';
      if (responseText.trim()) {
        return {
          sourceAgent: 'CashCaptain_AI',
          reply: responseText.trim(),
          suggestedPrompts: ['Place ads for my product', 'Show my offers', 'Check my stats', 'Link 3-in-1 apps']
        };
      }
    } catch (e) {
      console.warn('Gemini AI Commander response fallback', e);
    }
  }

  // Default fallback
  return {
    sourceAgent: 'CashCaptain_AI',
    reply: `I am your **Cash Captain AI Commander**, with full control over all functions in this app and direct communication with our partner AIs (**Affiliate Pro AI Hub** & **Affiliate Viral AI**).\n\nYou can talk or type to me to:\n- 🚀 **Place Ads:** *"Place ads for [product] with link [URL]"*\n- ✍️ **Write Viral Hooks:** *"Write viral video hooks for [niche]"*\n- 🤖 **Communicate with Partner AIs:** *"Ask Viral AI Assistant for hooks"* or *"Talk to AI Hub"*\n- 📊 **Check Stats:** *"How many clicks and revenue do I have?"*\n- 🔗 **Link Apps:** *"Link AI Hub"* or *"Link AI Assistant"*\n- 📂 **Navigate:** *"Show my offers"*, *"Go to Auto-Pilot"*, *"Open tracking"*\n\nWhat would you like me to do next?`,
    suggestedPrompts: [
      'Place ads for my product',
      'Ask Viral AI Assistant for hooks',
      'Show my offers',
      'How many clicks do I have?'
    ]
  };
}
