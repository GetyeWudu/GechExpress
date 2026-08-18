import { ProductCard } from "@/components/customer/product-card";
import { ProductFilters } from "@/components/customer/product-filters";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SlidersHorizontal } from "lucide-react";

const PRODUCTS = [
  {
    id: "p1",
    name: "Premium Wireless Headphones with Active Noise Cancellation",
    slug: "premium-wireless-headphones",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    isNew: true,
    discountPercentage: 14,
    category: "electronics",
  },
  {
    id: "p2",
    name: "Minimalist Mechanical Keyboard",
    slug: "minimalist-mechanical-keyboard",
    price: 129.99,
    rating: 4.9,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop",
    category: "electronics",
  },
  {
    id: "p3",
    name: "Smart Fitness Watch Series 7",
    slug: "smart-fitness-watch-7",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviewsCount: 256,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    discountPercentage: 20,
    category: "electronics",
  },
  {
    id: "p4",
    name: "Leather Messenger Bag",
    slug: "leather-messenger-bag",
    price: 89.99,
    rating: 4.7,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    category: "fashion",
  },
  {
    id: "p5",
    name: "Noise-Cancelling Earbuds",
    slug: "noise-cancelling-earbuds",
    price: 149.99,
    rating: 4.5,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
    category: "electronics",
  },
  {
    id: "p6",
    name: "Professional Camera Lens",
    slug: "professional-camera-lens",
    price: 899.99,
    rating: 4.9,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=600&auto=format&fit=crop",
    category: "electronics",
  }
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  
  // Filter products by category if provided
  const filteredProducts = category 
    ? PRODUCTS.filter(p => p.category === category)
    : PRODUCTS;
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-8 dark:border-slate-800">
        <h1 className="text-3xl font-black font-serif tracking-tight text-slate-900 dark:text-white md:text-4xl">
          All Products
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-serif text-lg">
          Browse our entire collection of premium items.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <ProductFilters />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Controls Bar */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger render={<Button variant="outline" className="lg:hidden w-full sm:w-auto" />}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="text-left">Filters</SheetTitle>
                  </SheetHeader>
                  <ProductFilters />
                </SheetContent>
              </Sheet>

              <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                Showing {filteredProducts.length} products
              </span>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                Sort by:
              </span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500">
                No products found in this category.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white pointer-events-none opacity-50" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive className="bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white border-transparent">
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    3
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis className="text-slate-500 dark:text-slate-400" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}
