"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CartItemProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  variant?: string;
}

export function CartItem({ id, name, slug, price, originalPrice, image, quantity, variant }: CartItemProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 py-6 border-b border-slate-200 dark:border-slate-800 last:border-0">
      <Link href={`/products/${slug}`} className="relative h-24 w-24 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-md bg-slate-100 dark:bg-slate-900">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 96px, 128px"
        />
      </Link>
      
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div className="space-y-1">
            <Link href={`/products/${slug}`}>
              <h3 className="font-medium text-slate-900 dark:text-white hover:text-primary transition-colors line-clamp-2">
                {name}
              </h3>
            </Link>
            {variant && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Variant: {variant}</p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-semibold text-slate-900 dark:text-white">${price.toFixed(2)}</p>
            {originalPrice && (
              <p className="text-sm text-slate-500 line-through">${originalPrice.toFixed(2)}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex h-9 items-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950">
            <button className="flex h-full w-9 items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-colors">
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button className="flex h-full w-9 items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-primary">
              <Heart className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Save</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-rose-600">
              <Trash2 className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
