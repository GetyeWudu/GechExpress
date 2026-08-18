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

      {/* Full-width Product Details Tabs */}
      <section className="mb-24">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b border-slate-200 dark:border-slate-800 rounded-none bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="description" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-base font-semibold px-8 py-4 text-slate-500 data-[state=active]:text-primary"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none text-base font-semibold px-8 py-4 text-slate-500 data-[state=active]:text-primary flex items-center gap-2"
            >
              Customer Reviews <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full">{product.reviewsCount}</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="pt-8 animate-in fade-in-50 duration-500">
            <div className="max-w-3xl prose prose-slate dark:prose-invert">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">About this product</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {product.description}
              </p>
              <ul className="mt-8 space-y-3 text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> Premium build quality using aerospace-grade materials.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> Designed in California with precision engineering.</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" /> Covered by our 12-month international warranty.</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-8 animate-in fade-in-50 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              
              {/* Review Summary Column */}
              <div className="md:col-span-4 lg:col-span-3 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Customer Reviews</h3>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-6 w-6 ${star <= Math.round(product.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`} />
                      ))}
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{product.rating.toFixed(1)} out of 5</span>
                  </div>
                  <p className="text-sm text-slate-500">Based on {product.reviewsCount} global ratings</p>
                </div>
                
                <div className="space-y-3">
                  {[
                    { stars: 5, percentage: 75 },
                    { stars: 4, percentage: 15 },
                    { stars: 3, percentage: 5 },
                    { stars: 2, percentage: 3 },
                    { stars: 1, percentage: 2 }
                  ].map((bar) => (
                    <div key={bar.stars} className="flex items-center gap-3 text-sm">
                      <span className="w-12 text-slate-600 dark:text-slate-400 font-medium hover:text-primary cursor-pointer">{bar.stars} star</span>
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.percentage}%` }}></div>
                      </div>
                      <span className="w-10 text-right text-slate-500">{bar.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review List Column */}
              <div className="md:col-span-8 lg:col-span-9 space-y-8">
                {/* Mock Review 1 */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-8 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <UserCircle2 className="h-10 w-10 text-slate-300" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Alex Johnson</p>
                      <p className="text-xs text-slate-500">Reviewed in Ethiopia on October 12, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Absolutely incredible quality and design!</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    I was hesitant at first, but this product exceeded all my expectations. The build quality feels extremely premium, and it performs exactly as advertised. Delivery via GechExpress was fast and secure. Highly recommend to anyone on the fence!
                  </p>
                </div>

                {/* Mock Review 2 */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-8 last:border-0">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">SM</div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Sarah M.</p>
                      <p className="text-xs text-slate-500">Reviewed in Ethiopia on September 28, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                      <Star className="h-4 w-4 fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700" />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified Purchase
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Great product, slightly delayed shipping</h4>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RELATED_PRODUCTS.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
