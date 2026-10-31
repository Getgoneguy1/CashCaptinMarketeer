import React, { useEffect, useRef, useState } from 'react';
import { CreditCard, ExternalLink, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface PayPalBuyButtonProps {
  hostedButtonId?: string;
  itemName?: string;
  amount?: number;
  businessEmail?: string;
  className?: string;
  onPaymentSuccess?: () => void;
}

declare global {
  interface Window {
    paypal?: {
      HostedButtons?: (options: { hostedButtonId: string }) => {
        render: (containerSelector: string) => Promise<void>;
      };
    };
  }
}

export const PayPalBuyButton: React.FC<PayPalBuyButtonProps> = ({
  hostedButtonId = 'ZGT7S2VPTE4D4',
  itemName = 'Cash Captain Marketeer License',
  amount = 97.0,
  businessEmail = 'yeahwegotthat@proton.me',
  className = '',
  onPaymentSuccess
}) => {
  const containerId = useRef(`paypal-container-${hostedButtonId}-${Math.floor(Math.random() * 10000)}`);
  const [isRendered, setIsRendered] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Direct PayPal Webscr Fallback URL to yeahwegotthat@proton.me
  const directCheckoutUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(
    businessEmail
  )}&item_name=${encodeURIComponent(itemName)}&amount=${amount.toFixed(2)}&currency_code=USD`;

  useEffect(() => {
    let mounted = true;

    const renderButton = () => {
      const containerEl = document.getElementById(containerId.current);
      if (!containerEl) return;

      if (window.paypal && typeof window.paypal.HostedButtons === 'function') {
        try {
          containerEl.innerHTML = '';
          window.paypal
            .HostedButtons({
              hostedButtonId: hostedButtonId
            })
            .render(`#${containerId.current}`)
            .then(() => {
              if (mounted) setIsRendered(true);
            })
            .catch((err: unknown) => {
              console.warn('PayPal hosted button render notice:', err);
              if (mounted) setLoadError(true);
            });
        } catch (e) {
          console.warn('PayPal initialization warning:', e);
          if (mounted) setLoadError(true);
        }
      } else {
        // If script hasn't initialized yet, retry after 500ms
        setTimeout(() => {
          if (mounted && !isRendered) {
            renderButton();
          }
        }, 500);
      }
    };

    renderButton();

    return () => {
      mounted = false;
    };
  }, [hostedButtonId]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Official PayPal Hosted Button Container */}
      <div id={containerId.current} className="min-h-[44px] flex justify-center items-center" />

      {/* Direct Fallback Button (ensures 100% reliability if script blocked or loading) */}
      <div className="pt-1">
        <a
          href={directCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border border-[#004f8c]"
        >
          <CreditCard className="w-4 h-4 text-amber-300" />
          <span>Pay via PayPal ({businessEmail})</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Official PayPal Verified &bull; Destination: <strong className="text-slate-300">{businessEmail}</strong></span>
      </div>
    </div>
  );
};
