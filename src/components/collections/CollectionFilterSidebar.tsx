import React from 'react';
import { ProductFilterOptions, ALL_PRODUCT_CATEGORIES } from '../../types/product';
import { X, RotateCcw, Check } from 'lucide-react';

interface CollectionFilterSidebarProps {
  filters: ProductFilterOptions;
  onChangeFilters: (filters: ProductFilterOptions) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalProductsCount: number;
}

const COMMON_COLORS = [
  { name: 'Red', hex: '#9E1A2B' },
  { name: 'Black', hex: '#0B0B0B' },
  { name: 'Gold', hex: '#C9A227' },
  { name: 'Green', hex: '#1C3A27' },
  { name: 'Peach', hex: '#F4C2A7' },
  { name: 'Taupe', hex: '#B8A693' },
  { name: 'Ivory', hex: '#FAF6EE' },
];

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom Measurement'];

const OCCASIONS = ['Weddings', 'Bridal', 'Festive', 'Party', 'Cocktail', 'Everyday Luxury'];

const FABRICS = ['Raw Silk', 'Chanderi Silk', 'Micro-Velvet', 'Mulberry Silk', 'Organza'];

export const CollectionFilterSidebar: React.FC<CollectionFilterSidebarProps> = ({
  filters,
  onChangeFilters,
  isOpenMobile,
  onCloseMobile,
  totalProductsCount,
}) => {
  const handleCategorySelect = (cat: string) => {
    onChangeFilters({
      ...filters,
      category: filters.category === cat ? 'ALL' : cat,
    });
  };

  const handlePriceRange = (min?: number, max?: number) => {
    onChangeFilters({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleResetFilters = () => {
    onChangeFilters({
      category: 'ALL',
      sortBy: 'featured',
      searchQuery: '',
    });
  };

  const activeFiltersCount =
    (filters.category && filters.category !== 'ALL' ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.color ? 1 : 0) +
    (filters.size ? 1 : 0) +
    (filters.availability ? 1 : 0) +
    (filters.discountOnly ? 1 : 0) +
    (filters.occasion ? 1 : 0) +
    (filters.fabric ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <span className="font-serif text-lg font-medium text-stone-900">Refine Selection</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#58111A] text-white text-[10px] font-mono font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-stone-500 hover:text-[#58111A] flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">
          Categories
        </h4>
        <div className="flex flex-col space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => handleCategorySelect('ALL')}
            className={`text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
              !filters.category || filters.category === 'ALL'
                ? 'bg-[#0B0B0B] text-white font-medium'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>All Collections</span>
            {!filters.category || filters.category === 'ALL' ? <Check className="w-3 h-3 text-[#C9A227]" /> : null}
          </button>
          {ALL_PRODUCT_CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-left text-xs py-1.5 px-2.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B0B0B] text-white font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3 h-3 text-[#C9A227]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">
          Price Range
        </h4>
        <div className="space-y-1.5 text-xs text-stone-600">
          {[
            { label: 'All Prices', min: undefined, max: undefined },
            { label: 'Under ₹2,000 (Beauty & Accessories)', min: 0, max: 2000 },
            { label: '₹2,000 - ₹15,000 (Bags & Ready-to-Wear)', min: 2000, max: 15000 },
            { label: '₹15,000 - ₹50,000 (Party & Suits)', min: 15000, max: 50000 },
            { label: '₹50,000+ (Haute Couture & Bridal)', min: 50000, max: undefined },
          ].map((tier, idx) => {
            const isSelected =
              filters.minPrice === tier.min && filters.maxPrice === tier.max;
            return (
              <label
                key={idx}
                className="flex items-center gap-2 cursor-pointer hover:text-stone-900"
              >
                <input
                  type="radio"
                  name="priceTier"
                  checked={isSelected}
                  onChange={() => handlePriceRange(tier.min, tier.max)}
                  className="accent-[#0B0B0B] text-xs"
                />
                <span>{tier.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">
            Color Palette
          </h4>
          {filters.color && (
            <button
              onClick={() => onChangeFilters({ ...filters, color: undefined })}
              className="text-[10px] text-stone-400 hover:text-stone-700 underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {COMMON_COLORS.map((col) => {
            const isSelected = filters.color === col.name;
            return (
              <button
                key={col.name}
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    color: isSelected ? undefined : col.name,
                  })
                }
                title={col.name}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs transition-all ${
                  isSelected
                    ? 'border-[#0B0B0B] bg-[#0B0B0B] text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/10"
                  style={{ backgroundColor: col.hex }}
                />
                <span className="text-[11px]">{col.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clothing Sizes */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">
            Size
          </h4>
          {filters.size && (
            <button
              onClick={() => onChangeFilters({ ...filters, size: undefined })}
              className="text-[10px] text-stone-400 hover:text-stone-700 underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SIZES.map((sz) => {
            const isSelected = filters.size === sz;
            return (
              <button
                key={sz}
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    size: isSelected ? undefined : sz,
                  })
                }
                className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                  isSelected
                    ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                    : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Special Highlights: Discount & Stock */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">
          Preferences
        </h4>
        <div className="space-y-1.5 text-xs text-stone-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.discountOnly || false}
              onChange={(e) =>
                onChangeFilters({ ...filters, discountOnly: e.target.checked })
              }
              className="accent-[#0B0B0B]"
            />
            <span>Special Promotional Offers Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.availability === 'in_stock'}
              onChange={(e) =>
                onChangeFilters({
                  ...filters,
                  availability: e.target.checked ? 'in_stock' : undefined,
                })
              }
              className="accent-[#0B0B0B]"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Occasion */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">
            Occasion
          </h4>
          {filters.occasion && (
            <button
              onClick={() => onChangeFilters({ ...filters, occasion: undefined })}
              className="text-[10px] text-stone-400 hover:text-stone-700 underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {OCCASIONS.map((occ) => {
            const isSelected = filters.occasion === occ;
            return (
              <button
                key={occ}
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    occasion: isSelected ? undefined : occ,
                  })
                }
                className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${
                  isSelected
                    ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {occ}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase font-mono font-semibold tracking-wider text-stone-900">
            Fabric / Material
          </h4>
          {filters.fabric && (
            <button
              onClick={() => onChangeFilters({ ...filters, fabric: undefined })}
              className="text-[10px] text-stone-400 hover:text-stone-700 underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FABRICS.map((fab) => {
            const isSelected = filters.fabric === fab;
            return (
              <button
                key={fab}
                onClick={() =>
                  onChangeFilters({
                    ...filters,
                    fabric: isSelected ? undefined : fab,
                  })
                }
                className={`px-2.5 py-1 text-[11px] rounded-full border transition-colors ${
                  isSelected
                    ? 'bg-[#0B0B0B] text-white border-[#0B0B0B]'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {fab}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs h-fit sticky top-24">
        {filterContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                  <h3 className="font-serif text-xl text-stone-900">Filter Collections</h3>
                  <button
                    onClick={onCloseMobile}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {filterContent}
              </div>

              <div className="pt-6 border-t border-stone-200 mt-6">
                <button
                  onClick={onCloseMobile}
                  className="w-full py-3 rounded-xl bg-[#0B0B0B] text-white text-xs font-semibold uppercase tracking-wider shadow-md"
                >
                  Show Results ({totalProductsCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
