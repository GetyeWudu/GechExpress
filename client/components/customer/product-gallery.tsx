"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <span className="text-slate-400">No image available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails (Left on desktop, Bottom on mobile) */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-24 shrink-0 no-scrollbar py-1 lg:py-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={cn(
              "relative aspect-square w-20 lg:w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900 transition-all border-2",
              selectedIndex === idx 
                ? "border-primary shadow-sm" 
                : "border-transparent hover:border-slate-300 dark:hover:border-slate-700"
            )}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              fill
              className="object-cover"
              sizes="100px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 flex-1">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} image ${selectedIndex + 1}`}
          fill
          className="object-cover transition-all duration-500 hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
