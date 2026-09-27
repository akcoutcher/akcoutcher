import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'banner' | 'floating' | 'footer';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'nav', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed in standalone mode, do not render
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        await install();
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // For browsers without prompt yet, show instructional modal
      setShowIOSGuide(true);
    }
  };

  // Render button based on variant
  return (
    <>
      {variant === 'nav' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#C5A059] border border-[#C5A059]/40 hover:border-[#C5A059] hover:bg-[#C5A059]/10 rounded transition-all cursor-pointer ${className}`}
          title="Install App for fast offline access and VIP alerts"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`bg-[#2D080E] text-[#FAF7F2] border-b border-[#C5A059]/30 px-4 py-2.5 flex items-center justify-between gap-4 text-xs ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#58111A] border border-[#C5A059]/50 flex items-center justify-center shrink-0">
              <img src="/pwa-192x192.png" alt="AK Couture" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="font-medium text-white tracking-wide">Install AK Couture App</p>
              <p className="text-[11px] text-stone-300">Fast 1-tap launch, offline lookbook, and VIP appointment booking</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              disabled={isInstalling}
              className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] text-stone-950 font-semibold tracking-wider uppercase text-[11px] rounded transition shadow cursor-pointer"
            >
              {isInstalling ? 'Installing...' : 'Install Now'}
            </button>
          </div>
        </div>
      )}

      {variant === 'footer' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-2 text-stone-400 hover:text-[#C5A059] transition-colors text-xs cursor-pointer ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Official Mobile App</span>
        </button>
      )}

      {/* iOS / Browser Guided Installation Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#1C1917] border border-[#C5A059]/40 p-6 shadow-2xl text-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-[#58111A] flex items-center justify-center border border-[#C5A059]/40">
                  <img src="/icon.svg" alt="App Icon" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-medium">Install AK Couture</h3>
                  <p className="text-[10px] uppercase tracking-wider text-[#C5A059]">Haute Couture Mobile App</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-stone-300">
              <p className="text-stone-200 font-serif text-sm">
                Install this app on your phone or computer to browse couture collections with zero wait time and access VIP atelier fittings even when offline.
              </p>

              <div className="bg-[#2A2421] rounded-xl p-4 border border-stone-700/60 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#58111A] rounded text-[#C5A059] shrink-0 mt-0.5">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Step 1: </span>
                    <span>Tap the <strong>Share</strong> button (bottom bar on Safari or browser menu icon).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#58111A] rounded text-[#C5A059] shrink-0 mt-0.5">
                    <PlusSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Step 2: </span>
                    <span>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-[#58111A] rounded text-[#C5A059] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white">Step 3: </span>
                    <span>Confirm by tapping <strong>&ldquo;Add&rdquo;</strong> in the top-right corner.</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-400 italic text-center">
                Desktop users: You can also click the install icon in your browser address bar (Chrome, Edge, Brave).
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-[#58111A] hover:bg-[#6B1D2F] border border-[#C5A059]/50 text-white font-medium text-xs uppercase tracking-wider rounded transition cursor-pointer"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
