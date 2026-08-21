import { ProductGallery } from "@/components/customer/product-gallery";
import { ProductInfo } from "@/components/customer/product-info";
import { ProductCard } from "@/components/customer/product-card";
import { ChevronRight, Home, Star, CheckCircle2, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock Data
const PRODUCT_DB = {
  "premium-wireless-headphones": {
    id: "p1",
    name: "Premium Wireless Headphones with Active Noise Cancellation",
    slug: "premium-wireless-headphones",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.8,
    reviewsCount: 124,
    description: "Experience pure audio bliss with our latest Premium Wireless Headphones. Featuring industry-leading active noise cancellation, high-resolution audio support, and a remarkably comfortable ergonomic design for all-day listening. Battery life up to 30 hours on a single charge.",
    inStock: true,
    sku: "AU-HP-842",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  "minimalist-mechanical-keyboard": {
    id: "p2",
    name: "Minimalist Mechanical Keyboard",
    slug: "minimalist-mechanical-keyboard",
    price: 129.99,
    rating: 4.9,
    reviewsCount: 89,
    description: "A sleek, minimalist mechanical keyboard designed for both productivity and gaming. Features tactile switches, customizable RGB backlighting, and a premium aluminum frame.",
    inStock: true,
    sku: "KB-MCH-002",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  "smart-fitness-watch-7": {
    id: "p3",
    name: "Smart Fitness Watch Series 7",
    slug: "smart-fitness-watch-7",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.6,
    reviewsCount: 256,
    description: "Track your health and stay connected with the Series 7 Smart Fitness Watch. Features a larger, always-on Retina display, blood oxygen monitoring, and advanced workout tracking.",
    inStock: true,
    sku: "WT-SFW-007",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  "leather-messenger-bag": {
    id: "p4",
    name: "Leather Messenger Bag",
    slug: "leather-messenger-bag",
    price: 89.99,
    rating: 4.7,
    reviewsCount: 42,
    description: "A classic leather messenger bag crafted from premium full-grain leather. Perfect for daily commutes with a dedicated padded laptop compartment and multiple organizational pockets.",
    inStock: true,
    sku: "BG-LTH-044",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  "noise-cancelling-earbuds": {
    id: "p5",
    name: "Noise-Cancelling Earbuds",
    slug: "noise-cancelling-earbuds",
    price: 149.99,
    rating: 4.5,
    reviewsCount: 312,
    description: "Compact wireless earbuds delivering immersive sound with active noise cancellation and transparency mode. Sweat and water-resistant for workouts.",
    inStock: true,
    sku: "AU-EB-005",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop"
    ]
  }
};

const RELATED_PRODUCTS = [
  {
    id: "p5",
    name: "Noise-Cancelling Earbuds",
    slug: "noise-cancelling-earbuds",
    price: 149.99,
    rating: 4.5,
    reviewsCount: 312,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
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
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = PRODUCT_DB[slug as keyof typeof PRODUCT_DB];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Product Not Found</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">We couldn't find the product you're looking for. It may have been removed or the link is incorrect.</p>
        <Link href="/" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
          <Home className="h-5 w-5" /> Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/" className="flex items-center hover:text-primary transition-colors">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-primary transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 dark:text-slate-200 font-medium truncate max-w-[200px] sm:max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Product Details & Reviews Tabs */}
      <section className="mb-24 mt-12">
        <Tabs defaultValue="description" className="w-full">
          <div className="flex justify-start mb-8 border-b border-slate-200 dark:border-slate-800">
            <TabsList className="flex h-auto items-center justify-start bg-transparent p-0 gap-6 sm:gap-8">
              <TabsTrigger 
                value="description" 
                className="inline-flex items-center justify-center whitespace-nowrap px-1 pb-4 text-base sm:text-lg font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 data-[state=active]:text-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:border-b-[3px] data-[state=active]:border-slate-900 dark:data-[state=active]:border-white data-[state=active]:shadow-none rounded-none bg-transparent data-[state=active]:bg-transparent"
              >
                Description
              </TabsTrigger>
              <TabsTrigger 
                value="reviews" 
                className="inline-flex items-center justify-center whitespace-nowrap px-1 pb-4 text-base sm:text-lg font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 data-[state=active]:text-amber-500 dark:data-[state=active]:text-amber-500 data-[state=active]:border-b-[3px] data-[state=active]:border-slate-900 dark:data-[state=active]:border-white data-[state=active]:shadow-none rounded-none bg-transparent data-[state=active]:bg-transparent"
              >
                Reviews
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="description" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 pt-4">
            <div className="mx-auto max-w-4xl rounded-3xl bg-white dark:bg-slate-950 p-8 sm:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-900">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">About this product</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-8">
                {product.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Premium Quality</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Crafted using aerospace-grade materials for durability.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Precision Engineered</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Designed in California with meticulous attention to detail.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Fully Covered</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Backed by our comprehensive 12-month warranty.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mx-auto max-w-6xl">
              
              {/* Review Summary Column */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-900 sticky top-24">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Customer Reviews</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                      {product.rating.toFixed(1)}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`h-5 w-5 ${star <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700"}`} />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-500">Based on {product.reviewsCount} reviews</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                    {[
                      { stars: 5, percentage: 75 },
                      { stars: 4, percentage: 15 },
                      { stars: 3, percentage: 5 },
                      { stars: 2, percentage: 3 },
                      { stars: 1, percentage: 2 }
                    ].map((bar) => (
                      <div key={bar.stars} className="flex items-center gap-3 text-sm">
                        <span className="w-12 text-slate-600 dark:text-slate-400 font-bold flex items-center justify-end gap-1">
                          {bar.stars} <Star className="h-3 w-3 fill-slate-400 text-slate-400" />
                        </span>
                        <div className="flex-1 h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                          <div className="absolute top-0 left-0 h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${bar.percentage}%` }}></div>
                        </div>
                        <span className="w-10 text-right font-medium text-slate-500">{bar.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review List Column */}
              <div className="lg:col-span-8 space-y-6">
                {/* Mock Review 1 */}
                <div className="rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-900">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <UserCircle2 className="h-8 w-8 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-base">Alex Johnson</p>
                        <p className="text-xs font-medium text-slate-500">Reviewed on October 12, 2023</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                  
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Absolutely incredible quality and design!</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    I was hesitant at first, but this product exceeded all my expectations. The build quality feels extremely premium, and it performs exactly as advertised. Delivery via GechExpress was fast and secure. Highly recommend to anyone on the fence!
                  </p>
                </div>

                {/* Mock Review 2 */}
                <div className="rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-900">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-black text-lg">
                        SM
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-base">Sarah M.</p>
                        <p className="text-xs font-medium text-slate-500">Reviewed on September 28, 2023</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                  
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                    <Star className="h-4 w-4 fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700" />
                  </div>
                  
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Great product, slightly delayed shipping</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    The item itself is fantastic. Works perfectly and looks great on my desk. I knocked off one star because the courier got slightly lost trying to find my specific location, but the customer service was very helpful in resolving it.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Related Products */}
      <section className="pt-16 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
          You might also like
        </h2>
        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-6 pb-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 sm:overflow-visible sm:pb-0 no-scrollbar">
          {RELATED_PRODUCTS.map((p) => (
            <div key={p.id} className="snap-start shrink-0 w-[140px] sm:w-auto flex flex-col [&>div]:flex-1 [&>div]:w-full">
              <ProductCard {...p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
