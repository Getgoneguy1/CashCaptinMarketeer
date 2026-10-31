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
    <div className="bg-[#0c1222] rounded-2xl p-6 border border-slate-800 shadow-xl mb-6 space-y-4">
      <div className="pb-3 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" />
          Add New Affiliate Offer
        </h2>
        <p className="text-xs text-slate-400">
          Add product details to generate compliance-safe promotional copy, search widgets, and hub index
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Affiliate Traffic Booster"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-semibold placeholder:text-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Affiliate ID / Tag *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g., TY_BIRCH_99"
                value={affiliateId}
                onChange={(e) => setAffiliateId(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-mono placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target / Destination Link (Optional)
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="url"
                placeholder="https://vendor.com/?ref=your-id"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              Market Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition-all"
            >
              <option value="Digital Marketing">Digital Marketing & Software</option>
              <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Finance & Crypto">Finance & Wealth</option>
              <option value="Productivity & AI">AI Tools & Automation</option>
              <option value="Education & Coaching">Education & Courses</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
            Product Description & Features *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Detailed description of what the product does, key benefits, target audience, and competitive edge..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full px-4 py-3 bg-[#060913] border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-y placeholder:text-slate-600"
          />
        </div>

        {/* Product Picture Input (Upload or URL) */}
        <div className="bg-[#060913] p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              Product Photo / Ad Creative (Optional)
            </label>
            {imageUrl && (
              <button
                type="button"
                onClick={() => setImageUrl(null)}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer transition"
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
              className="flex-1 px-3 py-2 bg-[#0c1222] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 placeholder:text-slate-600"
            />
            <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
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
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-emerald-500/60 bg-slate-900 shrink-0">
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
            className={`w-full py-3.5 px-4 rounded-xl font-black text-slate-950 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 ${
              isSubmitting
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99]'
            }`}
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>Generating AI Assets & Saving Offer...</span>
              </>
            ) : success ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Offer Saved & Marketing Assets Generated!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Save Offer & Generate Multi-Platform Assets</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
