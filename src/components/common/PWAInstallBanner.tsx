import React, { useState, useEffect } from 'react';
import { Smartphone, X, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('kaur_pwa_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('kaur_pwa_banner_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setDismissed(true);
      }
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#2A050B] via-[#4A0D17] to-[#2A050B] text-[#FAF7F2] border-b border-[#C5A059]/40 py-2.5 px-4 shadow-md transition-all">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-7 h-7 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            </div>
            <div>
              <span className="font-semibold text-white tracking-wide">Install the AK Couture App: </span>
              <span className="text-stone-300">
                Experience seamless haute couture shopping, offline bridal lookbooks & 1-tap appointments.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstall}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-semibold tracking-wider uppercase text-[11px] rounded transition shadow cursor-pointer active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isIOS ? 'How to Install' : 'Install App'}</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-[#1C1917] border border-[#C5A059]/50 p-6 shadow-2xl text-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h4 className="font-serif text-lg text-white font-medium">Install on iOS / Safari</h4>
              <button onClick={() => setShowIOSModal(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              1. Tap the <strong className="text-white">Share</strong> icon at the bottom of your Safari screen.<br />
              2. Scroll down and choose <strong className="text-[#C5A059]">&ldquo;Add to Home Screen&rdquo;</strong>.<br />
              3. Tap <strong className="text-white">&ldquo;Add&rdquo;</strong> in the top right corner.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-[#58111A] text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-[#6B1D2F] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
