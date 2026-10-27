import React, { useState } from 'react';
import { Plus, Sparkles, Tag, Globe, Check, Image as ImageIcon, Upload, X } from 'lucide-react';

interface OfferFormProps {
  onAddOffer: (offerData: {
    product_name: string;
    product_description: string;
    affiliate_id: string;
    category?: string;
    target_url?: string;
    image_url?: string;
  }) => Promise<void>;
}

export const OfferForm: React.FC<OfferFormProps> = ({ onAddOffer }) => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [affiliateId, setAffiliateId] = useState('');
  const [category, setCategory] = useState('Digital Marketing');
  const [targetUrl, setTargetUrl] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddOffer({
        product_name: productName.trim(),
        product_description: productDescription.trim(),
        affiliate_id: affiliateId.trim() || 'DEFAULT_AFF',
        category: category.trim(),
        target_url: targetUrl.trim() || `https://example.com/offers/${encodeURIComponent(productName.toLowerCase().replace(/ /g, '-'))}`,
        image_url: imageUrl || undefined
      });

      setProductName('');
      setProductDescription('');
      setAffiliateId('');
      setTargetUrl('');
      setImageUrl(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-[#1e293b] rounded-lg p-5 border border-[#334155] shadow-lg mb-6">
      <div className="pb-3 mb-4 border-b border-[#334155]">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-blue-400" />
          Add New Affiliate Offer
        </h2>
        <p className="text-xs text-[#94a3b8]">
          Add product details to generate compliance-safe promotional copy, search widgets, and hub index
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Affiliate Traffic Booster"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
              Affiliate ID / Tag *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g., TY_BIRCH_99"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
            Product Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="A step-by-step system for generating free buyer traffic and deep linking affiliate offers..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors resize-y"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
            >
              <option value="Digital Marketing">Digital Marketing & SEO</option>
              <option value="Automation & Video">Automation & Video</option>
              <option value="Software & AI">Software & AI Tools</option>
              <option value="Finance & Investing">Finance & High-Yield Accounts</option>
              <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              <option value="Health & Fitness">Health & Wellness</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#cbd5e1] mb-1.5 uppercase tracking-wider">
              Destination URL (Optional)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-[#64748b] absolute left-3 top-3" />
              <input
                type="url"
                placeholder="https://example.com/product"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#0f172a] border border-[#475569] rounded-md text-white text-sm focus:outline-none focus:border-[#3b82f6] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Product Picture Input (Upload or URL) */}
        <div className="bg-[#0f172a] p-3.5 rounded-md border border-[#475569] space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#cbd5e1] uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              Product Picture / Ad Creative (Optional)
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              placeholder="Paste direct Image URL (e.g. https://.../product.png)"
              value={imageUrl?.startsWith('data:') ? '' : imageUrl || ''}
              onChange={(e) => setImageUrl(e.target.value.trim() || null)}
              className="flex-1 px-3 py-2 bg-[#1e293b] border border-[#475569] rounded-md text-white text-xs focus:outline-none focus:border-[#3b82f6]"
            />
            <label className="px-3 py-2 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Upload Image File</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        setImageUrl(reader.result);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {imageUrl && (
            <div className="flex items-center gap-3 pt-1">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-500/60 bg-slate-900 shrink-0">
                <img src={imageUrl} alt="Offer Preview" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                Photo attached. This image will appear on your offer cards, ad previews, and buyer links.
              </span>
            </div>
          )}
        </div>

        <div className="pt-2">

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isSubmitting
                ? 'bg-blue-800 text-blue-200 cursor-not-allowed'
                : 'bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                <span>Generating AI Assets & Saving Offer...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Offer Saved & Marketing Assets Generated!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Offer & Generate Multi-Platform Assets</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
