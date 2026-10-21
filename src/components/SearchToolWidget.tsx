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
      alert('Please enter a search term.');
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
    <div className="bg-[#1e293b] rounded-xl p-6 sm:p-8 border border-[#334155] shadow-2xl max-w-lg w-full text-center relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94a3b8] hover:text-white p-1 rounded-md text-lg cursor-pointer"
        >
          ✕
        </button>
      )}

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Micro Search Tool Utility</span>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
        {tool.tool_title}
      </h2>

      <p className="text-xs text-[#94a3b8] mb-6">
        {tool.target_intent || 'Search query routes with active affiliate deep-link ID.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tool.search_box_placeholder || 'Enter search query...'}
            className="w-full px-4 py-3.5 bg-[#0f172a] border border-[#475569] rounded-lg text-white text-base focus:outline-none focus:border-[#3b82f6] shadow-inner transition-colors placeholder:text-[#64748b]"
            autoFocus={isModal}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 px-6 bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.99] text-white rounded-lg text-base font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span>Search & Access</span>
        </button>
      </form>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#64748b]">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Deep-link tag attached: <code className="text-sky-300 font-mono font-semibold">{offer.affiliate_id}</code></span>
      </div>

      {lastExecutedUrl && (
        <div className="mt-6 pt-5 border-t border-[#334155] text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              Search Executed & Click Recorded!
            </span>
            <button
              onClick={handleCopyLink}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              {copied ? 'Copied URL!' : 'Copy Deep-Link'}
            </button>
          </div>

          <div className="p-2.5 rounded bg-[#0f172a] border border-[#334155] text-xs font-mono text-[#38bdf8] break-all mb-3">
            {lastExecutedUrl}
          </div>

          <a
            href={lastExecutedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Open Destination URL in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        {widgetContent}
      </div>
    );
  }

  return widgetContent;
};
