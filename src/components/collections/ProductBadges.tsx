import React from 'react';
import { ProductBadge } from '../../types/product';
import { Sparkles, Flame, Crown, Clock, Tag } from 'lucide-react';

interface ProductBadgeProps {
  badge?: ProductBadge;
  discount?: number;
  className?: string;
}

export const ProductBadgeTag: React.FC<ProductBadgeProps> = ({ badge, discount, className = '' }) => {
  if (discount && discount > 0 && (!badge || badge === 'SALE')) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-[#0B0B0B] text-[#C9A227] border border-[#C9A227]/40 shadow-sm ${className}`}
      >
        <Tag className="w-2.5 h-2.5 text-[#C9A227]" />
        <span>{discount}% OFF</span>
      </span>
    );
  }

  if (!badge) return null;

  switch (badge) {
    case 'NEW':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-[#0B0B0B] text-white border border-stone-800 shadow-sm ${className}`}
        >
          <Sparkles className="w-2.5 h-2.5 text-[#C9A227]" />
          <span>NEW</span>
        </span>
      );
    case 'BESTSELLER':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-[#C9A227] text-[#0B0B0B] shadow-sm ${className}`}
        >
          <Crown className="w-2.5 h-2.5 fill-[#0B0B0B]" />
          <span>BESTSELLER</span>
        </span>
      );
    case 'TRENDING':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-[#151515] text-[#FAF7F2] border border-[#C9A227]/30 shadow-sm ${className}`}
        >
          <Flame className="w-2.5 h-2.5 text-[#C9A227] fill-[#C9A227]" />
          <span>TRENDING</span>
        </span>
      );
    case 'LIMITED EDITION':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-[#FAF7F2] text-[#0B0B0B] border border-[#C9A227] shadow-sm ${className}`}
        >
          <Sparkles className="w-2.5 h-2.5 text-[#C9A227]" />
          <span>LIMITED EDITION</span>
        </span>
      );
    case 'PREMIUM':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-[#0B0B0B] text-[#E6C65C] border border-[#C9A227]/50 shadow-sm ${className}`}
        >
          <Crown className="w-2.5 h-2.5 text-[#C9A227]" />
          <span>PREMIUM</span>
        </span>
      );
    case 'SALE':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-[#58111A] text-white shadow-sm ${className}`}
        >
          <Tag className="w-2.5 h-2.5 text-[#C9A227]" />
          <span>SALE</span>
        </span>
      );
    case 'COMING SOON':
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded bg-stone-200 text-stone-700 shadow-sm ${className}`}
        >
          <Clock className="w-2.5 h-2.5" />
          <span>COMING SOON</span>
        </span>
      );
    default:
      return null;
  }
};
