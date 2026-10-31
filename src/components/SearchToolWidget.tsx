import React, { useState } from 'react';
import { MicroSearchTool, Offer } from '../types';
import { Search, ExternalLink, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { buildDeepLink } from '../services/storage';

interface SearchToolWidgetProps {
  tool: MicroSearchTool;
  offer: Offer;
  onExecuteSearch: (query: string, targetUrl: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const SearchToolWidget: React.FC<SearchToolWidgetProps> = ({
  tool,
  offer,
  onExecuteSearch,
  onClose,
  isModal = false
}) => {
  const [query, setQuery] = useState('');
  const [lastExecutedUrl, setLastExecutedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }

    const targetUrl = buildDeepLink(
      tool.deep_link_base_url,
      query,
      offer.affiliate_id
    );

    setLastExecutedUrl(targetUrl);
    onExecuteSearch(query, targetUrl);
  };

  const handleCopyLink = () => {
    if (!lastExecutedUrl) return;
    navigator.clipboard.writeText(lastExecutedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const widgetContent = (
    <div className="bg-[#0c1222] rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl max-w-lg w-full text-center relative space-y-4">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg text-lg cursor-pointer"
        >
          ✕
        </button>
      )}

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Micro Search Tool Utility</span>
      </div>

      <h2 className="text-2xl font-black text-white tracking-tight">
        {tool.tool_title}
      </h2>

      <p className="text-xs text-slate-400">
        {tool.target_intent || 'Search query routes with active affiliate deep-link ID.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tool.search_box_placeholder || 'Enter search query...'}
            className="w-full px-4 py-3.5 bg-[#060913] border border-slate-800 rounded-xl text-white text-base focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 shadow-inner transition-all placeholder:text-slate-600 font-medium"
            autoFocus={isModal}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 rounded-xl text-base font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-5 h-5 text-slate-950" />
          <span>Search & Access</span>
        </button>
      </form>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Deep-link tag attached: <code className="text-emerald-400 font-mono font-semibold">{offer.affiliate_id}</code></span>
      </div>

      {lastExecutedUrl && (
        <div className="mt-6 pt-5 border-t border-slate-800 text-left space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Generated Deep Link Output:
          </span>
          <div className="p-3 bg-[#060913] rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 break-all select-all">
            {lastExecutedUrl}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowRight className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link!' : 'Copy Deep Link'}</span>
            </button>

            <a
              href={lastExecutedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-4 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 rounded-xl text-xs font-bold border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Test Landing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        {widgetContent}
      </div>
    );
  }

  return widgetContent;
};
