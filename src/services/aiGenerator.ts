import { PlatformCopy, MicroSearchTool, BuyerLead } from '../types';
import { GoogleGenAI } from '@google/genai';

export async function generateMarketingStrategy(
  productName: string,
  productDescription: string,
  affiliateId: string
): Promise<PlatformCopy> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are an expert affiliate marketing strategist.
Analyze the following affiliate offer:
Product Name: ${productName}
Description: ${productDescription}
Affiliate Tag: ${affiliateId}

1. Identify 3-4 target platforms (e.g., Reddit, Facebook Groups, Quora, Twitter/X, Medium, YouTube/TikTok) where this product converts best organically.
2. For each platform, generate compliance-safe promotional content designed to avoid getting flagged or banned:
   - For Reddit: A natural, helpful community reply containing context, value, and subtle guidance.
   - For Facebook Groups: An engaging post description paired with an image visual concept, hook, and call to action.
   - For Quora: A detailed, authoritative problem-diagnosis and solution answer.
   - For Twitter/X: An engaging tweet or thread opener.
3. Generate 5 high-intent buyer keywords and 5 pain-point buyer questions.
4. Generate 3 targeted "micro_search_tools". Each micro search tool must have:
   - "tool_title": A catchy utility name
   - "search_box_placeholder": A descriptive search placeholder
   - "target_intent": What problem this search tool resolves
   - "deep_link_base_url": Base URL for query redirection (e.g. "https://example.com/search?q=")

Return STRICTLY a JSON object with this structure:
{
  "target_platforms": ["Reddit", "Facebook Groups", "Quora", "Twitter/X"],
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "questions": ["question 1", "question 2", "question 3", "question 4", "question 5"],
  "platform_copy": {
    "Reddit": { "copy": "...", "strategy": "..." },
    "Facebook Groups": { "copy": "...", "strategy": "...", "hook": "...", "visual_concept": "..." },
    "Quora": { "copy": "...", "strategy": "..." },
    "Twitter/X": { "copy": "...", "strategy": "..." }
  },
  "micro_search_tools": [
    {
      "tool_title": "...",
      "search_box_placeholder": "...",
      "target_intent": "...",
      "deep_link_base_url": "https://example.com/search?q="
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const cleaned = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      if (parsed.target_platforms && parsed.keywords && parsed.micro_search_tools) {
        return parsed as PlatformCopy;
      }
    } catch (err) {
      console.warn('Gemini API call failed, using heuristic strategy generator:', err);
    }
  }

  return generateDeterministicStrategy(productName, productDescription);
}

export async function findBuyerLeads(
  productName: string,
  productDescription: string,
  affiliateId: string,
  targetUrl?: string,
  _imageUrl?: string
): Promise<BuyerLead[]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const deepLink = targetUrl || `https://example.com/product?aff_id=${encodeURIComponent(affiliateId)}`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
You are an autonomous AI web scraping and buyer-intent placement agent.
The user wants to promote:
Product: ${productName}
Description: ${productDescription}
Affiliate Link: ${deepLink}

Analyze the internet to find 5-6 realistic, high-intent discussion threads, forums, subreddits, and questions where people are actively asking for this exact kind of solution right now.
For each place:
1. Identify the platform ("Reddit", "Quora", "Forum", "Twitter/X", "Facebook Group")
2. Name the specific community (e.g. "r/AffiliateMarketing", "r/SaaS", "Quora: Affiliate Strategy", "IndieHackers", "DigitalPoint")
3. Give the exact thread/question title people ask (e.g. "How can I automate 30 short videos without spending 4 hours a day?")
4. Generate a direct search/thread URL (e.g. "https://www.reddit.com/r/AffiliateMarketing/search/?q=${encodeURIComponent(productName)}")
5. Assign a Buyer Intent Score from 88 to 99
6. Identify the specific buyer pain point
7. Generate the exact tailored ad / helpful response that answers their question naturally, provides value, and links: "${deepLink}"

Return strictly a JSON array of objects with keys:
"platform", "communityName", "threadTitle", "threadUrl", "buyerIntentScore", "buyerPainPoint", "tailoredAdCopy"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const responseText = response.text || '';
      const cleaned = responseText
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item, idx) => ({
          id: `lead-${Date.now()}-${idx}`,
          platform: item.platform || 'Reddit',
          communityName: item.communityName || 'r/Entrepreneur',
          threadTitle: item.threadTitle || `Looking for ${productName} alternatives`,
          threadUrl: item.threadUrl || `https://www.google.com/search?q=${encodeURIComponent(item.threadTitle || productName)}`,
          buyerIntentScore: item.buyerIntentScore || 94,
          buyerPainPoint: item.buyerPainPoint || 'Needs an automated, reliable solution without manual bottlenecks.',
          tailoredAdCopy: item.tailoredAdCopy || `Check out ${productName} here: ${deepLink}`,
          affiliateDeepLink: deepLink,
          status: 'Ready to Post'
        }));
      }
    } catch (e) {
      console.warn('Gemini buyer search fallback active:', e);
    }
  }

  return generateAutonomousBuyerLeads(productName, productDescription, affiliateId, deepLink);
}

export function generateAutonomousBuyerLeads(
  productName: string,
  productDescription: string,
  affiliateId: string,
  deepLink: string
): BuyerLead[] {
  const cleanName = productName.trim();
  const lower = (productName + ' ' + productDescription).toLowerCase();

  const isVideo = lower.includes('video') || lower.includes('shorts') || lower.includes('tiktok') || lower.includes('reels');
  const isFinance = lower.includes('saving') || lower.includes('invest') || lower.includes('rate') || lower.includes('money');
  const isWriting = lower.includes('copy') || lower.includes('writing') || lower.includes('content') || lower.includes('ai');

  let leads: BuyerLead[] = [];

  if (isVideo) {
    leads = [
      {
        id: `lead-${Date.now()}-1`,
        platform: 'Reddit',
        communityName: 'r/NewTubers',
        threadTitle: 'Is there any tool that automates script writing and hook generation for Shorts?',
        threadUrl: `https://www.reddit.com/r/NewTubers/search/?q=${encodeURIComponent('automate shorts scripts')}`,
        buyerIntentScore: 98,
        buyerPainPoint: 'Spending 3+ hours per video manually writing scripts and suffering from viewer drop-off in the first 3 seconds.',
        tailoredAdCopy: `I had this exact bottleneck when posting daily Shorts. The issue is usually hook retention. Instead of manually brainstorming, check out ${cleanName} (${deepLink}). It generates the retention hook and bridge copy in 30 seconds so you can batch 10 videos in under an hour without burning out.`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-2`,
        platform: 'Quora',
        communityName: 'Quora: YouTube Automation',
        threadTitle: 'What is the fastest way to create faceless YouTube Shorts for affiliate sales in 2026?',
        threadUrl: `https://www.quora.com/search?q=${encodeURIComponent('faceless youtube shorts affiliate marketing')}`,
        buyerIntentScore: 95,
        buyerPainPoint: 'Wants to do affiliate marketing with short video without showing their face or hiring expensive video editors.',
        tailoredAdCopy: `The fastest approach is using a script automation engine like ${cleanName}. Pair an automated viral script with stock B-roll cuts every 2 seconds. You can explore the setup and search tool directly here: ${deepLink} - it handles both the hook and the bridge page links.`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-3`,
        platform: 'Reddit',
        communityName: 'r/TikTokMarketing',
        threadTitle: 'How are people generating 20+ TikTok video scripts a week without burnout?',
        threadUrl: `https://www.reddit.com/r/TikTokMarketing/search/?q=${encodeURIComponent('video script generator')}`,
        buyerIntentScore: 92,
        buyerPainPoint: 'Creator fatigue and inability to maintain consistent daily posting volume.',
        tailoredAdCopy: `Don't write scripts from scratch every day. Use ${cleanName} (${deepLink}) to auto-generate high-retention frameworks, then just record or plug into an editor. Cut my script writing time from 2 hours to 8 minutes per batch.`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-4`,
        platform: 'Forum',
        communityName: 'BlackHatWorld / Affiliate Journey',
        threadTitle: 'Looking for a bridge page and video automator that doesn’t get links flagged',
        threadUrl: `https://www.blackhatworld.com/search/1/?q=${encodeURIComponent(cleanName)}`,
        buyerIntentScore: 96,
        buyerPainPoint: 'Direct affiliate links are getting shadowbanned on TikTok and Meta.',
        tailoredAdCopy: `Direct linking is banned on almost every social channel now. You need a micro-search bridge. ${cleanName} builds intent-based search boxes that pass review checks cleanly. Link: ${deepLink}`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      }
    ];
  } else if (isFinance) {
    leads = [
      {
        id: `lead-${Date.now()}-1`,
        platform: 'Reddit',
        communityName: 'r/personalfinance',
        threadTitle: 'Where should I park $15,000 emergency fund for maximum safe interest right now?',
        threadUrl: `https://www.reddit.com/r/personalfinance/search/?q=${encodeURIComponent('high yield savings emergency fund')}`,
        buyerIntentScore: 99,
        buyerPainPoint: 'Leaving cash in standard checking accounts yielding 0.01% while inflation eats purchasing power.',
        tailoredAdCopy: `Do not leave it in a traditional big bank checking account. An FDIC-insured high-yield savings tool like ${cleanName} (${deepLink}) lets you compare verified real-time APY rates and earn 4.5%+ without lockups or fees.`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-2`,
        platform: 'Quora',
        communityName: 'Quora: Personal Investing & APY',
        threadTitle: 'What is the highest FDIC insured savings account rate available today?',
        threadUrl: `https://www.quora.com/search?q=${encodeURIComponent('highest fdic savings rate')}`,
        buyerIntentScore: 97,
        buyerPainPoint: 'Frustrated by hidden bank teaser rates that drop after 3 months.',
        tailoredAdCopy: `The top rates currently range between 4.8% and 5.2% APY across direct online institutions. You can run your deposit amount through this live rate comparison engine: ${deepLink} to see monthly compounding payout figures.`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-3`,
        platform: 'Twitter/X',
        communityName: 'X / #FinTwit',
        threadTitle: 'Looking for an automated tracker for CD rates and liquid cash yield',
        threadUrl: `https://twitter.com/search?q=${encodeURIComponent('high yield savings account rate tracker')}`,
        buyerIntentScore: 91,
        buyerPainPoint: 'Manual spreadsheet tracking of interest rate changes after Fed meetings.',
        tailoredAdCopy: `Check out ${cleanName}: ${deepLink} - tracks the highest liquid cash APYs and CD yield curves automatically.`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      }
    ];
  } else {
    leads = [
      {
        id: `lead-${Date.now()}-1`,
        platform: 'Reddit',
        communityName: 'r/AffiliateMarketing',
        threadTitle: `Anyone using a good system or software for ${cleanName.toLowerCase()}?`,
        threadUrl: `https://www.reddit.com/r/AffiliateMarketing/search/?q=${encodeURIComponent(cleanName)}`,
        buyerIntentScore: 97,
        buyerPainPoint: `Struggling to drive buyer traffic and scale ${cleanName} without spending money on paid ads.`,
        tailoredAdCopy: `If you want a proven setup that avoids social link bans, check out ${cleanName} (${deepLink}). It creates micro search tools that act as intent bridges, so buyers search for what they need and land on your affiliate link seamlessly.`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-2`,
        platform: 'Quora',
        communityName: 'Quora: Digital Marketing & Sales',
        threadTitle: `What is the most effective way to solve ${productDescription.slice(0, 50)}...?`,
        threadUrl: `https://www.quora.com/search?q=${encodeURIComponent(cleanName + ' review')}`,
        buyerIntentScore: 94,
        buyerPainPoint: 'Overwhelmed by complicated funnel builders and high monthly software subscription fees.',
        tailoredAdCopy: `The key is removing friction for the end buyer. Rather than pushing hard sales pitches, give them a utility. ${cleanName} solves this directly. You can test the platform and live search tools here: ${deepLink}`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-3`,
        platform: 'Forum',
        communityName: 'IndieHackers / Marketing Discussions',
        threadTitle: `How do I get my first 100 paying customers for my product without paid ads?`,
        threadUrl: `https://www.indiehackers.com/search?q=${encodeURIComponent(cleanName)}`,
        buyerIntentScore: 96,
        buyerPainPoint: 'Zero audience, zero marketing budget, and needs organic buyer discovery.',
        tailoredAdCopy: `The fastest organic strategy is micro-search arbitrage. Build a lightweight search tool targeting buyer intent in your niche. Here is the framework in action with ${cleanName}: ${deepLink}`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      },
      {
        id: `lead-${Date.now()}-4`,
        platform: 'Twitter/X',
        communityName: 'X / Marketing Operators',
        threadTitle: `Looking for tools to streamline ${cleanName} conversion rates`,
        threadUrl: `https://twitter.com/search?q=${encodeURIComponent(cleanName + ' affiliate')}`,
        buyerIntentScore: 89,
        buyerPainPoint: 'Low click-through rates and high bounce rates on generic affiliate bridges.',
        tailoredAdCopy: `Have you tested ${cleanName}? Routes users through high-intent micro search boxes directly to checkout. Link: ${deepLink}`,
        affiliateDeepLink: deepLink,
        status: 'Ready to Post'
      }
    ];
  }

  return leads;
}

export function generateDeterministicStrategy(
  productName: string,
  productDescription: string
): PlatformCopy {
  const cleanName = productName.trim();
  const lower = (productName + ' ' + productDescription).toLowerCase();

  const isFinance = lower.includes('financ') || lower.includes('saving') || lower.includes('invest') || lower.includes('money') || lower.includes('apy');
  const isVideo = lower.includes('video') || lower.includes('tiktok') || lower.includes('reel') || lower.includes('youtube') || lower.includes('short');

  let platforms = ['Reddit', 'Facebook Groups', 'Quora', 'Twitter/X'];
  if (isVideo) {
    platforms = ['TikTok/Shorts', 'YouTube', 'Reddit', 'Facebook Groups'];
  }

  const keywords: string[] = [
    `${cleanName.toLowerCase()} review 2026`,
    `best ${cleanName.toLowerCase()} alternatives`,
    `how to use ${cleanName.toLowerCase()} for affiliate sales`,
    `high intent ${cleanName.toLowerCase()} discount code`,
    `honest buyer guide ${cleanName.toLowerCase()}`
  ];

  const questions: string[] = [
    `How does ${cleanName} compare to traditional solutions on the market?`,
    `What are the real conversion rates when using ${cleanName}?`,
    `Is ${cleanName} suitable for complete beginners with zero audience?`,
    `How do you bypass social platform link bans while promoting ${cleanName}?`,
    `What is the ROI timeframe after deploying ${cleanName}?`
  ];

  const microSearchTools: MicroSearchTool[] = [
    {
      id: `tool-${Date.now()}-1`,
      tool_title: `${cleanName} Instant Match Scout`,
      search_box_placeholder: `Search features, pricing, or workflows in ${cleanName}...`,
      target_intent: `Instant buyer intent matching and feature deep-linking for ${cleanName}.`,
      deep_link_base_url: `https://www.example.com/search?topic=${encodeURIComponent(cleanName)}&q=`
    },
    {
      id: `tool-${Date.now()}-2`,
      tool_title: `${cleanName} ROI & Conversion Calculator`,
      search_box_placeholder: 'Enter your monthly traffic or budget (e.g., 2,500 visits)...',
      target_intent: 'Simulate direct revenue projections and affiliate yield.',
      deep_link_base_url: `https://www.example.com/calculator?offer=${encodeURIComponent(cleanName)}&metric=`
    },
    {
      id: `tool-${Date.now()}-3`,
      tool_title: `${cleanName} Competitor Comparison Engine`,
      search_box_placeholder: 'Enter competing product name to see side-by-side specs...',
      target_intent: 'Unbiased side-by-side comparison bridge leading to direct conversion.',
      deep_link_base_url: `https://www.example.com/compare?product=${encodeURIComponent(cleanName)}&vs=`
    }
  ];

  const redditCopy = `A common trap in niche communities is dropping raw affiliate links without context. Instead, diagnose the root issue first. When someone asks about ${productDescription.slice(0, 80)}..., explain the architectural roadblock they are facing. Conclude with: "If you want to test the workflow without committing, check out this searchable directory and benchmark sheet." This builds community karma and drives frictionless conversions.`;

  const facebookCopy = `⚡ Stop wasting hours on manual bottlenecks!\n\nHere is how operators are using ${cleanName} to streamline ${productDescription.slice(0, 100)}:\n\n1️⃣ Automate repetitive research with intent-based micro search tools\n2️⃣ Route qualified leads directly through deep links\n3️⃣ Increase offer retention and CTR by 3.2x\n\nDrop a comment with "${cleanName.split(' ')[0].toUpperCase()}" and I'll send over the walkthrough guide + search portal!`;

  const quoraCopy = `Direct promotion will get your answers collapsed on Quora. Structure your answer using the 'Problem -> Mechanism -> Implementation' framework. Provide a comprehensive breakdown of ${cleanName}, citing concrete workflows and link to the dedicated search utility at the end of the technical explanation as a reference asset.`;

  const twitterCopy = `Most marketers overcomplicate their funnel.\n\nHere is how a single micro-search bridge for "${cleanName}" generated high-intent buyer traffic without ad spend 🧵👇`;

  return {
    target_platforms: platforms,
    keywords,
    questions,
    platform_copy: {
      'Reddit': {
        copy: redditCopy,
        strategy: `Post in relevant subreddits with >50k members. Deliver 90% upfront value before linking to bridge utility.`
      },
      'Facebook Groups': {
        copy: facebookCopy,
        strategy: `Target active niche practitioner groups. Respond to comments with custom search tool links within 10 minutes.`,
        hook: `How to unlock frictionless conversions using ${cleanName}`,
        visual_concept: `High-contrast diagram contrasting 3-step search engine flow vs outdated multi-page funnels.`
      },
      'Quora': {
        copy: quoraCopy,
        strategy: `Answer top-ranked questions on Google SERP. Include data table or step breakdown.`
      },
      'Twitter/X': {
        copy: twitterCopy,
        strategy: `Thread format with actionable takeaways. Pin tweet to profile for 48 hours.`
      }
    },
    micro_search_tools: microSearchTools
  };
}
