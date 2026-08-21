"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

export interface CartItemProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variant?: string;
  onUpdateQuantity?: (quantity: number) => void;
  onRemove?: () => void;
}

export function CartItem({ id, name, slug, price, originalPrice, image, quantity, variant, onUpdateQuantity, onRemove }: CartItemProps) {
  const mockColors = ["Black", "White", "Silver", "Gold", "Navy", "Red"];
  const mockSizes = ["Small", "Medium", "Large", "XL", "One Size"];

  // Mock category
  const category = "home-kitchen";

  // Mock stock logic based on id length to generate a stable pseudo-random stock number
  const stock = id.length * 20 + (price % 5 > 2 ? 0 : 50);
  const inStock = stock > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-6 p-5 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">

      {/* Product Image */}
      <Link href={`/products/${slug}`} className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="120px"
        />
      </Link>

      {/* Product Info & Controls */}
      <div className="flex flex-col flex-1">
        {/* Top row: Title and Delete */}
        <div className="flex justify-between items-start gap-4 mb-1">
          <Link href={`/products/${slug}`}>
            <h3 className="font-bold text-slate-900 dark:text-white hover:text-primary transition-colors text-[15px] line-clamp-2 font-serif">
              {name}
            </h3>
          </Link>
          <button
            onClick={() => onRemove && onRemove()}
            className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors shrink-0"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </button>
        </div>

        {/* Category */}
        <p className="text-[12px] text-slate-400 dark:text-slate-500 mb-2 font-medium">{category}</p>

        {/* Stock Badge */}
        <div className="mb-4">
          <span className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-sm ${inStock ? 'bg-[#b88c4d] text-white' : 'bg-red-500 text-white'}`}>
            {inStock ? `${stock} In Stock` : "Out of stock"}
          </span>
        </div>

        {/* Selected Variant text (from image) */}
        <p className="text-[13px] text-slate-600 dark:text-slate-400 mb-3 font-medium">Selected: Any color</p>

        {/* Dropdowns */}
        <div className="flex flex-col gap-3 mb-6 max-w-[200px]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`color-${id}`} className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">Color:</label>
            <div className="relative">
              <select
                id={`color-${id}`}
                defaultValue={variant || mockColors[0]}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-primary text-[13px] w-full cursor-pointer appearance-none shadow-sm"
              >
                <option value="">Select color</option>
                {mockColors.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor={`size-${id}`} className="text-slate-500 dark:text-slate-400 text-[13px] font-medium">Size:</label>
            <div className="relative">
              <select
                id={`size-${id}`}
                defaultValue=""
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 text-slate-700 dark:text-slate-300 outline-none focus:ring-1 focus:ring-primary text-[13px] w-full cursor-pointer appearance-none shadow-sm"
              >
                <option value="">Select size</option>
                {mockSizes.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Price and Quantity */}
        <div className="flex justify-between items-end mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-slate-900 dark:text-white text-[13px]">ETB {price.toFixed(0)}</span>
            <span className="text-slate-400 text-[11px] font-medium">x {quantity}</span>
            <span className="font-bold text-blue-700 dark:text-blue-500 text-[13px] ml-1">ETB {(price * quantity).toFixed(0)}</span>
          </div>

          <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-950 shadow-sm h-8">
            <button
              disabled={!inStock}
              onClick={() => onUpdateQuantity && onUpdateQuantity(quantity - 1)}
              className="flex h-full w-8 items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-[13px] font-medium border-x border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white h-full flex items-center justify-center">{quantity}</span>
            <button
              disabled={!inStock}
              onClick={() => onUpdateQuantity && onUpdateQuantity(quantity + 1)}
              className="flex h-full w-8 items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-40 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
