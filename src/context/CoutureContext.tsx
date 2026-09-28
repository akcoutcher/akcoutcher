import React, { createContext, useContext, useState, useEffect } from 'react';
import { DesignItem } from '../types/database';
import { ProductItem, CartItem } from '../types/product';

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
  
  // Traditional Design Item Lookbook
  wishlist: DesignItem[];
  addToWishlist: (item: DesignItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: DesignItem) => void;
  lookbookOpen: boolean;
  setLookbookOpen: (open: boolean) => void;

  // E-Commerce Product Wishlist
  productWishlist: string[];
  toggleProductWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;

  // Shopping Cart
  cart: CartItem[];
  addToCart: (product: ProductItem, options?: { size?: string; color?: string; quantity?: number }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Quick View Modal
  quickViewProduct: ProductItem | null;
  setQuickViewProduct: (product: ProductItem | null) => void;

  // Measurements
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

  // Product Wishlist (stored by product ID)
  const [productWishlist, setProductWishlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ak_product_wishlist');
        return saved ? JSON.parse(saved) : ['prod-lipstick-crimson', 'prod-punjabi-suit-zardozi'];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Shopping Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ak_shopping_cart');
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
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

  // Sync state to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kaur_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ak_product_wishlist', JSON.stringify(productWishlist));
    }
  }, [productWishlist]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ak_shopping_cart', JSON.stringify(cart));
    }
  }, [cart]);

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
    if (priceInINR === undefined || priceInINR === null || priceInINR <= 0) return 'Price on Request';
    const cfg = CURRENCIES[currency];
    const converted = Math.round(priceInINR * cfg.rateFromINR);

    if (currency === 'INR') {
      return `₹${priceInINR.toLocaleString('en-IN')}`;
    }
    return `${cfg.symbol} ${converted.toLocaleString()}`;
  };

  // Traditional design wishlist
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

  // Product Wishlist
  const isProductInWishlist = (productId: string) => {
    return productWishlist.includes(productId);
  };

  const toggleProductWishlist = (productId: string) => {
    setProductWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Cart operations
  const addToCart = (
    product: ProductItem,
    options?: { size?: string; color?: string; quantity?: number }
  ) => {
    const selectedSize = options?.size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const selectedColor = options?.color || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const quantity = Math.max(1, options?.quantity || 1);
    const cartItemId = `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        productName: product.productName,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.thumbnail || (product.images && product.images[0]) || '',
        category: product.category,
        selectedSize,
        selectedColor,
        quantity,
        sku: product.sku,
      };
      return [...prev, newItem];
    });

    // Auto-open cart to show user their added item
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = cartSubtotal > 2000 || cartSubtotal === 0 ? 0 : 150;
  const cartTotal = cartSubtotal + shippingCost;

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
        productWishlist,
        toggleProductWishlist,
        isProductInWishlist,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
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

