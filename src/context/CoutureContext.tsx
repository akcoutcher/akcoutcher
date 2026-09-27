import React, { createContext, useContext, useState, useEffect } from 'react';
import { DesignItem } from '../types/database';

export type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'CAD' | 'AED' | 'EUR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number;
  label: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateFromINR: 1, label: 'INR (₹)' },
  USD: { code: 'USD', symbol: '$', rateFromINR: 0.012, label: 'USD ($)' },
  GBP: { code: 'GBP', symbol: '£', rateFromINR: 0.0095, label: 'GBP (£)' },
  CAD: { code: 'CAD', symbol: 'CA$', rateFromINR: 0.016, label: 'CAD (CA$)' },
  AED: { code: 'AED', symbol: 'AED', rateFromINR: 0.044, label: 'AED (د.إ)' },
  EUR: { code: 'EUR', symbol: '€', rateFromINR: 0.011, label: 'EUR (€)' },
};

export interface Measurements {
  unit: 'inches' | 'cm';
  bust: string;
  waist: string;
  hips: string;
  shoulder: string;
  armhole: string;
  sleeveLength: string;
  kurtaLength: string;
  bottomLength: string;
  neckDepthFront: string;
  neckDepthBack: string;
  height: string;
  notes: string;
}

export const DEFAULT_MEASUREMENTS: Measurements = {
  unit: 'inches',
  bust: '',
  waist: '',
  hips: '',
  shoulder: '',
  armhole: '',
  sleeveLength: '',
  kurtaLength: '',
  bottomLength: '',
  neckDepthFront: '',
  neckDepthBack: '',
  height: '',
  notes: '',
};

interface CoutureContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceInINR?: number | null) => string;
  wishlist: DesignItem[];
  addToWishlist: (item: DesignItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: DesignItem) => void;
  lookbookOpen: boolean;
  setLookbookOpen: (open: boolean) => void;
  measurements: Measurements;
  updateMeasurements: (m: Partial<Measurements>) => void;
  measurementModalOpen: boolean;
  setMeasurementModalOpen: (open: boolean) => void;
}

const CoutureContext = createContext<CoutureContextType | undefined>(undefined);

export const CoutureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kaur_currency') as CurrencyCode;
      if (saved && CURRENCIES[saved]) return saved;
    }
    return 'INR';
  });

  const [wishlist, setWishlist] = useState<DesignItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kaur_wishlist');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [lookbookOpen, setLookbookOpen] = useState(false);
  const [measurementModalOpen, setMeasurementModalOpen] = useState(false);

  const [measurements, setMeasurementsState] = useState<Measurements>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kaur_measurements');
        return saved ? JSON.parse(saved) : DEFAULT_MEASUREMENTS;
      } catch {
        return DEFAULT_MEASUREMENTS;
      }
    }
    return DEFAULT_MEASUREMENTS;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaur_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaur_currency', c);
    }
  };

  const updateMeasurements = (m: Partial<Measurements>) => {
    setMeasurementsState((prev) => {
      const updated = { ...prev, ...m };
      if (typeof window !== 'undefined') {
        localStorage.setItem('kaur_measurements', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const formatPrice = (priceInINR?: number | null): string => {
    if (!priceInINR || priceInINR <= 0) return 'Price on Request';
    const cfg = CURRENCIES[currency];
    const converted = Math.round(priceInINR * cfg.rateFromINR);

    if (currency === 'INR') {
      return `₹${priceInINR.toLocaleString('en-IN')}`;
    }
    return `${cfg.symbol} ${converted.toLocaleString()}`;
  };

  const addToWishlist = (item: DesignItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some((i) => i.id === id);
  };

  const toggleWishlist = (item: DesignItem) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  return (
    <CoutureContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        lookbookOpen,
        setLookbookOpen,
        measurements,
        updateMeasurements,
        measurementModalOpen,
        setMeasurementModalOpen,
      }}
    >
      {children}
    </CoutureContext.Provider>
  );
};

export const useCouture = () => {
  const context = useContext(CoutureContext);
  if (!context) {
    throw new Error('useCouture must be used within a CoutureProvider');
  }
  return context;
};
