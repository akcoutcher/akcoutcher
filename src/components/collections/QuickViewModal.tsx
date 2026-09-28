import React, { useState } from 'react';
import { ProductItem } from '../../types/product';
import { useCouture } from '../../context/CoutureContext';
import { ProductBadgeTag } from './ProductBadges';
import { X, Star, Heart, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface QuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onNavigate,
}) => {
  const {
    formatPrice,
    addToCart,
    productWishlist,
    toggleProductWishlist,
  } = useCouture();

  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  });
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return product.colors && product.colors.length > 0 ? product.colors[0].name : '';
  });
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = productWishlist.includes(product.id);
  const isBeauty = ['LIPSTICKS', 'EYELINERS', 'MAKEUP & BEAUTY'].includes(product.category.toUpperCase());
  const isClothing = ['SUITS', 'LEHENGA', 'DRESSES', 'ETHNIC WEAR', 'WESTERN WEAR', 'CLOTHING', 'PARTY WEAR'].includes(product.category.toUpperCase());

  const handleAddToCart = () => {
    addToCart(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
    });
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
    });
    onClose();
    if (onNavigate) {
      onNavigate('/checkout');
    }
  };

  const handleViewFullPage = () => {
    onClose();
    if (onNavigate) {
      onNavigate(`/collections/${product.slug}`);
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 text-stone-700 hover:text-[#58111A] hover:bg-white shadow-md transition-colors"
          aria-label="Close Quick View"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 bg-[#F8F7F4] p-6 flex flex-col justify-between overflow-y-auto">
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shadow-xs mb-4">
            <img
              src={images[selectedImageIndex] || product.thumbnail}
              alt={product.productName}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3">
              <ProductBadgeTag badge={product.badge} />
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#C9A227] scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.productName} preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex text-[#C9A227]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#C9A227] text-[#C9A227]'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-stone-700 font-semibold">{product.rating}</span>
                <span className="text-stone-400">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-medium leading-tight">
              {product.productName}
            </h2>

            {/* Price block */}
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-medium text-[#0B0B0B]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-[#0B0B0B] text-[#E6C65C] border border-[#C9A227]/40 rounded">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs uppercase font-medium tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Color / Shade:</span>
                  <span className="text-[#C9A227] font-semibold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group relative p-1 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? 'border-[#C9A227]' : 'border-transparent'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="block w-6 h-6 rounded-full shadow-inner border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clothing Sizes (Only for clothing, never for beauty products) */}
            {isClothing && product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="text-xs uppercase font-medium tracking-wider text-stone-700 flex items-center justify-between">
                  <span>Select Size:</span>
                  <span className="text-stone-500 font-mono text-[11px]">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 text-xs rounded border transition-all ${
                        selectedSize === s
                          ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Beauty Specs Snippet */}
            {isBeauty && product.beautyAttributes && (
              <div className="p-3 bg-[#FAF7F2] rounded-lg border border-[#EADDD0] text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-500">Finish:</span>
                  <span className="font-medium text-stone-800">{product.beautyAttributes.finish}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Net Quantity:</span>
                  <span className="font-medium text-stone-800">{product.beautyAttributes.netQuantity}</span>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs uppercase font-medium tracking-wider text-stone-700">Quantity:</span>
              <div className="inline-flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-semibold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-mono font-semibold text-stone-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-semibold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 border border-stone-300 text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl bg-[#0B0B0B] hover:bg-[#58111A] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center shadow-md cursor-pointer"
              >
                <span>Buy Now</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <button
                onClick={() => toggleProductWishlist(product.id)}
                className="flex items-center gap-1.5 hover:text-[#58111A] cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C9A227] text-[#C9A227]' : ''}`} />
                <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={handleViewFullPage}
                className="flex items-center gap-1 font-semibold text-[#58111A] hover:underline cursor-pointer"
              >
                <span>View Full Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-stone-500 font-light border-t border-stone-100">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C9A227]" />
                Free Express Delivery &gt; ₹2000
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                100% Authentic Atelier Guarantee
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
