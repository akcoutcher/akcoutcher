import React, { useState, useEffect } from 'react';
import { ProductItem, ProductReview } from '../../types/product';
import {
  getProductBySlug,
  getRelatedProducts,
  getProductReviews,
  addProductReview,
} from '../../lib/productDb';
import { ProductCard } from '../../components/collections/ProductCard';
import { ProductBadgeTag } from '../../components/collections/ProductBadges';
import { useCouture } from '../../context/CoutureContext';
import { useToast } from '../../components/common/Toast';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Share2,
  Check,
  ChevronRight,
  Ruler,
  MessageSquare,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigate,
}) => {
  const {
    formatPrice,
    addToCart,
    productWishlist,
    toggleProductWishlist,
    setMeasurementModalOpen,
  } = useCouture();
  const { showToast } = useToast();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [related, setRelated] = useState<ProductItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'delivery' | 'reviews'>('details');

  // Review Form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const item = getProductBySlug(slug);
    if (item) {
      setProduct(item);
      setSelectedImage(item.thumbnail || item.images[0] || '');
      setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : '');
      setSelectedColor(item.colors && item.colors.length > 0 ? item.colors[0].name : '');
      setQuantity(1);

      // Load reviews & related products
      const revs = getProductReviews(item.id);
      setReviews(revs);
      const rel = getRelatedProducts(item, 4);
      setRelated(rel);

      // Dynamic SEO Title
      document.title = item.seoTitle || `${item.productName} | AK COUTURE`;
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="font-serif text-3xl text-stone-900">Creation Not Found</h2>
        <p className="text-xs text-stone-500 max-w-sm">
          The requested couture or beauty creation does not exist in our archive.
        </p>
        <button
          onClick={() => onNavigate('/collections')}
          className="px-6 py-2.5 rounded-lg bg-[#0B0B0B] text-white text-xs uppercase tracking-wider font-semibold"
        >
          Return to Collections
        </button>
      </div>
    );
  }

  const isWishlisted = productWishlist.includes(product.id);
  const isBeauty = ['LIPSTICKS', 'EYELINERS', 'MAKEUP & BEAUTY'].includes(product.category.toUpperCase());
  const isClothing = ['SUITS', 'LEHENGA', 'DRESSES', 'ETHNIC WEAR', 'WESTERN WEAR', 'CLOTHING', 'PARTY WEAR'].includes(product.category.toUpperCase());
  const isBag = ['HANDBAGS', 'BAGS & ACCESSORIES'].includes(product.category.toUpperCase());

  const handleAddToCart = () => {
    addToCart(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
    });
    showToast(`Added ${product.productName} to your shopping bag.`);
  };

  const handleBuyNow = () => {
    addToCart(product, {
      size: selectedSize || undefined,
      color: selectedColor || undefined,
      quantity,
    });
    onNavigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.productName} - AK COUTURE`,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      showToast('Please provide your name and review remarks.');
      return;
    }
    setSubmittingReview(true);
    try {
      const created = addProductReview({
        productId: product.id,
        authorName: reviewAuthor.trim(),
        title: reviewTitle.trim() || 'Exceptional Quality',
        comment: reviewComment.trim(),
        rating: reviewRating,
        verifiedPurchase: true,
      });
      setReviews([created, ...reviews]);
      setReviewAuthor('');
      setReviewTitle('');
      setReviewComment('');
      showToast('Thank you! Your feedback has been verified.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="w-full bg-[#F8F7F4] text-[#151515] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 font-light overflow-x-auto whitespace-nowrap">
          <button onClick={() => onNavigate('/')} className="hover:text-stone-900">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <button onClick={() => onNavigate('/collections')} className="hover:text-stone-900">
            Collections
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-600 uppercase font-mono text-[11px]">
            {product.category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-medium truncate max-w-xs">
            {product.productName}
          </span>
        </nav>

        {/* Demo Notice Banner */}
        {product.isDemo && (
          <div className="px-4 py-2 rounded-lg bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs text-amber-900 font-light">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <strong>AK COUTURE Studio Demo Creation:</strong> This piece represents an authentic preview of our luxury offerings. Ready for immediate custom order &amp; sizing.
            </span>
            <span className="text-[10px] uppercase font-mono text-amber-800">SKU: {product.sku}</span>
          </div>
        )}

        {/* Main Product Showcase: Left Gallery, Right Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* -------------------------------------------------- */}
          {/* GALLERY COLUMN (7 Cols on large screen)            */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails list */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[580px] shrink-0 pb-2 sm:pb-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-white border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#C9A227] shadow-md scale-102'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.productName} angle ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="flex-1 relative aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-md">
              <img
                src={selectedImage || product.thumbnail}
                alt={product.productName}
                className="w-full h-full object-cover object-center transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <ProductBadgeTag badge={product.badge} />
                {product.discount && product.discount > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-[#0B0B0B] text-[#E6C65C] border border-[#C9A227]/40 rounded shadow-sm">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Heart Icon Floating Button */}
              <button
                onClick={() => toggleProductWishlist(product.id)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md z-10 cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#58111A] text-white'
                    : 'bg-white/90 text-stone-700 hover:text-[#58111A] hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current text-[#C9A227]' : ''}`} />
              </button>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* PRODUCT INFORMATION (5 Cols on large screen)       */}
          {/* -------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2 border-b border-stone-200 pb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.25em] text-[#C9A227] font-mono font-semibold">
                  {product.category}
                </span>
                <span className="text-stone-400 font-mono text-[11px]">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal leading-tight">
                {product.productName}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex text-[#C9A227]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#C9A227] text-[#C9A227]'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-sm font-semibold text-stone-900">
                  {product.rating}
                </span>
                <span className="text-xs text-stone-500">
                  ({reviews.length || product.reviewCount} customer reviews)
                </span>
              </div>

              {/* Pricing Box */}
              <div className="pt-3 flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-medium text-[#0B0B0B]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discount && product.discount > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-mono font-semibold bg-[#0B0B0B] text-[#E6C65C] border border-[#C9A227]/40 rounded">
                    Save {formatPrice(product.originalPrice! - product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase font-semibold tracking-wider text-stone-900">
                    {isBeauty ? 'Shade / Color:' : 'Color Palette:'}
                  </span>
                  <span className="font-medium text-[#C9A227]">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c.name)}
                      className={`group relative p-1 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === c.name ? 'border-[#C9A227] scale-110' : 'border-transparent'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="block w-7 h-7 rounded-full shadow-inner border border-black/15"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clothing Sizes (Only for clothing, never for beauty products) */}
            {isClothing && product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase font-semibold tracking-wider text-stone-900">
                    Select Size:
                  </span>
                  <button
                    onClick={() => setMeasurementModalOpen(true)}
                    className="text-[#58111A] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Bespoke Measurement Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-2 text-xs rounded-lg border font-mono font-medium transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-[#0B0B0B] text-white border-[#0B0B0B] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Beauty Specific Highlight Card */}
            {isBeauty && product.beautyAttributes && (
              <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-2xs space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Finish</span>
                    <span className="font-medium text-stone-900">{product.beautyAttributes.finish}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Net Quantity</span>
                    <span className="font-medium text-stone-900">{product.beautyAttributes.netQuantity}</span>
                  </div>
                </div>
                {product.beautyAttributes.suitableFor && (
                  <div className="pt-1 border-t border-stone-100">
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Suitable For</span>
                    <span className="text-stone-700">{product.beautyAttributes.suitableFor}</span>
                  </div>
                )}
              </div>
            )}

            {/* Bag Specific Highlight Card */}
            {isBag && product.bagAttributes && (
              <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-2xs space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Dimensions</span>
                    <span className="font-medium text-stone-900">{product.bagAttributes.dimensions}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-mono">Closure</span>
                    <span className="font-medium text-stone-900">{product.bagAttributes.closure}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs uppercase font-semibold tracking-wider text-stone-900">
                Quantity:
              </span>
              <div className="inline-flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-semibold cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-mono font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-semibold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart, Buy Now, Share */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-stone-200 border border-stone-300 text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C9A227]" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl bg-[#0B0B0B] hover:bg-[#58111A] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => toggleProductWishlist(product.id)}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#58111A] cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#C9A227] text-[#C9A227]' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#58111A] cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Creation</span>
                </button>
              </div>
            </div>

            {/* Atelier Trust Badges */}
            <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-stone-600">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200/80">
                <Truck className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>Free Express Shipping &gt; ₹2,000</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200/80">
                <RotateCcw className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>7-Day Return / Exchange Guarantee</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-stone-200/80">
                <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>Certified Haute Couture Authenticity</span>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------- */}
        {/* TABS: DETAILS, SPECIFICATIONS, DELIVERY, REVIEWS   */}
        {/* -------------------------------------------------- */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-10 shadow-sm space-y-8">
          <div className="flex items-center gap-6 border-b border-stone-200 overflow-x-auto">
            {[
              { id: 'details', label: 'Product Description' },
              { id: 'specifications', label: 'Specifications & Care' },
              { id: 'delivery', label: 'Delivery & Returns' },
              { id: 'reviews', label: `Patron Reviews (${reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors relative cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[#58111A]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#C9A227]" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Product Description */}
          {activeTab === 'details' && (
            <div className="max-w-3xl space-y-4 text-stone-700 leading-relaxed font-light text-sm sm:text-base">
              <p>{product.description}</p>
              {isBeauty && product.beautyAttributes?.howToUse && (
                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-serif text-lg font-medium text-stone-900 mb-1">
                    How To Apply
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600">
                    {product.beautyAttributes.howToUse}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specifications Table */}
          {activeTab === 'specifications' && (
            <div className="max-w-3xl space-y-4">
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden text-xs">
                {product.material && (
                  <div className="grid grid-cols-3 p-3 bg-stone-50/50">
                    <span className="font-semibold text-stone-600">Material</span>
                    <span className="col-span-2 text-stone-900">{product.material}</span>
                  </div>
                )}
                {product.fabric && (
                  <div className="grid grid-cols-3 p-3 bg-white">
                    <span className="font-semibold text-stone-600">Fabric Composition</span>
                    <span className="col-span-2 text-stone-900">{product.fabric}</span>
                  </div>
                )}
                {product.occasion && (
                  <div className="grid grid-cols-3 p-3 bg-stone-50/50">
                    <span className="font-semibold text-stone-600">Recommended Occasion</span>
                    <span className="col-span-2 text-stone-900">{product.occasion}</span>
                  </div>
                )}

                {/* Clothing Specs */}
                {isClothing && product.clothingAttributes && (
                  <>
                    {product.clothingAttributes.fit && (
                      <div className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-semibold text-stone-600">Fit &amp; Silhouette</span>
                        <span className="col-span-2 text-stone-900">{product.clothingAttributes.fit}</span>
                      </div>
                    )}
                    {product.clothingAttributes.pattern && (
                      <div className="grid grid-cols-3 p-3 bg-stone-50/50">
                        <span className="font-semibold text-stone-600">Pattern &amp; Needlework</span>
                        <span className="col-span-2 text-stone-900">{product.clothingAttributes.pattern}</span>
                      </div>
                    )}
                    {product.clothingAttributes.careInstructions && (
                      <div className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-semibold text-stone-600">Garment Care</span>
                        <span className="col-span-2 text-stone-900">{product.clothingAttributes.careInstructions}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Beauty Specs */}
                {isBeauty && product.beautyAttributes && (
                  <>
                    {product.beautyAttributes.shade && (
                      <div className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-semibold text-stone-600">Shade Designation</span>
                        <span className="col-span-2 text-stone-900">{product.beautyAttributes.shade}</span>
                      </div>
                    )}
                    {product.beautyAttributes.finish && (
                      <div className="grid grid-cols-3 p-3 bg-stone-50/50">
                        <span className="font-semibold text-stone-600">Finish</span>
                        <span className="col-span-2 text-stone-900">{product.beautyAttributes.finish}</span>
                      </div>
                    )}
                    {product.beautyAttributes.netQuantity && (
                      <div className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-semibold text-stone-600">Net Quantity</span>
                        <span className="col-span-2 text-stone-900">{product.beautyAttributes.netQuantity}</span>
                      </div>
                    )}
                    {product.beautyAttributes.ingredients && (
                      <div className="grid grid-cols-3 p-3 bg-stone-50/50">
                        <span className="font-semibold text-stone-600">Key Ingredients</span>
                        <span className="col-span-2 text-stone-900">{product.beautyAttributes.ingredients}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Bag Specs */}
                {isBag && product.bagAttributes && (
                  <>
                    {product.bagAttributes.dimensions && (
                      <div className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-semibold text-stone-600">Dimensions</span>
                        <span className="col-span-2 text-stone-900">{product.bagAttributes.dimensions}</span>
                      </div>
                    )}
                    {product.bagAttributes.compartments && (
                      <div className="grid grid-cols-3 p-3 bg-stone-50/50">
                        <span className="font-semibold text-stone-600">Compartments</span>
                        <span className="col-span-2 text-stone-900">{product.bagAttributes.compartments}</span>
                      </div>
                    )}
                    {product.bagAttributes.strapType && (
                      <div className="grid grid-cols-3 p-3 bg-white">
                        <span className="font-semibold text-stone-600">Strap &amp; Handle</span>
                        <span className="col-span-2 text-stone-900">{product.bagAttributes.strapType}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Delivery & Returns */}
          {activeTab === 'delivery' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="font-serif text-base font-medium text-stone-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C9A227]" />
                  <span>Shipping &amp; Courier Logistics</span>
                </h4>
                <p>{product.deliveryInfo || 'Standard express delivery within 2-4 business days across India. International orders dispatched via DHL/FedEx.'}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="font-serif text-base font-medium text-stone-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#C9A227]" />
                  <span>Exchange &amp; Returns Policy</span>
                </h4>
                <p>{product.returnInfo || 'Complimentary return and size exchange within 7 days of package delivery. Product must remain in its original box with seals and tags intact.'}</p>
              </div>
            </div>
          )}

          {/* Tab 4: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-stone-500">No patron reviews yet. Be the first to share your experience!</p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-5 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex text-[#C9A227]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'fill-[#C9A227] text-[#C9A227]'
                                    : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-serif text-sm font-medium text-stone-900">
                            {rev.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {rev.comment}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-stone-500">
                        <span className="font-semibold text-stone-800">{rev.authorName}</span>
                        {rev.verifiedPurchase && (
                          <span className="flex items-center gap-0.5 text-emerald-700 font-medium">
                            <Check className="w-3 h-3" /> Verified Patron
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <div className="p-6 rounded-xl bg-[#FAF7F2] border border-[#EADDD0] max-w-xl space-y-4">
                <h4 className="font-serif text-lg font-medium text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C9A227]" />
                  <span>Write an Atelier Review</span>
                </h4>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase font-mono tracking-wider text-stone-700 block mb-1">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1 text-[#C9A227]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'fill-[#C9A227] text-[#C9A227]'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] uppercase font-mono tracking-wider text-stone-700 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        placeholder="Simran Kaur"
                        className="w-full px-3 py-2 text-xs rounded border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase font-mono tracking-wider text-stone-700 block mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Exquisite craftsmanship"
                        className="w-full px-3 py-2 text-xs rounded border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] uppercase font-mono tracking-wider text-stone-700 block mb-1">
                      Your Feedback *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share details on texture, fit, pigmentation, or packaging..."
                      className="w-full px-3 py-2 text-xs rounded border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2.5 rounded-lg bg-[#0B0B0B] hover:bg-[#58111A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* -------------------------------------------------- */}
        {/* RELATED CREATIONS SECTION                          */}
        {/* -------------------------------------------------- */}
        {related.length > 0 && (
          <section className="pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-mono font-semibold">
                  Complementary
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-stone-900">
                  You May Also Admire
                </h3>
              </div>
              <button
                onClick={() => onNavigate('/collections')}
                className="text-xs uppercase tracking-wider font-semibold text-[#58111A] hover:underline"
              >
                View Full Archive
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((prod) => (
                <ProductCard key={prod.id} product={prod} onNavigate={onNavigate} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
