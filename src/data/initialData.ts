import { Offer, TrackingMetrics } from '../types';

export const INITIAL_TRACKING: TrackingMetrics = {
  clicks: 142,
  conversions: 18,
  revenue: 684.50,
  lastUpdated: new Date().toISOString()
};

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    product_name: 'Affiliate Traffic Booster',
    product_description: 'A step-by-step system for generating free buyer traffic and deep linking affiliate offers.',
    affiliate_id: 'TY_BIRCH_99',
    category: 'Traffic & SEO',
    target_url: 'https://example.com/affiliate-traffic-booster',
    keywords: ['buyer traffic', 'deep linking', 'free affiliate traffic', 'organic affiliate sales', 'traffic engine'],
    created_at: '2026-03-15T10:00:00.000Z',
    clicks: 68,
    conversions: 9,
    revenue: 342.00,
    platform_copy: {
      target_platforms: ['Reddit', 'Facebook Groups', 'Quora', 'Twitter/X'],
      keywords: ['buyer traffic', 'deep linking affiliate', 'free buyer traffic 2026', 'organic affiliate sales', 'high converting bridge pages'],
      questions: [
        'How do I get buyer traffic to my affiliate links without paying for ads?',
        'What is deep linking in affiliate marketing and why does it convert higher?',
        'How to avoid getting banned on social media when sharing affiliate links?',
        'What is the fastest way to make first affiliate sale with free traffic?',
        'How do micro search tools increase affiliate CTR?'
      ],
      platform_copy: {
        'Reddit': {
          copy: "A mistake most beginners make when posting affiliate links is dropping direct offer links in comments—that's an instant ban. The solution that actually converts is creating a lightweight micro-search tool or bridge page. Provide value first answering the exact question, then say: 'I compiled a quick searchable directory for this toolset if anyone wants to check it out without paying for subscriptions.' Engagement stays positive and moderators leave it alone.",
          strategy: "Target r/AffiliateMarketing, r/Entrepreneur, r/DigitalMarketing. Always deliver 90% direct value before soft-linking."
        },
        'Facebook Groups': {
          copy: "Stop burning ad budgets on cold audiences! 🔥\n\nHere's the exact 3-step loop our team uses to extract high-intent buyer traffic organically using targeted search tool hubs:\n1. Spot repetitive buyer queries in active niche communities\n2. Deploy a single-input micro search box that deep links directly into the resolved offer\n3. Watch conversion rates double without burning your ad account.\n\nDrop a comment below with 'TRAFFIC' and I will send you the blueprint!",
          strategy: "Post in high-engagement affiliate marketing and side hustle groups. Respond to every comment within 15 minutes.",
          hook: "The $0 ad-spend framework that crushed 6-figure launches this quarter.",
          visual_concept: "Split-screen graphic showing paid ad dashboard with negative ROI vs simple search box portal driving 34% opt-in conversions."
        },
        'Quora': {
          copy: "Direct affiliate linking is dead on Quora and will quickly collapse your profile views. Instead, formulate your answer using the 'Problem -> Technical Diagnosis -> Search Tool Solution' methodology. When explaining how to drive organic buyer traffic, show how deep linking through specialized search tools routes users directly to checkout-ready states, eliminating checkout abandonment.",
          strategy: "Answer questions with >10,000 views and high answer requests. Place the bridge URL in reference citations at the footer."
        },
        'Twitter/X': {
          copy: "Affiliate marketing in 2026 isn't about spamming link shorteners.\n\nIt's about building utility.\n\nHere is how micro search tools turn cold scrollers into high-ticket buyers (1/7) 🧵👇",
          strategy: "Post between 9am-11am EST. Retweet first tweet after 4 hours with traction."
        }
      },
      micro_search_tools: [
        {
          id: 'tool-1',
          tool_title: 'Buyer Traffic Deep-Link Scout',
          search_box_placeholder: 'Enter niche or product name (e.g., fitness, SaaS)...',
          target_intent: 'Find high-converting buyer traffic paths and deep-link structures.',
          deep_link_base_url: 'https://example.com/search?intent=traffic&q='
        },
        {
          id: 'tool-2',
          tool_title: 'Affiliate Bridge Page Analyzer',
          search_box_placeholder: 'Enter keyword to find winning bridge page formats...',
          target_intent: 'Analyze top-performing affiliate bridge page layouts.',
          deep_link_base_url: 'https://example.com/bridge-inspect?q='
        },
        {
          id: 'tool-3',
          tool_title: 'Organic Keyword Arbitrage Tool',
          search_box_placeholder: 'Search for zero-competition buyer queries...',
          target_intent: 'Locate untapped buyer search terms with high purchase intent.',
          deep_link_base_url: 'https://example.com/keyword-arbitrage?q='
        }
      ]
    }
  },
  {
    id: 'offer-2',
    product_name: 'AI Content Automator',
    product_description: 'An automated workflow tool for generating and scheduling short-form video scripts and bridge pages.',
    affiliate_id: 'TY_BIRCH_99',
    category: 'Automation & Video',
    target_url: 'https://example.com/ai-content-automator',
    keywords: ['ai video scripts', 'short form automation', 'tiktok affiliate', 'reels generator', 'automated bridge pages'],
    created_at: '2026-03-16T14:30:00.000Z',
    clicks: 44,
    conversions: 6,
    revenue: 228.00,
    platform_copy: {
      target_platforms: ['TikTok/Shorts', 'Reddit', 'Facebook Groups', 'YouTube'],
      keywords: ['ai shorts generator', 'automated affiliate videos', 'short form script bot', 'reels affiliate loop', 'viral bridge page'],
      questions: [
        'How can I automate 30 TikTok videos in under an hour for affiliate sales?',
        'What AI tool writes hooks that keep retention above 60% on Reels?',
        'Can you do faceless affiliate marketing with automated short videos?',
        'How to link affiliate products in YouTube Shorts without penalties?',
        'What is the best workflow to turn trending Reddit posts into video scripts?'
      ],
      platform_copy: {
        'Reddit': {
          copy: "Most people failing with faceless YouTube Shorts are either spending 4 hours per video in Premiere or using low-effort robotic voiceovers that YouTube demotes. The sweet spot is automating the hook and bridge script generation with AI prompt chains, while keeping visual pacing tight (cuts every 1.8s). If you automate the script writing and auto-generate captions, output jumps from 1/day to 10/day.",
          strategy: "Target r/VideoEditing, r/NewTubers, r/ContentCreation. Emphasize workflow efficiency."
        },
        'Facebook Groups': {
          copy: "🎬 FACT: 80% of video views are lost in the first 3 seconds.\n\nStop writing scripts manually. Here is how top digital creators generate 30 high-retention short scripts and high-converting bridge pages in under 12 minutes.\n\nComment 'SCRIPT' for the instant setup!",
          strategy: "Target content creators, social media managers, and digital product sellers.",
          hook: "How I 10x'd short-form content output without hiring an editor.",
          visual_concept: "Side-by-side timer: 4 Hours manual editing vs 90 Seconds automated workflow."
        },
        'YouTube': {
          copy: "Pinned Comment & Description: Looking for the full AI script and bridge generator tool? Access the free prompt database and search tool below (affiliate link supports the channel).",
          strategy: "Place dynamic search tool link in top pinned comment and video description."
        }
      },
      micro_search_tools: [
        {
          id: 'tool-4',
          tool_title: 'Viral Hook & Script Search Engine',
          search_box_placeholder: 'Enter video topic (e.g., productivity hacks, crypto)...',
          target_intent: 'Instant viral hooks and 60-second video script outlines.',
          deep_link_base_url: 'https://example.com/scripts/search?query='
        },
        {
          id: 'tool-5',
          tool_title: 'Faceless Video Template Finder',
          search_box_placeholder: 'Search video niche (e.g., motivation, tech, luxury)...',
          target_intent: 'Browse tested B-roll setups and voiceover templates.',
          deep_link_base_url: 'https://example.com/templates?niche='
        },
        {
          id: 'tool-6',
          tool_title: 'Bridge Page Conversion Calculator',
          search_box_placeholder: 'Input expected monthly traffic volume...',
          target_intent: 'Calculate expected commission earnings with automated bridge pages.',
          deep_link_base_url: 'https://example.com/calculator?metric='
        }
      ]
    }
  },
  {
    id: 'offer-3',
    product_name: 'AI Copywriter Pro',
    product_description: 'An advanced generative copywriting suite for high-converting sales letters, ads, and email sequences.',
    affiliate_id: 'PRO_COPY_88',
    category: 'Software & AI',
    target_url: 'https://example.com/aff/copywriter',
    keywords: ['ai writing', 'copywriting pro', 'sales letters', 'email sequences', 'direct response'],
    created_at: '2026-03-18T09:15:00.000Z',
    clicks: 18,
    conversions: 2,
    revenue: 74.00,
    platform_copy: {
      target_platforms: ['Quora', 'Reddit', 'Twitter/X', 'Medium'],
      keywords: ['best ai copywriting software', 'direct response ai prompt', 'sales letter generator', 'email marketing copy tool', 'high converting ad copy'],
      questions: [
        'How does AI copywriting compare to hiring a direct response copywriter?',
        'Can AI write email sequences with high open rates and clicks?',
        'What is the best prompt framework for sales page copy?',
        'How do top agencies use AI copywriters without sounding robotic?',
        'Which AI tool gives the best ROI for freelance marketers?'
      ],
      platform_copy: {
        'Reddit': {
          copy: "The reason generic AI copy fails is because default models write like corporate PR statements. Direct response copywriting requires PAS (Problem-Agitate-Solution) or AIDA frameworks with strong emotional triggers and specificity. Use specialized tools trained strictly on multi-million dollar swipe files.",
          strategy: "Post in r/copywriting and r/freelance with helpful breakdowns of winning sales letters."
        },
        'Twitter/X': {
          copy: "Most marketing agencies will be replaced by 1 operator with the right AI prompt suite.\n\nHere are the 7 direct-response frameworks we use to produce 50k/mo client deliverables: 🧵",
          strategy: "Include clear screenshots of before/after copywriting conversion rates."
        }
      },
      micro_search_tools: [
        {
          id: 'tool-7',
          tool_title: 'Direct Response Swipe File Finder',
          search_box_placeholder: 'Search swipe file by niche (e.g., ecom, coaching)...',
          target_intent: 'Access top performing historical sales letters and email swipes.',
          deep_link_base_url: 'https://example.com/swipes?niche='
        },
        {
          id: 'tool-8',
          tool_title: 'Ad Headline Conversion Grader',
          search_box_placeholder: 'Paste your headline draft here to score CTR potential...',
          target_intent: 'Instant CTR scoring and emotional impact rating.',
          deep_link_base_url: 'https://example.com/grade-headline?text='
        }
      ]
    }
  },
  {
    id: 'offer-4',
    product_name: 'High-Yield Savings Tracker',
    product_description: 'A smart personal finance companion that compares high-yield APY rates, CDs, and liquid cash management accounts.',
    affiliate_id: 'HY_FIN_22',
    category: 'Finance & Investing',
    target_url: 'https://example.com/aff/savings',
    keywords: ['high yield savings', 'best apy 2026', 'cd rates comparison', 'passive income savings', 'fdic insured cash'],
    created_at: '2026-03-19T11:45:00.000Z',
    clicks: 12,
    conversions: 1,
    revenue: 40.50,
    platform_copy: {
      target_platforms: ['Reddit', 'Facebook Groups', 'Quora', 'Twitter/X'],
      keywords: ['best high yield savings account 2026', 'highest apy rate today', 'fdic bank rates', 'emergency fund apy', 'cash management interest'],
      questions: [
        'Which bank currently offers the highest FDIC insured savings rate?',
        'Is it safe to move money into online-only high-yield savings accounts?',
        'How often do APY rates adjust after Fed interest rate cuts?',
        'What is the difference between a high-yield savings account and money market?',
        'How to maximize interest on a $10,000 emergency fund?'
      ],
      platform_copy: {
        'Reddit': {
          copy: "Leaving your emergency fund in a standard big-bank savings account earning 0.01% is losing hundreds of dollars per year to inflation. You should be in an FDIC-insured high-yield savings account earning 4.5% to 5.2% APY with zero fees and no lock-in periods.",
          strategy: "Contribute to r/personalfinance, r/financialindependence, r/fire."
        }
      },
      micro_search_tools: [
        {
          id: 'tool-9',
          tool_title: 'Real-Time APY Bank Comparison Search',
          search_box_placeholder: 'Enter deposit amount (e.g., $5,000, $25,000)...',
          target_intent: 'Compare current verified bank interest rates and calculate yearly yield.',
          deep_link_base_url: 'https://example.com/rates/compare?deposit='
        },
        {
          id: 'tool-10',
          tool_title: 'Emergency Fund Interest Calculator',
          search_box_placeholder: 'Enter monthly expenses to estimate ideal safety net...',
          target_intent: 'Calculate monthly compounded passive income on savings.',
          deep_link_base_url: 'https://example.com/calc/emergency?exp='
        }
      ]
    }
  }
];
