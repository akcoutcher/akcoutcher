import React from 'react';
import { ProductItem } from '../../types/product';
import { useCouture } from '../../context/CoutureContext';
import { ProductBadgeTag } from './ProductBadges';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onNavigate?: (path: string) => void;
  onQuickView?: (product: ProductItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  onQuickView,
}) => {
  const {
    formatPrice,
    addToCart,
    productWishlist,
    toggleProductWishlist,
    setQuickViewProduct,
  } = useCouture();

  const isWishlisted = productWishlist.includes(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if click happened on action buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    if (onNavigate) {
      onNavigate(`/collections/${product.slug}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, {
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
      color: product.colors && product.colors.length > 0 ? product.colors[0].name : undefined,
      quantity: 1,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, {
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined,
      color: product.colors && product.colors.length > 0 ? product.colors[0].name : undefined,
      quantity: 1,
    });
    if (onNavigate) {
      onNavigate('/checkout');
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleProductWishlist(product.id);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setQuickViewProduct(product);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-[#C9A227]/40 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-[4/5] bg-[#F8F7F4] overflow-hidden">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          <ProductBadgeTag badge={product.badge} />
          {product.discount && product.discount > 0 && (
            <span className="px-2 py-0.5 text-[9px] uppercase font-mono font-semibold tracking-wider bg-[#0B0B0B] text-[#E6C65C] border border-[#C9A227]/40 rounded shadow-sm">
              {product.discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm z-10 ${
            isWishlisted
              ? 'bg-[#58111A] text-white'
              : 'bg-white/85 text-stone-700 hover:text-[#58111A] hover:bg-white backdrop-blur-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-[#C9A227]' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <button
            onClick={handleOpenQuickView}
            className="w-full py-2 px-3 rounded-lg bg-white/95 backdrop-blur-md border border-[#C9A227]/50 text-[#0B0B0B] text-xs font-medium tracking-wide uppercase shadow-md hover:bg-[#0B0B0B] hover:text-[#FAF7F2] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div className="space-y-1.5">
          {/* Category & Stock Indicator */}
          <div className="flex items-center justify-between text-[10px] tracking-wider uppercase">
            <span className="text-[#C9A227] font-semibold truncate max-w-[65%]">
              {product.category}
            </span>
            {product.stockStatus === 'in_stock' ? (
              <span className="text-emerald-700 font-mono font-medium flex items-center gap-0.5">
                <Check className="w-2.5 h-2.5" /> In Stock
              </span>
            ) : product.stockStatus === 'low_stock' ? (
              <span className="text-amber-700 font-mono font-medium">Low Stock</span>
            ) : (
              <span className="text-stone-400 font-mono">Pre-Order</span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base sm:text-lg font-medium text-[#151515] group-hover:text-[#58111A] transition-colors line-clamp-1">
            {product.productName}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-stone-500 font-light line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Color & Size Indicators (if available) */}
          <div className="pt-1 flex items-center justify-between gap-2 min-h-[22px]">
            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 ? (
              <div className="flex items-center gap-1">
                {product.colors.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    title={c.name}
                    className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[9px] text-stone-400 font-mono">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <div />
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex items-center gap-1 text-[9px] text-stone-500 font-mono uppercase">
                <span>Sizes:</span>
                <span className="font-semibold text-stone-700">
                  {product.sizes.slice(0, 3).join(', ')}
                  {product.sizes.length > 3 ? '+' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Rating & Review Count */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center text-[#C9A227]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-[#C9A227] text-[#C9A227]'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-mono font-medium text-stone-700">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[10px] text-stone-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Call To Actions */}
        <div className="pt-2 border-t border-stone-100 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg sm:text-xl font-medium text-[#0B0B0B]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              onClick={handleAddToCart}
              className="w-full py-2 px-2 rounded-lg bg-[#FAF7F2] hover:bg-stone-200/80 border border-stone-300/80 text-[#151515] text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3 text-[#C9A227]" />
              <span className="truncate">Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-2 px-2 rounded-lg bg-[#0B0B0B] hover:bg-[#58111A] text-white text-[11px] font-semibold tracking-wider uppercase transition-colors flex items-center justify-center shadow-xs cursor-pointer"
            >
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
