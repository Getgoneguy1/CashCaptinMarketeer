import React, { useState } from 'react';
import { UploadCloud, Check, Sparkles, FileText, X, AlertCircle } from 'lucide-react';
import { generateMarketingStrategy } from '../services/aiGenerator';
import { Offer } from '../types';

interface BulkOfferModalProps {
  onClose: () => void;
  onImportOffers: (newOffers: Offer[]) => void;
}

export const BulkOfferModal: React.FC<BulkOfferModalProps> = ({
  onClose,
  onImportOffers
}) => {
  const [inputText, setInputText] = useState('');
  const [defaultCategory, setDefaultCategory] = useState('Affiliate Marketing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleTemplate = `Crypto Profit Bot | https://example.com/aff/crypto?tag=MY_ID | Automated algorithmic crypto trading bot for daily gains.
Keto Diet Accelerator | KETO_VIP_99 | 28-day ketogenic meal plan and carb tracker with 200+ recipes.
SaaS Launch Blueprint | SAAS_PARTNER_01 | Complete step-by-step framework for validating and launching software products.`;

  const handleInsertSample = () => {
    setInputText(sampleTemplate);
  };

  const handleImport = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Please paste at least one offer.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // Check if user entered JSON
      let rawItems: Array<{ name: string; tagOrUrl: string; desc: string }> = [];

      const trimmed = inputText.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          rawItems = parsed.map((item: any) => ({
            name: item.product_name || item.name || item.title || 'Untitled Offer',
            tagOrUrl: item.affiliate_id || item.affiliate_url || item.url || item.tag || 'AFF_TAG',
            desc: item.product_description || item.description || item.desc || `${item.product_name || 'Affiliate product'} high-converting offer.`
          }));
        } catch (jsonErr) {
          // not valid JSON, fall back to line parser
        }
      }

      if (rawItems.length === 0) {
        // Line-based parser: Name | Tag or URL | Description (optional)
        const lines = inputText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        for (const line of lines) {
          // Supports delimiter | or , or tab
          const parts = line.includes('|')
            ? line.split('|').map(p => p.trim())
            : line.includes('\t')
            ? line.split('\t').map(p => p.trim())
            : line.split(',').map(p => p.trim());

          if (parts.length >= 2) {
            const name = parts[0];
            const tagOrUrl = parts[1];
            const desc = parts[2] || `High-converting ${name} offer with automated buyer routing.`;
            rawItems.push({ name, tagOrUrl, desc });
          } else if (parts.length === 1 && parts[0].length > 0) {
            rawItems.push({
              name: parts[0],
              tagOrUrl: 'AFF_TAG_01',
              desc: `${parts[0]} - High-converting affiliate offer.`
            });
          }
        }
      }

      if (rawItems.length === 0) {
        setErrorMsg('Could not parse any offers. Please use: Product Name | Tag/URL | Description');
        setIsProcessing(false);
        return;
      }

      setProgress({ current: 0, total: rawItems.length });
      const createdOffers: Offer[] = [];

      for (let i = 0; i < rawItems.length; i++) {
        const item = rawItems[i];
        setProgress({ current: i + 1, total: rawItems.length });

        const isUrl = item.tagOrUrl.startsWith('http://') || item.tagOrUrl.startsWith('https://');
        const affId = isUrl ? 'AFF_PRO_LINK' : item.tagOrUrl;
        const targetUrl = isUrl ? item.tagOrUrl : `https://example.com/partner/${encodeURIComponent(affId)}`;

        const aiData = await generateMarketingStrategy(item.name, item.desc, affId);

        createdOffers.push({
          id: `offer-${Date.now()}-${i}`,
          product_name: item.name,
          product_description: item.desc,
          affiliate_id: affId,
          target_url: targetUrl,
          category: defaultCategory,
          keywords: aiData.keywords,
          platform_copy: aiData,
          created_at: new Date().toISOString(),
          clicks: 0,
          conversions: 0,
          revenue: 0
        });
      }

      onImportOffers(createdOffers);
      onClose();
    } catch (err: any) {
      setErrorMsg(`Import failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] shadow-2xl max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94a3b8] hover:text-white p-1 rounded-md text-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Quick Bulk Add Offers</h2>
            <p className="text-xs text-[#94a3b8]">Paste multiple affiliate offers at once to import in seconds</p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#cbd5e1] font-semibold">
              Format: <code className="text-sky-300 font-mono">Product Name | Affiliate Tag or URL | Description</code>
            </span>
            <button
              onClick={handleInsertSample}
              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              Paste Example
            </button>
          </div>

          <textarea
            rows={7}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Crypto Profit Bot | https://example.com/aff/crypto?tag=MY_ID | Automated crypto trading bot.\nKeto Accelerator | KETO_VIP_99 | 28-day keto meal plan.\nSaaS Blueprint | SAAS_01 | Software launch guide.`}
            className="w-full px-3 py-2.5 bg-[#0f172a] border border-[#475569] rounded-lg text-white font-mono text-xs focus:outline-none focus:border-[#3b82f6] transition-colors resize-y placeholder:text-[#64748b]"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#cbd5e1] mb-1">
                Default Category for Imported Offers:
              </label>
              <input
                type="text"
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f172a] border border-[#475569] rounded-md text-white text-xs focus:outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleImport}
                disabled={isProcessing}
                className={`w-full py-2.5 px-4 rounded-md font-bold text-xs text-white transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isProcessing
                    ? 'bg-blue-800 text-blue-300 cursor-not-allowed'
                    : 'bg-[#3b82f6] hover:bg-[#2563eb] shadow-md shadow-blue-500/20'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>
                      Generating {progress ? `(${progress.current}/${progress.total})...` : '...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Import All Offers</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
