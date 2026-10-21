# CashCaptin Marketeer

An Affiliate Search Tools Engine, Multi-Platform AI Copywriting & Hub Generator with real-time performance tracking and accounting.

## Features

- **Control Center & Accounting**:
  - Live performance dashboard tracking clicks, conversions, total revenue, conversion rate, and EPC (earnings per click).
  - Manual accounting ledger updates (conversions & revenue).
  - Built-in click simulator testing affiliate redirect flows with query payloads.

- **Batch Pipeline & Deployment**:
  - Automated batch builder generating platform marketing assets, micro-search tool widgets, and offer hub pages.
  - Live stdout terminal emulator logging batch progress and manifest status.

- **Multi-Platform AI Marketing Strategist**:
  - Generates compliance-safe promotional copy tailored for Reddit, Facebook Groups, Quora, and Twitter/X.
  - Formulates high-intent buyer keywords and pain-point buyer questions.
  - Powered by Gemini 2.5 Flash via `@google/genai` with deterministic fallback.

- **Micro Search Tools & Hub Portals**:
  - Dedicated interactive search boxes for each offer that dynamically route user queries with affiliate tags attached.
  - Dedicated offer hubs and master affiliate directory portal.

- **Click Tracker & Attribution**:
  - Full redirect log recording timestamps, offer IDs, queries, and destination URLs.
  - Direct conversion attribution triggers.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Lucide React icons
- `@google/genai`

## Development

```bash
npm install
npm run dev
```

Dev server runs on `http://0.0.0.0:3000`.
