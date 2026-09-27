import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-[#2D080E] border border-[#C5A059] px-4 py-2 text-xs font-medium text-[#FAF7F2] shadow-2xl animate-pulse">
      <WifiOff className="w-4 h-4 text-[#C5A059]" />
      <span>Offline Mode — Browsing cached haute couture catalog</span>
    </div>
  );
};
