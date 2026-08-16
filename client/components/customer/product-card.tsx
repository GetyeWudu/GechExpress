import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="group relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      {/* Badges */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {isNew && (
          <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-transparent">
            New
          </Badge>
        )}
        {discountPercentage && (
          <Badge className="bg-rose-600 hover:bg-rose-700 text-white border-transparent">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-white/80 text-slate-600 backdrop-blur-sm hover:bg-white hover:text-rose-600 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Heart className="h-4 w-4" />
        <span className="sr-only">Add to wishlist</span>
      </Button>

      {/* Image */}
      <Link href={`/products/${slug}`} className="relative aspect-square overflow-hidden rounded-t-lg bg-slate-100 dark:bg-slate-900">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-500">
            ({reviewsCount})
          </span>
        </div>

        <Link href={`/products/${slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-medium text-slate-900 hover:text-primary dark:text-slate-100 dark:hover:text-primary">
            {name}
          </h3>
        </Link>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-xs text-slate-500 line-through dark:text-slate-500">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button size="sm" className="h-8 rounded-full px-3 text-xs shadow-none">
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
