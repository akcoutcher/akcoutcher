import React, { useState } from 'react';
import { X, Play, Volume2, VolumeX, Sparkles, Award } from 'lucide-react';

interface RunwayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  season?: string;
  videoUrl?: string;
  description?: string;
}

export const RunwayModal: React.FC<RunwayModalProps> = ({
  isOpen,
  onClose,
  title = 'Haute Couture Runway Presentation',
  season = 'Autumn / Winter Couture Collection',
  videoUrl,
  description = 'Experience the movement, royal flare, and intricate zardozi reflections under the runway lights. Each ensemble is an heirloom tribute to Punjab’s regal heritage.',
}) => {
  const [muted, setMuted] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-stone-950 text-white rounded-2xl border border-[#C5A059]/40 overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#1A0307] border-b border-[#C5A059]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <div>
              <h3 className="font-serif text-lg tracking-wide text-white">{title}</h3>
              <p className="text-[10px] uppercase tracking-widest text-[#C5A059]">{season}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Cinema Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {videoUrl ? (
            <video
              src={videoUrl}
              autoPlay
              loop
              muted={muted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            /* Atmospheric cinematic runway visualizer */
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <img
                src="/src/assets/images/hero_ak_couture_1790594513046.jpg"
                alt="Runway"
                className="absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 text-center px-6 space-y-4 max-w-lg">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center animate-pulse">
                  <Play className="w-7 h-7 text-[#C5A059] ml-1 fill-[#C5A059]" />
                </div>
                <h4 className="font-serif text-2xl text-white font-light">
                  AK Couture Live Atelier &amp; Fashion Showcase
                </h4>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  Presented at Fashion Week: Grand silhouettes, authentic gota patti, and hand-embroidered velvet heirlooms.
                </p>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          {videoUrl && (
            <button
              onClick={() => setMuted(!muted)}
              className="absolute bottom-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-black/80 transition cursor-pointer"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="p-6 bg-[#141210] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <p className="max-w-xl leading-relaxed">{description}</p>
          <div className="flex items-center gap-2 text-[#C5A059] font-medium tracking-wider uppercase text-[11px] shrink-0">
            <Award className="w-4 h-4" />
            <span>Official Atelier Showcase</span>
          </div>
        </div>
      </div>
    </div>
  );
};
