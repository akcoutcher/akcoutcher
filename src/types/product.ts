export type ProductCategory =
  | 'NEW ARRIVALS'
  | 'LIPSTICKS'
  | 'EYELINERS'
  | 'MAKEUP & BEAUTY'
  | 'HANDBAGS'
  | 'BAGS & ACCESSORIES'
  | 'SUITS'
  | 'LEHENGA'
  | 'DRESSES'
  | 'ETHNIC WEAR'
  | 'WESTERN WEAR'
  | 'CLOTHING'
  | 'PARTY WEAR'
  | 'WEDDING COLLECTION'
  | 'FESTIVE COLLECTION'
  | 'FASHION ACCESSORIES';

export const ALL_PRODUCT_CATEGORIES: ProductCategory[] = [
  'NEW ARRIVALS',
  'LIPSTICKS',
  'EYELINERS',
  'MAKEUP & BEAUTY',
  'HANDBAGS',
  'BAGS & ACCESSORIES',
  'SUITS',
  'LEHENGA',
  'DRESSES',
  'ETHNIC WEAR',
  'WESTERN WEAR',
  'CLOTHING',
  'PARTY WEAR',
  'WEDDING COLLECTION',
  'FESTIVE COLLECTION',
  'FASHION ACCESSORIES',
];

export type ProductBadge =
  | 'NEW'
  | 'BESTSELLER'
  | 'TRENDING'
  | 'LIMITED EDITION'
  | 'SALE'
  | 'PREMIUM'
  | 'COMING SOON';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  image?: string;
  sku?: string;
}

export interface BeautyAttributes {
  shade?: string;
  finish?: string;
  color?: string;
  netQuantity?: string;
  ingredients?: string;
  suitableFor?: string;
  howToUse?: string;
}

export interface ClothingAttributes {
  fabric?: string;
  color?: string;
  size?: string[];
  fit?: string;
  pattern?: string;
  occasion?: string;
  careInstructions?: string;
  productType?: string;
}

export interface BagAttributes {
  material?: string;
  color?: string;
  dimensions?: string;
  compartments?: string;
  closure?: string;
  strapType?: string;
  occasion?: string;
}

export interface ProductItem {
  id: string;
  productName: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  sku: string;
  stock: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order';
  sizes?: string[];
  colors?: ProductColor[];
  variants?: ProductVariant[];
  material?: string;
  fabric?: string;
  occasion?: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  badge?: ProductBadge;
  isNew?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isActive: boolean;
  sortOrder?: number;
  
  // Category specific details
  beautyAttributes?: BeautyAttributes;
  clothingAttributes?: ClothingAttributes;
  bagAttributes?: BagAttributes;

  deliveryInfo?: string;
  returnInfo?: string;
  isDemo?: boolean;

  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  sku: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface CustomerOrderInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  notes?: string;
}

export interface ProductOrder {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customer: CustomerOrderInfo;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'verified';
  orderStatus: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface ProductFilterOptions {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  availability?: string;
  minRating?: number;
  discountOnly?: boolean;
  occasion?: string;
  fabric?: string;
  material?: string;
  sortBy?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'bestselling' | 'top_rated';
  searchQuery?: string;
}
