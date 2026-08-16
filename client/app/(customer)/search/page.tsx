import Link from "next/link";
import { use } from "react";
import { Search, AlertCircle, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/customer/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductFilters } from "@/components/customer/product-filters";

// Mock products database for search
const MOCK_PRODUCTS = [
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
  },
  {
    id: "p2",
    name: "Minimalist Mechanical Keyboard",
    slug: "minimalist-mechanical-keyboard",
    price: 129.99,
    rating: 4.9,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop",
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
  },
  {
    id: "p4",
    name: "Leather Messenger Bag",
    slug: "leather-messenger-bag",
    price: 89.99,
    rating: 4.7,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
  },
];

export default function SearchResultsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = use(searchParams);
  const query = q || "";
  
  // Very simple mock search filter
  const results = query 
    ? MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : MOCK_PRODUCTS;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            Search Results
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {query ? (
              <span>Showing results for <span className="font-semibold text-slate-900 dark:text-slate-200">"{query}"</span></span>
            ) : (
              <span>Showing all products</span>
            )}
            <span className="mx-2">•</span>
            {results.length} {results.length === 1 ? "result" : "results"} found
          </p>
        </div>
        
        {/* Mobile Search Input (Desktop is in header) */}
        <form action="/search" method="GET" className="w-full md:w-80 relative flex md:hidden">
          <Input 
            name="q"
            defaultValue={query}
            placeholder="Search products..." 
            className="w-full pl-4 pr-10"
          />
          <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full w-10 text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 hidden md:block">
          <ProductFilters />
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 h-96">
              <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No results found</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                We couldn't find any products matching "{query}". Try checking your spelling or using more general terms.
              </p>
              <Button asChild>
                <Link href="/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Browse All Products
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
