"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "home-living", label: "Home & Living" },
  { id: "beauty", label: "Beauty" },
];

export function ProductFilters() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-[#ffffff] p-6 shadow-sm dark:bg-slate-950/80">
      {/* Categories Navigation */}
      <div className="space-y-4">
        <h3 className="font-bold font-serif text-lg text-slate-900 dark:text-white mb-6">Categories</h3>
        <div className="flex flex-col gap-3">
          <Link 
            href="/products" 
            className={`text-sm transition-colors hover:text-primary ${!currentCategory ? 'font-bold text-primary' : 'font-normal text-slate-600 dark:text-slate-400'}`}
          >
            All Categories
          </Link>
          
          {CATEGORIES.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.id}`}
              className={`text-sm transition-colors hover:text-primary ${currentCategory === category.id ? 'font-bold text-primary' : 'font-normal text-slate-600 dark:text-slate-400'}`}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
