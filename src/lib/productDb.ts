import {
  ProductItem,
  ProductFilterOptions,
  ProductReview,
  ProductOrder,
  CartItem,
  CustomerOrderInfo,
} from '../types/product';

const PRODUCTS_STORAGE_KEY = 'ak_couture_products_v1';
const REVIEWS_STORAGE_KEY = 'ak_couture_reviews_v1';
const ORDERS_STORAGE_KEY = 'ak_couture_orders_v1';

export const INITIAL_DEMO_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-lipstick-crimson',
    productName: 'Rouge Velours Matte Lipstick',
    slug: 'rouge-velours-matte-lipstick',
    category: 'LIPSTICKS',
    subcategory: 'Lip Color',
    shortDescription: 'Velvety matte red lipstick infused with organic jojoba and vitamin E for 12-hour comfortable wear.',
    description: 'An iconic haute couture red lipstick crafted with intense micro-pigments that deliver pure, luminous velvet color in a single sweep. The weightless formulation cushions lips with botanical squalane and organic oils, preventing dryness while delivering a soft-focus matte perfection.',
    price: 1850,
    originalPrice: 2450,
    discount: 24,
    currency: 'INR',
    images: [
      '/src/assets/images/lipstick_red_luxury_1790595441734.jpg',
      '/src/assets/images/lipstick_red_luxury_1790595441734.jpg',
    ],
    thumbnail: '/src/assets/images/lipstick_red_luxury_1790595441734.jpg',
    sku: 'AKC-LIP-01',
    stock: 45,
    stockStatus: 'in_stock',
    colors: [
      { name: 'Royal Crimson', hex: '#9E1A2B' },
      { name: 'Sultry Ruby', hex: '#7A0E1C' },
      { name: 'Scarlet Gold', hex: '#B52B35' },
    ],
    rating: 4.9,
    reviewCount: 38,
    tags: ['lipstick', 'matte', 'red', 'beauty', 'luxury', 'cruelty-free'],
    badge: 'BESTSELLER',
    isNew: false,
    isBestseller: true,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 1,
    isDemo: true,
    beautyAttributes: {
      shade: 'Royal Crimson (#01)',
      finish: 'Hydrating Velvet Matte',
      color: 'Intense Warm Ruby Red',
      netQuantity: '3.8g / 0.13 oz',
      ingredients: 'Castor Seed Oil, Jojoba Esters, Candelilla Wax, Tocopherol (Vitamin E), Shea Butter, Botanical Squalane.',
      suitableFor: 'All skin undertones & sensitive lips',
      howToUse: 'Glide directly across the contours of the lips starting from cupid’s bow outward. Blot lightly with tissue for soft matte finish.',
    },
    deliveryInfo: 'Express delivery in 2-4 business days across India. Luxury gift packaging included.',
    returnInfo: 'Hygiene sealed product. 7-day replacement for damaged transit items.',
    seoTitle: 'Rouge Velours Luxury Matte Red Lipstick | AK COUTURE Beauty',
    seoDescription: 'Discover AK COUTURE Rouge Velours Matte Lipstick. Intense velvet crimson finish with 12-hour hydration.',
    seoKeywords: 'matte lipstick, red lipstick, luxury lipstick, AK COUTURE beauty, royal crimson lipstick',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'prod-eyeliner-noir',
    productName: 'Precision Calligraphy Liquid Eyeliner',
    slug: 'precision-calligraphy-liquid-eyeliner',
    category: 'EYELINERS',
    subcategory: 'Eye Makeup',
    shortDescription: 'Intense jet black 24-hour waterproof liquid eyeliner with ultra-fine flexible Japanese felt tip.',
    description: 'Master the sharpest couture feline flick with AK COUTURE’s Precision Calligraphy Eyeliner. Formulated with saturated carbon black pigments that dry down in seconds to a waterproof, smudge-proof, and sweat-resistant satin black film that lasts effortlessly all day and night.',
    price: 1250,
    originalPrice: 1650,
    discount: 24,
    currency: 'INR',
    images: [
      '/src/assets/images/eyeliner_black_pen_1790595468979.jpg',
      '/src/assets/images/eyeliner_black_pen_1790595468979.jpg',
    ],
    thumbnail: '/src/assets/images/eyeliner_black_pen_1790595468979.jpg',
    sku: 'AKC-EYE-02',
    stock: 60,
    stockStatus: 'in_stock',
    colors: [
      { name: 'Obsidian Jet Black', hex: '#0B0B0B' },
    ],
    rating: 4.8,
    reviewCount: 42,
    tags: ['eyeliner', 'liquid', 'waterproof', 'black', 'beauty', 'makeup'],
    badge: 'NEW',
    isNew: true,
    isBestseller: false,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 2,
    isDemo: true,
    beautyAttributes: {
      shade: 'Obsidian Jet Black',
      finish: 'Satin Matte',
      color: 'Carbon Black',
      netQuantity: '1.2 ml',
      ingredients: 'Aqua, Acrylates Copolymer, Carbon Black (CI 77266), Glycerin, Phenoxyethanol, Chamomile Extract.',
      suitableFor: 'Contact lens wearers and sensitive eyes, ophthalmologist tested',
      howToUse: 'Shake well before use. Draw fine baseline starting from inner corner toward wing tip.',
    },
    deliveryInfo: 'Ships within 24 hours. Delivered in 2-4 business days.',
    returnInfo: 'Sealed product guarantee. Free exchange if received defective.',
    seoTitle: 'Precision Waterproof Liquid Eyeliner Pen | AK COUTURE',
    seoDescription: 'Shop AK COUTURE Precision Calligraphy Liquid Eyeliner. Ultra-fine tip, 24-hour waterproof carbon black pigment.',
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-02T10:00:00.000Z',
  },
  {
    id: 'prod-handbag-atelier-tote',
    productName: 'Signature Structured Atelier Tote',
    slug: 'signature-structured-atelier-tote',
    category: 'HANDBAGS',
    subcategory: 'Luxury Bags',
    shortDescription: 'Structured artisan top-handle tote in premium grained vegan calfskin with 24k gold-plated lock clasp.',
    description: 'An architectural silhouette designed to elevate both daywear and evening ensembles. Handcrafted from durable grained Italian microfiber leather, lined in rich microsuede, featuring protective gold feet, interior zipper divider, and a detachable shoulder strap for versatile styling.',
    price: 14500,
    originalPrice: 18900,
    discount: 23,
    currency: 'INR',
    images: [
      '/src/assets/images/handbag_luxury_bag_1790595482929.jpg',
      '/src/assets/images/handbag_luxury_bag_1790595482929.jpg',
    ],
    thumbnail: '/src/assets/images/handbag_luxury_bag_1790595482929.jpg',
    sku: 'AKC-BAG-01',
    stock: 15,
    stockStatus: 'in_stock',
    colors: [
      { name: 'Warm Taupe', hex: '#B8A693' },
      { name: 'Onyx Black', hex: '#151515' },
      { name: 'Ivory Cream', hex: '#FAF6EE' },
    ],
    material: 'Microfiber Vegan Calfskin & 24K Gold Clasp',
    occasion: 'Everyday Luxury, Business, Special Occasions',
    rating: 4.9,
    reviewCount: 29,
    tags: ['handbag', 'tote', 'luxury bag', 'gold hardware', 'leather'],
    badge: 'PREMIUM',
    isNew: false,
    isBestseller: true,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 3,
    isDemo: true,
    bagAttributes: {
      material: 'Italian textured vegan calf leather, scratch-resistant',
      color: 'Warm Taupe Beige with Gold Lock',
      dimensions: '32 cm (W) x 25 cm (H) x 14 cm (D)',
      compartments: '2 main compartments, 1 central zippered pocket, 2 card slots',
      closure: 'Magnetic turn-lock gold clasp',
      strapType: 'Dual tubular top handles + detachable adjustable leather strap (52 cm drop)',
      occasion: 'Executive meetings, luxury travel, festive celebrations',
    },
    deliveryInfo: 'Includes signature AK COUTURE dustbag and luxury gift box. Free insured domestic express courier.',
    returnInfo: '10-day hassle-free returns with original security tags and dustbag intact.',
    seoTitle: 'Signature Structured Designer Handbag | AK COUTURE',
    seoDescription: 'Handcrafted luxury designer handbag with 24k gold turn-lock clasp. High-end modern elegance by AK COUTURE.',
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-03T10:00:00.000Z',
  },
  {
    id: 'prod-punjabi-suit-zardozi',
    productName: 'Royal Zardozi Embroidered Punjabi Suit',
    slug: 'royal-zardozi-embroidered-punjabi-suit',
    category: 'SUITS',
    subcategory: 'Bridal & Festive Suites',
    shortDescription: 'Pure raw silk kurta and Patiala salwar paired with pure organza dupatta featuring hand-cut dabka and gotapatti.',
    description: 'An heirloom Punjabi ensemble honoring centuries of regal craft. Created from lustrous handwoven raw silk in deep royal maroon, meticulously embroidered by master karigars with gold tilla, zardozi work, French knots, and delicate pearls. Comes with bespoke tailoring to patron measurements.',
    price: 38000,
    originalPrice: 45000,
    discount: 16,
    currency: 'INR',
    images: [
      '/src/assets/images/bridal_ak_girl_1790594555283.jpg',
      '/src/assets/images/punjabi_bridal_suit_1790501214454.jpg',
      '/src/assets/images/punjabi_embroidery_craft_1790501202133.jpg',
    ],
    thumbnail: '/src/assets/images/bridal_ak_girl_1790594555283.jpg',
    sku: 'AKC-SUT-01',
    stock: 8,
    stockStatus: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom Measurement'],
    colors: [
      { name: 'Royal Maroon & Gold', hex: '#58111A' },
      { name: 'Emerald Forest', hex: '#1C3A27' },
      { name: 'Plum Violet', hex: '#4A154B' },
    ],
    fabric: 'Pure Raw Silk Kurta, Crepe Salwar, Organza Dupatta',
    material: 'Raw Silk, Zardozi, Tilla Embroidery',
    occasion: 'Weddings, Sangeet, Karwa Chauth, Festivals',
    rating: 5.0,
    reviewCount: 34,
    tags: ['suit', 'punjabi suit', 'zardozi', 'patiala', 'bridal', 'ethnic wear'],
    badge: 'LIMITED EDITION',
    isNew: false,
    isBestseller: true,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 4,
    isDemo: true,
    clothingAttributes: {
      fabric: '100% Pure Raw Silk with Soft Cotton Lining, Tissue Organza Dupatta',
      color: 'Imperial Maroon with Antique Gold Threadwork',
      fit: 'Classic Tailored Kurta with Flared Patiala Pleats',
      pattern: 'Floral Jaal & Geometric Border Zardozi',
      occasion: 'Bridal Festivities, Anand Karaj, Grand Receptions',
      careInstructions: 'Professional Dry Clean Only. Store in breathable muslin bag.',
      productType: '3-Piece Stitched or Unstitched Custom Suit',
    },
    deliveryInfo: 'Hand-tailored upon order confirmation. Dispatched within 7-12 days with tracking.',
    returnInfo: 'Custom fitted pieces undergo fitting consultation. Exchange permitted on size alterations.',
    seoTitle: 'Royal Zardozi Hand-Embroidered Punjabi Suit | AK COUTURE',
    seoDescription: 'Handcrafted luxury Punjabi suit in pure raw silk with authentic gold zardozi and Patiala salwar by AK COUTURE.',
    createdAt: '2026-03-04T10:00:00.000Z',
    updatedAt: '2026-03-04T10:00:00.000Z',
  },
  {
    id: 'prod-bridal-lehenga-heritage',
    productName: 'The Noor Mahal Heritage Bridal Lehenga',
    slug: 'the-noor-mahal-heritage-bridal-lehenga',
    category: 'LEHENGA',
    subcategory: 'Couture Bridal',
    shortDescription: 'Regal micro-velvet bridal lehenga with 16 kalis, hand-embroidered in antique zardozi, dabka, and Swarovski crystals.',
    description: 'The epitome of Punjabi couture grandeur. The Noor Mahal bridal lehenga boasts 16 architectural flared kalis on lush deep crimson velvet. Every petal is brought to life by generational artisans through 280 hours of hand-embroidery. Includes double dupatta (velvet shoulder drape and gossamer organza head veil).',
    price: 125000,
    originalPrice: 155000,
    discount: 19,
    currency: 'INR',
    images: [
      '/src/assets/images/hero_ak_couture_1790594513046.jpg',
      '/src/assets/images/bridal_ak_girl_1790594555283.jpg',
      '/src/assets/images/punjabi_couture_hero_1790501175200.jpg',
    ],
    thumbnail: '/src/assets/images/hero_ak_couture_1790594513046.jpg',
    sku: 'AKC-LHG-01',
    stock: 4,
    stockStatus: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Measurement'],
    colors: [
      { name: 'Heritage Crimson Red', hex: '#7A131A' },
      { name: 'Maharani Rose Gold', hex: '#B87333' },
    ],
    fabric: 'Micro-Velvet Lehenga, Silk Choli, Pure Silk Organza Dupattas',
    material: 'Velvet, Zardozi, Pearls, Dabka',
    occasion: 'Wedding Day, Grand Bridal Ceremony',
    rating: 5.0,
    reviewCount: 19,
    tags: ['lehenga', 'bridal lehenga', 'wedding', 'couture', 'luxury', 'velvet'],
    badge: 'PREMIUM',
    isNew: true,
    isBestseller: true,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 5,
    isDemo: true,
    clothingAttributes: {
      fabric: 'Imperial Micro-Velvet Skirt with Can-Can Stiffening, Pure Silk Blouse',
      color: 'Heritage Crimson Velvet with 22k Antique Gold Wire',
      fit: 'High-waisted 5.5-meter umbrella flair with custom latkan tassels',
      pattern: 'Mughal Architecture Arches with Royal Peacock Medallions',
      occasion: 'Bridal Vows & Wedding Ceremonies',
      careInstructions: 'Specialist Dry Clean Only. Avoid direct perfume spray.',
      productType: 'Bridal Ensemble (Skirt, Choli, 2 Dupattas, Matching Belt)',
    },
    deliveryInfo: 'Includes personal concierge sizing session. Delivered in velvet cedar heirloom trunk.',
    returnInfo: 'Made-to-order couture. Bespoke alteration support guaranteed.',
    seoTitle: 'The Noor Mahal Heritage Bridal Lehenga | AK COUTURE',
    seoDescription: 'Grand royal bridal lehenga with 280 hours of hand zardozi and dabka embroidery by AK COUTURE.',
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-05T10:00:00.000Z',
  },
  {
    id: 'prod-party-wear-dress-flared',
    productName: 'Aura Flared Silk Satin Evening Dress',
    slug: 'aura-flared-silk-satin-evening-dress',
    category: 'PARTY WEAR',
    subcategory: 'Cocktail & Evening',
    shortDescription: 'Couture flared evening gown in heavyweight mulberry silk satin with rose gold micro-beaded waist accent.',
    description: 'Designed for gala evenings and cocktail receptions, the Aura gown pairs effortless draping with modern architectural structure. The flowing bias-cut skirt ripples gracefully with movement, while the corseted interior provides sculpted support and comfortable elegance.',
    price: 22500,
    originalPrice: 28000,
    discount: 20,
    currency: 'INR',
    images: [
      '/src/assets/images/evening_gown_luxury_1790595520144.jpg',
      '/src/assets/images/evening_gown_luxury_1790595520144.jpg',
    ],
    thumbnail: '/src/assets/images/evening_gown_luxury_1790595520144.jpg',
    sku: 'AKC-DRS-01',
    stock: 12,
    stockStatus: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Measurement'],
    colors: [
      { name: 'Emerald Jewel', hex: '#0B3B2B' },
      { name: 'Champagne Blush', hex: '#E8D3C4' },
      { name: 'Midnight Black', hex: '#111111' },
    ],
    fabric: 'Heavyweight Mulberry Silk Satin',
    material: 'Pure Silk, Micro-bead Embellishment',
    occasion: 'Cocktail Gala, Red Carpet, Reception, High-End Soirée',
    rating: 4.8,
    reviewCount: 22,
    tags: ['party wear', 'evening dress', 'gown', 'silk satin', 'western wear'],
    badge: 'TRENDING',
    isNew: false,
    isBestseller: false,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 6,
    isDemo: true,
    clothingAttributes: {
      fabric: '100% Mulberry Silk Satin (80 GSM)',
      color: 'Luminous Emerald Jewel',
      fit: 'Fitted Bodice with Dramatic Flared A-Line Sweep',
      pattern: 'Solid Lustrous Sheen with Hand-Draped Pleating',
      occasion: 'Reception Dinners, Awards, Formal Evenings',
      careInstructions: 'Dry Clean Only. Steam on lowest heat.',
      productType: 'Floor Length Evening Gown with Concealed Zip',
    },
    deliveryInfo: 'Ships within 3-5 business days.',
    returnInfo: '10-day return policy in unworn condition with tags.',
    seoTitle: 'Aura Flared Silk Satin Evening Gown | AK COUTURE',
    seoDescription: 'Luxury silk satin evening gown with corseted waist by AK COUTURE.',
    createdAt: '2026-03-06T10:00:00.000Z',
    updatedAt: '2026-03-06T10:00:00.000Z',
  },
  {
    id: 'prod-kurta-set-chanderi',
    productName: 'Gulab Chanderi Silk Kurta & Palazzo Set',
    slug: 'gulab-chanderi-silk-kurta-palazzo-set',
    category: 'ETHNIC WEAR',
    subcategory: 'Day Festive Suites',
    shortDescription: 'Handwoven Chanderi silk kurta with delicate pearl gotapatti neckline, matching flared palazzo and organza dupatta.',
    description: 'Breathe breezy elegance into festive mornings. Spun from featherlight Chanderi silk with a natural golden sheen, this 3-piece silhouette is accented with subtle pearl work around the keyhole neckline, scalloped gota hem, and wide-leg palazzos tailored for all-day comfort.',
    price: 18500,
    originalPrice: 24000,
    discount: 23,
    currency: 'INR',
    images: [
      '/src/assets/images/kurta_set_luxury_1790595502886.jpg',
      '/src/assets/images/kurta_set_luxury_1790595502886.jpg',
    ],
    thumbnail: '/src/assets/images/kurta_set_luxury_1790595502886.jpg',
    sku: 'AKC-KRT-01',
    stock: 20,
    stockStatus: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    colors: [
      { name: 'Blush Peach & Gold', hex: '#F4C2A7' },
      { name: 'Pista Mint', hex: '#C2D8C2' },
      { name: 'Ivory Marigold', hex: '#FFF5E1' },
    ],
    fabric: 'Pure Handloom Chanderi Silk & Mulmul Cotton',
    material: 'Chanderi Silk, Gotapatti, Pearls',
    occasion: 'Mehendi, Roka, Festive Pooja, High Tea',
    rating: 4.9,
    reviewCount: 27,
    tags: ['kurta set', 'chanderi', 'ethnic wear', 'festive', 'palazzo'],
    badge: 'NEW',
    isNew: true,
    isBestseller: false,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 7,
    isDemo: true,
    clothingAttributes: {
      fabric: 'Handwoven Chanderi Silk with 100% Breathable Mulmul Lining',
      color: 'Pastel Blush Peach with Warm Gilt',
      fit: 'Relaxed Straight Kurta with Flared Palazzo Pants',
      pattern: 'Floral Booti Weave with Scalloped Gota Trim',
      occasion: 'Festive Daywear, Intimate Family Gatherings',
      careInstructions: 'Gentle Dry Clean Only.',
      productType: '3-Piece Kurta, Trouser & Dupatta Set',
    },
    deliveryInfo: 'Ships within 2-4 business days across India.',
    returnInfo: '7-day easy size exchange support.',
    seoTitle: 'Gulab Chanderi Silk Kurta Set with Dupatta | AK COUTURE',
    seoDescription: 'Pastel Chanderi silk kurta set with gota patti embroidery by AK COUTURE.',
    createdAt: '2026-03-07T10:00:00.000Z',
    updatedAt: '2026-03-07T10:00:00.000Z',
  },
  {
    id: 'prod-western-gown-emerald',
    productName: 'Couture Drape Emerald Gown',
    slug: 'couture-drape-emerald-gown',
    category: 'WESTERN WEAR',
    subcategory: 'Gowns & Dresses',
    shortDescription: 'Sculpted asymmetric shoulder gown in liquid satin with high-slit column skirt and pleated waist sash.',
    description: 'A striking fusion of modern minimalism and couture drama. Sculpted from lustrous liquid satin that hugs the silhouette before cascading into a floor-sweeping side-pleat train. Featuring a built-in boned corset bodice and subtle gold hardware at the single shoulder.',
    price: 29000,
    originalPrice: 36000,
    discount: 19,
    currency: 'INR',
    images: [
      '/src/assets/images/evening_gown_luxury_1790595520144.jpg',
      '/src/assets/images/evening_gown_luxury_1790595520144.jpg',
    ],
    thumbnail: '/src/assets/images/evening_gown_luxury_1790595520144.jpg',
    sku: 'AKC-WST-01',
    stock: 10,
    stockStatus: 'in_stock',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'Custom Measurement'],
    colors: [
      { name: 'Emerald Velvetine', hex: '#0B3B2B' },
      { name: 'Midnight Navy', hex: '#0D1B2A' },
    ],
    fabric: 'Heavy Liquid Crepe Satin',
    material: 'Poly-Silk Blend, Gold Buckle',
    occasion: 'Black Tie, Red Carpet, Formal Soirée',
    rating: 4.8,
    reviewCount: 16,
    tags: ['western wear', 'gown', 'dresses', 'emerald gown', 'couture'],
    badge: 'PREMIUM',
    isNew: false,
    isBestseller: true,
    isTrending: false,
    isFeatured: true,
    isActive: true,
    sortOrder: 8,
    isDemo: true,
    clothingAttributes: {
      fabric: 'Liquid Crepe Silk-Touch Satin with Stretch Crepe Lining',
      color: 'Rich Emerald Green',
      fit: 'Hourglass Column Fit with Thigh-High Vent Slit',
      pattern: 'Solid Sculptural Drapery',
      occasion: 'Black Tie Balls, Receptions, International Galas',
      careInstructions: 'Dry Clean Recommended. Do not machine wash.',
      productType: 'One-Shoulder Formal Gown',
    },
    deliveryInfo: 'Includes garment bag and wooden hanger. Dispatched in 4 business days.',
    returnInfo: '10-day return policy with original designer tags.',
    seoTitle: 'Couture Drape Emerald Western Gown | AK COUTURE',
    seoDescription: 'High-fashion emerald liquid satin evening gown with asymmetric shoulder by AK COUTURE.',
    createdAt: '2026-03-08T10:00:00.000Z',
    updatedAt: '2026-03-08T10:00:00.000Z',
  },
  {
    id: 'prod-kundan-polki-choker',
    productName: 'Chandrika Kundan Polki Choker Set',
    slug: 'chandrika-kundan-polki-choker-set',
    category: 'FASHION ACCESSORIES',
    subcategory: 'Heritage Jewellery',
    shortDescription: 'Handcrafted 22k gold plated Kundan polki choker with freshwater seed pearls and matching jhumki earrings.',
    description: 'Channel imperial heritage with the Chandrika choker suite. Intricately set with uncut simulated polki stones, meenakari reverse enameling, and clusters of natural freshwater seed pearls. Fully adjustable with handcrafted gold zari dori cord.',
    price: 12900,
    originalPrice: 16500,
    discount: 22,
    currency: 'INR',
    images: [
      '/src/assets/images/jewellery_gold_luxury_1790595544614.jpg',
      '/src/assets/images/jewellery_gold_luxury_1790595544614.jpg',
    ],
    thumbnail: '/src/assets/images/jewellery_gold_luxury_1790595544614.jpg',
    sku: 'AKC-JWL-01',
    stock: 14,
    stockStatus: 'in_stock',
    colors: [
      { name: 'Polki Gold & Pearl', hex: '#C9A227' },
      { name: 'Emerald Polki Drop', hex: '#1C3A27' },
    ],
    material: 'Brass base, 22K Gold Micro-Plating, Kundan Glass, Freshwater Pearls',
    occasion: 'Bridal Jewellery, Festive Gala, Reception',
    rating: 4.9,
    reviewCount: 31,
    tags: ['jewellery', 'accessories', 'kundan', 'choker', 'pearls', 'fashion accessories'],
    badge: 'BESTSELLER',
    isNew: false,
    isBestseller: true,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 9,
    isDemo: true,
    deliveryInfo: 'Packed in velvet-lined keepsake jewelry chest. Insured shipping.',
    returnInfo: '7-day replacement for transit defects.',
    seoTitle: 'Chandrika Kundan Polki Choker Necklace Set | AK COUTURE',
    seoDescription: 'Handcrafted 22k gold plated Kundan polki choker with freshwater pearls by AK COUTURE.',
    createdAt: '2026-03-09T10:00:00.000Z',
    updatedAt: '2026-03-09T10:00:00.000Z',
  },
  {
    id: 'prod-evening-minaudiere-clutch',
    productName: 'Nocturne Gilt Minaudière Clutch',
    slug: 'nocturne-gilt-minaudiere-clutch',
    category: 'BAGS & ACCESSORIES',
    subcategory: 'Evening Clutches',
    shortDescription: 'Sculpted metallic gold cage clutch featuring mother-of-pearl inlay and detachable snake chain.',
    description: 'An objet d’art for unforgettable evenings. The Nocturne minaudière is handcrafted in high-shine gold brass framing shimmering natural mother-of-pearl tile inlays. Roomy enough for your smartphone, lipstick, keys, and cards, with an optional sleek snake chain.',
    price: 8900,
    originalPrice: 11500,
    discount: 23,
    currency: 'INR',
    images: [
      '/src/assets/images/handbag_luxury_bag_1790595482929.jpg',
      '/src/assets/images/handbag_luxury_bag_1790595482929.jpg',
    ],
    thumbnail: '/src/assets/images/handbag_luxury_bag_1790595482929.jpg',
    sku: 'AKC-CLT-01',
    stock: 18,
    stockStatus: 'in_stock',
    colors: [
      { name: 'Gilt Gold & Pearl', hex: '#E6C65C' },
    ],
    material: 'Solid Brass with 24k Gold Dip & Natural Shell',
    occasion: 'Weddings, Cocktail Galas, Black Tie Affairs',
    rating: 4.8,
    reviewCount: 15,
    tags: ['bags', 'clutch', 'evening clutch', 'minaudiere', 'gold'],
    badge: 'TRENDING',
    isNew: false,
    isBestseller: false,
    isTrending: true,
    isFeatured: true,
    isActive: true,
    sortOrder: 10,
    isDemo: true,
    bagAttributes: {
      material: 'Brass frame, 24K gold coating, authentic mother of pearl',
      color: 'Luminous Gold & Pearl',
      dimensions: '20 cm (L) x 12 cm (H) x 5 cm (D)',
      compartments: 'Velvet-lined single compartment with card holder',
      closure: 'Bejeweled crystal clasp lock',
      strapType: 'Detachable 120 cm gold snake chain',
      occasion: 'Receptions, Galas, Bridal trousseau',
    },
    deliveryInfo: 'Gift packaged with signature velvet pouch.',
    returnInfo: '7-day returns on unworn items.',
    seoTitle: 'Nocturne Gold Minaudière Evening Clutch | AK COUTURE',
    seoDescription: 'Luxury mother-of-pearl gold clutch with detachable chain by AK COUTURE.',
    createdAt: '2026-03-10T10:00:00.000Z',
    updatedAt: '2026-03-10T10:00:00.000Z',
  },
];

export const INITIAL_DEMO_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-lipstick-crimson',
    authorName: 'Harleen Dhillon',
    rating: 5,
    title: 'The most comfortable luxury matte red!',
    comment: 'The pigmentation is astounding. It did not bleed or dry out my lips through a full 6-hour wedding reception. The packaging feels like heavy gold jewelry.',
    verifiedPurchase: true,
    createdAt: '2026-03-12T14:30:00.000Z',
  },
  {
    id: 'rev-2',
    productId: 'prod-lipstick-crimson',
    authorName: 'Priya Sharma',
    rating: 5,
    title: 'Flawless shade on Indian skin tones',
    comment: 'Royal Crimson is exactly what I was searching for. Not too orange, not too dark—just pure regal elegance. AK COUTURE hit perfection with this.',
    verifiedPurchase: true,
    createdAt: '2026-03-15T09:15:00.000Z',
  },
  {
    id: 'rev-3',
    productId: 'prod-eyeliner-noir',
    authorName: 'Simran B.',
    rating: 5,
    title: 'Sharpest wing ever created',
    comment: 'The felt tip does not fray or drag. Super dark black line in one single pass and stays put without fading.',
    verifiedPurchase: true,
    createdAt: '2026-03-14T11:00:00.000Z',
  },
  {
    id: 'rev-4',
    productId: 'prod-handbag-atelier-tote',
    authorName: 'Navjot Sandhu',
    rating: 5,
    title: 'Looks and feels like a 50k luxury bag',
    comment: 'The quality of the vegan leather, the weight of the gold hardware, and the craftsmanship are immaculate. Received compliments everywhere!',
    verifiedPurchase: true,
    createdAt: '2026-03-18T16:20:00.000Z',
  },
  {
    id: 'rev-5',
    productId: 'prod-punjabi-suit-zardozi',
    authorName: 'Jaspreet Gill',
    rating: 5,
    title: 'Pure royal craftsmanship',
    comment: 'The zardozi work is authentic handcraft, not machine embroidery. The fit from the custom measurements team was spot on. Worth every single rupee!',
    verifiedPurchase: true,
    createdAt: '2026-03-20T18:45:00.000Z',
  },
  {
    id: 'rev-6',
    productId: 'prod-bridal-lehenga-heritage',
    authorName: 'Manpreet K.',
    rating: 5,
    title: 'A true heirloom masterpiece',
    comment: 'I wore this for my wedding and words cannot describe how breathtaking the skirt flair and velvet look in person and in photography. Thank you AK COUTURE!',
    verifiedPurchase: true,
    createdAt: '2026-03-22T20:10:00.000Z',
  },
];

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error for products:', err);
  }
}

// ----------------------------------------------------------------------
// PRODUCTS API
// ----------------------------------------------------------------------

export function getStoredProducts(): ProductItem[] {
  const loaded = readLocal<ProductItem[]>(PRODUCTS_STORAGE_KEY, []);
  if (!loaded || loaded.length === 0) {
    writeLocal(PRODUCTS_STORAGE_KEY, INITIAL_DEMO_PRODUCTS);
    return INITIAL_DEMO_PRODUCTS;
  }
  return loaded;
}

export function getAllProducts(filters?: ProductFilterOptions): ProductItem[] {
  let products = getStoredProducts().filter((p) => p.isActive);

  if (!filters) return products;

  // Search query
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.material && p.material.toLowerCase().includes(q))
    );
  }

  // Category filter
  if (filters.category && filters.category !== 'ALL') {
    if (filters.category === 'NEW ARRIVALS') {
      products = products.filter((p) => p.isNew || p.badge === 'NEW');
    } else if (filters.category === 'CLOTHING') {
      products = products.filter((p) =>
        ['SUITS', 'LEHENGA', 'DRESSES', 'ETHNIC WEAR', 'WESTERN WEAR', 'CLOTHING', 'PARTY WEAR'].includes(p.category.toUpperCase())
      );
    } else if (filters.category === 'BAGS & ACCESSORIES') {
      products = products.filter((p) =>
        ['HANDBAGS', 'BAGS & ACCESSORIES', 'FASHION ACCESSORIES'].includes(p.category.toUpperCase())
      );
    } else if (filters.category === 'MAKEUP & BEAUTY') {
      products = products.filter((p) =>
        ['LIPSTICKS', 'EYELINERS', 'MAKEUP & BEAUTY'].includes(p.category.toUpperCase())
      );
    } else if (filters.category === 'WEDDING COLLECTION') {
      products = products.filter(
        (p) =>
          p.category.toUpperCase().includes('WEDDING') ||
          p.category === 'LEHENGA' ||
          p.category === 'SUITS' ||
          p.tags.some((t) => t.toLowerCase().includes('bridal') || t.toLowerCase().includes('wedding'))
      );
    } else if (filters.category === 'FESTIVE COLLECTION') {
      products = products.filter(
        (p) =>
          p.category.toUpperCase().includes('FESTIVE') ||
          p.tags.some((t) => t.toLowerCase().includes('festive')) ||
          p.category === 'SUITS' ||
          p.category === 'ETHNIC WEAR'
      );
    } else {
      products = products.filter(
        (p) => p.category.toUpperCase() === filters.category?.toUpperCase()
      );
    }
  }

  // Price range
  if (filters.minPrice !== undefined) {
    products = products.filter((p) => p.price >= (filters.minPrice || 0));
  }
  if (filters.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= (filters.maxPrice || Infinity));
  }

  // Discount only
  if (filters.discountOnly) {
    products = products.filter((p) => (p.discount && p.discount > 0) || false);
  }

  // Rating
  if (filters.minRating) {
    products = products.filter((p) => p.rating >= (filters.minRating || 0));
  }

  // Availability
  if (filters.availability === 'in_stock') {
    products = products.filter((p) => p.stockStatus === 'in_stock');
  }

  // Size
  if (filters.size) {
    products = products.filter(
      (p) => p.sizes && p.sizes.includes(filters.size as string)
    );
  }

  // Color
  if (filters.color) {
    products = products.filter(
      (p) =>
        p.colors &&
        p.colors.some((c) => c.name.toLowerCase().includes(filters.color!.toLowerCase()))
    );
  }

  // Occasion
  if (filters.occasion) {
    products = products.filter(
      (p) => p.occasion && p.occasion.toLowerCase().includes(filters.occasion!.toLowerCase())
    );
  }

  // Fabric
  if (filters.fabric) {
    products = products.filter(
      (p) => p.fabric && p.fabric.toLowerCase().includes(filters.fabric!.toLowerCase())
    );
  }

  // Material
  if (filters.material) {
    products = products.filter(
      (p) => p.material && p.material.toLowerCase().includes(filters.material!.toLowerCase())
    );
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        products = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price_asc':
        products = [...products].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        products = [...products].sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        products = [...products].sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.reviewCount - a.reviewCount);
        break;
      case 'top_rated':
        products = [...products].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      case 'featured':
      default:
        products = [...products].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (a.sortOrder || 99) - (b.sortOrder || 99));
        break;
    }
  }

  return products;
}

export function getProductBySlug(slug: string): ProductItem | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getProductById(id: string): ProductItem | undefined {
  const products = getStoredProducts();
  return products.find((p) => p.id === id);
}

export function getNewArrivals(limit = 4): ProductItem[] {
  return getAllProducts({ sortBy: 'newest' })
    .filter((p) => p.isNew || p.badge === 'NEW')
    .slice(0, limit);
}

export function getBestsellers(limit = 4): ProductItem[] {
  return getAllProducts({ sortBy: 'bestselling' })
    .filter((p) => p.isBestseller || p.badge === 'BESTSELLER')
    .slice(0, limit);
}

export function getTrendingProducts(limit = 4): ProductItem[] {
  return getAllProducts({ sortBy: 'featured' })
    .filter((p) => p.isTrending || p.badge === 'TRENDING')
    .slice(0, limit);
}

export function getRelatedProducts(currentProduct: ProductItem, limit = 4): ProductItem[] {
  return getAllProducts()
    .filter((p) => p.id !== currentProduct.id && (p.category === currentProduct.category || p.tags.some((t) => currentProduct.tags.includes(t))))
    .slice(0, limit);
}

// ----------------------------------------------------------------------
// ADMIN PRODUCT MUTATIONS
// ----------------------------------------------------------------------

export function saveProduct(data: Partial<ProductItem>): ProductItem {
  const all = getStoredProducts();
  const now = new Date().toISOString();

  if (data.id) {
    const index = all.findIndex((p) => p.id === data.id);
    if (index !== -1) {
      const updated: ProductItem = {
        ...all[index],
        ...data,
        updatedAt: now,
      };
      all[index] = updated;
      writeLocal(PRODUCTS_STORAGE_KEY, all);
      return updated;
    }
  }

  // Create new product
  const id = `prod-${Date.now()}`;
  const slug = data.slug || data.productName?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `product-${id}`;
  const newProduct: ProductItem = {
    id,
    productName: data.productName || 'Untitled Product',
    slug,
    category: data.category || 'CLOTHING',
    subcategory: data.subcategory || '',
    description: data.description || '',
    shortDescription: data.shortDescription || '',
    price: data.price || 0,
    originalPrice: data.originalPrice,
    discount: data.discount || (data.originalPrice && data.price ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100) : 0),
    currency: 'INR',
    images: data.images && data.images.length > 0 ? data.images : [data.thumbnail || '/src/assets/images/hero_ak_couture_1790594513046.jpg'],
    thumbnail: data.thumbnail || (data.images && data.images[0]) || '/src/assets/images/hero_ak_couture_1790594513046.jpg',
    sku: data.sku || `AKC-${Date.now().toString().slice(-4)}`,
    stock: data.stock !== undefined ? data.stock : 10,
    stockStatus: data.stockStatus || 'in_stock',
    sizes: data.sizes || ['S', 'M', 'L', 'XL'],
    colors: data.colors || [],
    variants: data.variants || [],
    material: data.material || '',
    fabric: data.fabric || '',
    occasion: data.occasion || '',
    rating: data.rating || 5.0,
    reviewCount: data.reviewCount || 0,
    tags: data.tags || [],
    badge: data.badge || 'NEW',
    isNew: data.isNew ?? true,
    isBestseller: data.isBestseller ?? false,
    isTrending: data.isTrending ?? false,
    isFeatured: data.isFeatured ?? true,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder || all.length + 1,
    beautyAttributes: data.beautyAttributes,
    clothingAttributes: data.clothingAttributes,
    bagAttributes: data.bagAttributes,
    deliveryInfo: data.deliveryInfo || 'Standard express delivery in 3-5 days.',
    returnInfo: data.returnInfo || '7-day easy exchange/return policy.',
    createdAt: now,
    updatedAt: now,
  };

  const nextList = [newProduct, ...all];
  writeLocal(PRODUCTS_STORAGE_KEY, nextList);
  return newProduct;
}

export function deleteProduct(id: string): void {
  const all = getStoredProducts();
  const nextList = all.filter((p) => p.id !== id);
  writeLocal(PRODUCTS_STORAGE_KEY, nextList);
}

// ----------------------------------------------------------------------
// REVIEWS
// ----------------------------------------------------------------------

export function getProductReviews(productId: string): ProductReview[] {
  const all = readLocal<ProductReview[]>(REVIEWS_STORAGE_KEY, INITIAL_DEMO_REVIEWS);
  return all.filter((r) => r.productId === productId);
}

export function addProductReview(review: Omit<ProductReview, 'id' | 'createdAt'>): ProductReview {
  const all = readLocal<ProductReview[]>(REVIEWS_STORAGE_KEY, INITIAL_DEMO_REVIEWS);
  const newRev: ProductReview = {
    ...review,
    id: `rev-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newRev, ...all];
  writeLocal(REVIEWS_STORAGE_KEY, updated);

  // Recalculate average rating for product
  const productReviews = updated.filter((r) => r.productId === review.productId);
  const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  saveProduct({
    id: review.productId,
    rating: Number(avg.toFixed(1)),
    reviewCount: productReviews.length,
  });

  return newRev;
}

// ----------------------------------------------------------------------
// STORE ORDERS
// ----------------------------------------------------------------------

export function getProductOrders(): ProductOrder[] {
  return readLocal<ProductOrder[]>(ORDERS_STORAGE_KEY, []);
}

export function createProductOrder(data: {
  items: CartItem[];
  customer: CustomerOrderInfo;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  shippingCost?: number;
  discountAmount?: number;
}): ProductOrder {
  const orders = getProductOrders();
  const subtotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = data.shippingCost !== undefined ? data.shippingCost : (subtotal > 2000 ? 0 : 150);
  const discount = data.discountAmount || 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const newOrder: ProductOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: `AKC-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    items: data.items,
    subtotal,
    shipping,
    discount,
    total,
    customer: data.customer,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentMethod === 'cod' ? 'pending' : 'paid',
    orderStatus: 'new',
    createdAt: new Date().toISOString(),
  };

  writeLocal(ORDERS_STORAGE_KEY, [newOrder, ...orders]);
  return newOrder;
}
