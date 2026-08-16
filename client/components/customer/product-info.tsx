"use client";

import { useState } from "react";
import { Star, Minus, Plus, Heart, Share2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewsCount: number;
    description: string;
    inStock: boolean;
    sku: string;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          {product.inStock ? (
            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
              In Stock
            </Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
          <span className="text-xs text-slate-500">SKU: {product.sku}</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {product.name}
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <a href="#reviews" className="text-sm text-primary hover:underline">
            {product.reviewsCount} Reviews
          </a>
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-end gap-3">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
          ${product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <span className="text-lg text-slate-500 line-through mb-1">
            ${product.originalPrice.toFixed(2)}
          </span>
        )}
        {product.originalPrice && (
          <Badge className="bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100 mb-2 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800">
            Save ${ (product.originalPrice - product.price).toFixed(2) }
          </Badge>
        )}
      </div>

      <Separator />

      {/* Description */}
      <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-400">
        <p>{product.description}</p>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex h-12 w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-2 sm:w-32 shrink-0">
          <Button variant="ghost" size="icon" onClick={decrement} className="h-8 w-8" disabled={!product.inStock}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-base font-medium">{quantity}</span>
          <Button variant="ghost" size="icon" onClick={increment} className="h-8 w-8" disabled={!product.inStock}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <Button size="lg" className="h-12 flex-1 text-base font-semibold" disabled={!product.inStock}>
          Add to Cart - ${(product.price * quantity).toFixed(2)}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-12 w-12 shrink-0 border-slate-200 dark:border-slate-800"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart className={cn("h-5 w-5 transition-colors", isWishlisted ? "fill-rose-500 text-rose-500" : "")} />
          <span className="sr-only">Wishlist</span>
        </Button>
      </div>

      {/* Additional Guarantees */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Free Delivery</span>
            <span className="text-xs text-slate-500">2-3 business days</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">1 Year Warranty</span>
            <span className="text-xs text-slate-500">100% genuine product</span>
          </div>
        </div>
      </div>
    </div>
  );
}
