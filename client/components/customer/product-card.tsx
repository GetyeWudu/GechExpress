"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useState, useEffect } from "react";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isNew?: boolean;
  discountPercentage?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  rating,
  reviewsCount,
  image,
  isNew,
  discountPercentage,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = mounted ? hasItem(id) : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id,
      name,
      price,
      image: image || "/placeholder.svg",
      slug,
      quantity: 1
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      id,
      name,
      slug,
      price,
      originalPrice,
      rating,
      reviewsCount,
      image: image || "/placeholder.svg",
      isNew,
      discountPercentage
    });
  };

  return (
    <div className="group relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      {/* Badges */}
      <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-1.5 sm:gap-2">
        {isNew && (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-transparent rounded-full px-2 py-0 sm:py-0.5 sm:px-3 shadow-sm text-[10px] sm:text-xs font-semibold tracking-wide">
            New
          </Badge>
        )}
        {discountPercentage && (
          <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-transparent rounded-full px-2 py-0 sm:py-0.5 sm:px-3 shadow-sm text-[10px] sm:text-xs font-bold tracking-wide">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleWishlist}
        className={`absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 dark:bg-slate-900/80 ${
          isWishlisted 
            ? "text-rose-600 dark:text-rose-500 opacity-100" 
            : "text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-500 opacity-100"
        }`}
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
        <span className="sr-only">Add to wishlist</span>
      </Button>

      {/* Image */}
      <Link href={`/products/${slug}`} className="relative h-[130px] sm:h-[180px] w-full overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-900">
        <Image
          src={image || "/placeholder.svg"}
          alt={name || "Product image"}
          fill
          className="object-cover transition-transform duration-300 active:scale-105 md:group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-1.5 sm:p-2 bg-white dark:bg-slate-950 rounded-b-xl border-t border-slate-100 dark:border-slate-800">
        <div className="mb-1 flex items-center gap-1 font-serif">
          <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 dark:text-slate-300">
            {(rating || 0).toFixed(1)}
          </span>
          <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            ({reviewsCount || 0})
          </span>
        </div>

        <Link href={`/products/${slug}`} className="flex-1 mt-0.5">
          <h3 className="line-clamp-2 text-[11px] sm:text-[13px] font-bold text-slate-900 hover:text-primary dark:text-slate-100 dark:hover:text-primary font-serif leading-snug">
            {name}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-end justify-between gap-1.5 font-serif">
          <div className="flex flex-col">
            <span className="text-[12px] sm:text-[14px] font-black text-slate-900 dark:text-white tracking-tight">
              ETB {(price || 0).toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-[9px] sm:text-[10px] text-slate-400 line-through dark:text-slate-500 font-semibold mt-0.5">
                ETB {(originalPrice || 0).toFixed(2)}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            className="h-5 sm:h-6 rounded-full px-1.5 sm:px-2 text-[8px] sm:text-[9px] shadow-sm bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 transition-colors font-bold tracking-wide shrink-0"
          >
            <ShoppingCart className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
