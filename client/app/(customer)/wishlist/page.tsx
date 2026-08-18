"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/customer/product-card";
import { Heart, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { buttonVariants, Button } from "@/components/ui/button";
import { useWishlistStore } from "@/stores/wishlist-store";

export default function WishlistPage() {
  const [mounted, setMounted] = useState(false);
  const { items, toggleItem } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const hasItems = items.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[70vh]">
      <div className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl flex items-center gap-3">
          <Heart className="h-8 w-8 text-rose-500 fill-rose-500" />
          My Wishlist
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Save items you love and buy them later.
        </p>
      </div>

      {!hasItems ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 mb-6 text-slate-300">
            <Heart className="h-10 w-10" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
            You haven't saved any items yet. When you find something you like, click the heart icon to save it for later.
          </p>
          <Link href="/products" className={buttonVariants()}>
            <Search className="mr-2 h-4 w-4" />
            Discover Products
          </Link>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {items.length} items saved
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items
              .filter(item => typeof item === 'object' && item !== null && item.id) // Filter legacy strings
              .map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard {...item} />
                <Button 
                  onClick={() => toggleItem(item)}
                  variant="secondary" 
                  size="sm" 
                  className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-slate-900 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-900/90 dark:text-white dark:hover:bg-rose-950 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-800 shadow-md"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
