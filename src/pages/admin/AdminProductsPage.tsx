import React, { useState, useEffect } from 'react';
import {
  ProductItem,
  ALL_PRODUCT_CATEGORIES,
  ProductBadge,
} from '../../types/product';
import {
  getStoredProducts,
  saveProduct,
  deleteProduct,
} from '../../lib/productDb';
import { ProductBadgeTag } from '../../components/collections/ProductBadges';
import { useToast } from '../../components/common/Toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  Sliders,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<ProductItem>>({});
  const [sizesInput, setSizesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');

  const loadProducts = () => {
    setProducts(getStoredProducts());
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAddModal = () => {
    const empty: Partial<ProductItem> = {
      productName: '',
      slug: '',
      category: 'CLOTHING',
      subcategory: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      description: '',
      shortDescription: '',
      sku: `AKC-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: 10,
      stockStatus: 'in_stock',
      thumbnail: '/src/assets/images/hero_ak_couture_1790594513046.jpg',
      images: ['/src/assets/images/hero_ak_couture_1790594513046.jpg'],
      badge: 'NEW',
      isNew: true,
      isBestseller: false,
      isTrending: false,
      isFeatured: true,
      isActive: true,
      rating: 5.0,
      reviewCount: 0,
    };
    setEditingProduct(null);
    setFormData(empty);
    setSizesInput('XS, S, M, L, XL, XXL, Custom Measurement');
    setTagsInput('luxury, couture, ak couture');
    setImagesInput('/src/assets/images/hero_ak_couture_1790594513046.jpg');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setSizesInput(p.sizes ? p.sizes.join(', ') : '');
    setTagsInput(p.tags ? p.tags.join(', ') : '');
    setImagesInput(p.images ? p.images.join('\n') : p.thumbnail);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      deleteProduct(id);
      loadProducts();
      showToast(`Product "${name}" deleted.`);
    }
  };

  const handleToggleActive = (p: ProductItem) => {
    saveProduct({ id: p.id, isActive: !p.isActive });
    loadProducts();
    showToast(`${p.productName} is now ${!p.isActive ? 'Active' : 'Disabled'}.`);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || !formData.price) {
      showToast('Please provide product name and price.');
      return;
    }

    const sizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const images = imagesInput
      .split('\n')
      .map((img) => img.trim())
      .filter(Boolean);

    const discountCalc =
      formData.originalPrice && formData.price && formData.originalPrice > formData.price
        ? Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)
        : formData.discount || 0;

    const payload: Partial<ProductItem> = {
      ...formData,
      sizes: sizes.length > 0 ? sizes : undefined,
      tags,
      images: images.length > 0 ? images : [formData.thumbnail || '/src/assets/images/hero_ak_couture_1790594513046.jpg'],
      thumbnail: images[0] || formData.thumbnail || '/src/assets/images/hero_ak_couture_1790594513046.jpg',
      discount: discountCalc,
    };

    saveProduct(payload);
    loadProducts();
    setIsModalOpen(false);
    showToast(editingProduct ? 'Product updated successfully.' : 'Product created successfully.');
  };

  // Filter products for admin view
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'ALL' || p.category.toUpperCase() === categoryFilter.toUpperCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl text-stone-100 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[#C9A227]" />
            <span>Store Products &amp; Collections</span>
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage fashion ensembles, beauty cosmetics, handbags and luxury lifestyle items for AK COUTURE.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-lg bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#0B0B0B]" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          />
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-700 text-stone-200 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
          >
            <option value="ALL">All Categories</option>
            {ALL_PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-stone-800/80 border border-stone-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-300 divide-y divide-stone-700/60">
            <thead className="bg-stone-900/80 text-[10px] uppercase font-mono text-stone-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Discount</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-700/40">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-750/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail}
                          alt={p.productName}
                          className="w-12 h-14 rounded object-cover bg-stone-900 border border-stone-700 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-medium text-stone-100">{p.productName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</div>
                          {p.isDemo && (
                            <span className="text-[9px] font-mono text-amber-400">Demo Item</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-300">{p.category}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-100">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <div className="text-[10px] text-stone-400 line-through">
                          ₹{p.originalPrice.toLocaleString('en-IN')} ({p.discount}% off)
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                          p.stockStatus === 'in_stock'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <ProductBadgeTag badge={p.badge} />
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(p)}
                        className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          p.isActive
                            ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                            : 'bg-stone-700 text-stone-400'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded text-stone-400 hover:text-white hover:bg-stone-700 transition-colors"
                          title="Edit creation"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.productName)}
                          className="p-1.5 rounded text-stone-400 hover:text-red-400 hover:bg-stone-700 transition-colors"
                          title="Delete creation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* ADD / EDIT PRODUCT MODAL FORM                      */}
      {/* -------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="font-serif text-xl text-stone-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C9A227]" />
                <span>{editingProduct ? 'Edit Product Creation' : 'Add New Product Creation'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.productName || ''}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g. Royal Zardozi Embroidered Punjabi Suit"
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category || 'CLOTHING'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  >
                    {ALL_PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Selling Price (INR ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Original Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || 0}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Stock Inventory Count
                  </label>
                  <input
                    type="number"
                    value={formData.stock || 10}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Product Badge
                  </label>
                  <select
                    value={formData.badge || 'NEW'}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value as ProductBadge })}
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  >
                    <option value="NEW">NEW</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="TRENDING">TRENDING</option>
                    <option value="LIMITED EDITION">LIMITED EDITION</option>
                    <option value="PREMIUM">PREMIUM</option>
                    <option value="SALE">SALE</option>
                    <option value="COMING SOON">COMING SOON</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                  Short Editorial Tagline / Teaser
                </label>
                <input
                  type="text"
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence luxury synopsis..."
                  className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                  Full Atelier Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive craftsmanship story..."
                  className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                  Product Image URLs (One URL per line)
                </label>
                <textarea
                  rows={2}
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  placeholder="/src/assets/images/your-product.jpg"
                  className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Available Sizes (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="XS, S, M, L, XL, XXL, Custom Measurement"
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                  <span className="text-[10px] text-stone-500">Leave blank for beauty products</span>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-mono text-stone-400 mb-1">
                    Search Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="bridal, velvet, red, matte, pure silk"
                    className="w-full px-3 py-2 rounded bg-stone-800 border border-stone-700 text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#C9A227]"
                  />
                </div>
              </div>

              {/* Checkboxes for Highlights */}
              <div className="pt-2 border-t border-stone-800 flex flex-wrap gap-5 text-xs text-stone-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="accent-[#C9A227]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller || false}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="accent-[#C9A227]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isTrending || false}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="accent-[#C9A227]"
                  />
                  <span>Mark as Trending</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive !== false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="accent-[#C9A227]"
                  />
                  <span>Active &amp; Published in Store</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider shadow-md"
                >
                  Save Product Creation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
