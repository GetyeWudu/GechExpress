import { ProductCard } from "@/components/customer/product-card";
import { ProductFilters } from "@/components/customer/product-filters";
import { CountdownTimer } from "@/components/customer/countdown-timer";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Zap, SlidersHorizontal, Search, Flame } from "lucide-react";

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
    originalPrice: 159.99,
    rating: 4.9,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop",
    discountPercentage: 19,
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
    originalPrice: 119.99,
    rating: 4.7,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    discountPercentage: 25,
    category: "fashion",
  },
  {
    id: "p7",
    name: "Ergonomic Office Chair",
    slug: "ergonomic-office-chair",
    price: 249.99,
    originalPrice: 349.99,
    rating: 4.5,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop",
    discountPercentage: 28,
    category: "home-kitchen",
  },
  {
    id: "p8",
    name: "Ultra HD Smart TV",
    slug: "ultra-hd-smart-tv",
    price: 899.99,
    originalPrice: 1199.99,
    rating: 4.9,
    reviewsCount: 56,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=600&auto=format&fit=crop",
    discountPercentage: 25,
    category: "electronics",
  }
];

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  
  // Filter only products that have a discount
  const dealProducts = PRODUCTS.filter(p => p.discountPercentage && p.discountPercentage > 0);

  const filteredProducts = dealProducts.filter(p => {
    if (category && p.category !== category) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 pt-24 md:py-12 md:pt-28 max-w-[1400px]">
        
        {/* Flash Deals Hero Banner */}
        <div className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 dark:from-rose-950 dark:via-rose-900 dark:to-orange-900 px-6 py-10 sm:p-12 shadow-lg isolate">
          {/* Decorative shapes */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-yellow-500/20 blur-3xl rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-4">
                <Flame className="w-4 h-4 text-yellow-300" />
                <span>Limited Time Offer</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4" style={{ fontFamily: 'serif' }}>
                Flash Sales <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-sm">Up to 50% Off</span>
              </h1>
              <p className="text-rose-100 text-lg md:text-xl font-medium max-w-lg mb-8">
                Grab the hottest deals before they're gone. Premium tech, fashion, and home goods at unbeatable prices.
              </p>
            </div>

            {/* Countdown Container */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center shrink-0">
              <span className="text-white font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 
                Sale Ends In
              </span>
              <CountdownTimer targetHours={18} />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <ProductFilters />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="mb-6 flex flex-col gap-4">
              {/* Search Bar */}
              <form method="GET" action="/deals" className="relative w-full">
                {category && <input type="hidden" name="category" value={category} />}
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q || ""}
                  placeholder="Search deals..."
                  className="h-11 w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                />
              </form>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger render={<Button variant="outline" className="lg:hidden w-full sm:w-auto border-slate-200 dark:border-slate-800" />}>
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

                  <span className="text-sm font-semibold text-slate-900 dark:text-white hidden sm:block">
                    {filteredProducts.length} <span className="text-slate-500 dark:text-slate-400 font-normal">deals found</span>
                  </span>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                    Sort by:
                  </span>
                  <Select defaultValue="discount">
                    <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Biggest Discount</SelectItem>
                      <SelectItem value="featured">Featured Deals</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3 sm:gap-5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                  <Flame className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No deals found</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    We couldn't find any deals matching your current filters. Try adjusting your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
