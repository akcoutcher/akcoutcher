import React from 'react';
import { useCouture } from '../../context/CoutureContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  onNavigate?: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTotal,
    formatPrice,
  } = useCouture();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2000;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (onNavigate) {
      onNavigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    if (onNavigate) {
      onNavigate('/collections');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#58111A]" />
              <h2 className="font-serif text-xl font-medium text-stone-900">
                Shopping Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cart.length > 0 && (
            <div className="px-5 py-2.5 bg-[#FAF7F2]/60 border-b border-stone-100">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                {amountNeededForFreeShipping === 0 ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                    Congratulations! You qualify for Free Delivery
                  </span>
                ) : (
                  <span>
                    Add <strong className="font-semibold text-[#0B0B0B]">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-emerald-700">Free Express Delivery</strong>
                  </span>
                )}
                <span className="font-mono text-[10px] text-stone-400">{progressToFreeShipping}%</span>
              </div>
              <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9A227] transition-all duration-500 rounded-full"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-stone-200 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8 text-[#C9A227]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-stone-800">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs leading-relaxed font-light">
                    Explore our curated fashion, beauty and accessories collections to discover your next signature piece.
                  </p>
                </div>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-2.5 rounded-lg bg-[#0B0B0B] hover:bg-[#58111A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                >
                  Shop Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 pb-4 border-b border-stone-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-24 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            if (onNavigate) onNavigate(`/collections/${item.slug}`);
                          }}
                          className="font-serif text-sm font-medium text-stone-900 hover:text-[#58111A] line-clamp-1 cursor-pointer"
                        >
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 space-y-0.5 mt-0.5">
                        {item.selectedSize && (
                          <div>Size: <span className="text-stone-800 font-semibold">{item.selectedSize}</span></div>
                        )}
                        {item.selectedColor && (
                          <div>Variant: <span className="text-stone-800 font-semibold">{item.selectedColor}</span></div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controls */}
                      <div className="inline-flex items-center border border-stone-200 rounded bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Price subtotal */}
                      <span className="font-serif text-sm font-medium text-[#0B0B0B]">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#FAF7F2] space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-stone-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono text-stone-900">
                    {cartSubtotal > 2000 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      formatPrice(150)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-stone-200 font-semibold text-[#0B0B0B]">
                  <span className="font-serif">Total</span>
                  <span className="font-serif text-base">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#0B0B0B] hover:bg-[#58111A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 font-light pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>100% Encrypted &amp; Secure Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
