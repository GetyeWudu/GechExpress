import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/customer/product-card";
import { CategoryCard } from "@/components/customer/category-card";
import { HeroSlider } from "@/components/customer/hero-slider";

// Mock data for initial UI build
const CATEGORIES = [
  { 
    id: "1", 
    name: "Electronics", 
    slug: "electronics", 
    images: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=300&auto=format&fit=crop"
    ], 
    itemCount: 124 
  },
  { 
    id: "2", 
    name: "Fashion", 
    slug: "fashion", 
    images: [
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop"
    ], 
    itemCount: 86 
  },
  { 
    id: "3", 
    name: "Home & Living", 
    slug: "home-living", 
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=300&auto=format&fit=crop"
    ], 
    itemCount: 42 
  },
  { 
    id: "4", 
    name: "Beauty", 
    slug: "beauty", 
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=300&auto=format&fit=crop"
    ], 
    itemCount: 53 
  },
];

const FEATURED_PRODUCTS = [
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

export default function CustomerHomePage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      {/* Hero: Full-screen immersive slider */}
      <HeroSlider />

      {/* Featured Categories (Enterprise Layout) */}
      <section className="container mx-auto px-4 mt-4 sm:mt-6">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="max-w-2xl flex flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Shop by Category
            </h2>
          </div>
          <div className="hidden sm:flex">
            <Link href="/categories" className={buttonVariants({ variant: "outline", className: "rounded-full px-6 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900" })}>
              View All Categories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2 sm:gap-4">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
        <Link href="/categories" className={buttonVariants({ variant: "outline", className: "mt-4 w-full sm:hidden rounded-full h-10 border-slate-300 dark:border-slate-800 font-semibold" })}>
          View All Categories
        </Link>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-4 mt-4 sm:mt-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Trending Now
            </h2>
          </div>
          <div className="hidden sm:flex">
            <Link href="/products?sort=trending" className={buttonVariants({ variant: "ghost", className: "rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" })}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 sm:overflow-visible sm:pb-0 no-scrollbar">
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[140px] sm:w-auto flex flex-col [&>div]:flex-1 [&>div]:w-full">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        <Link href="/products?sort=trending" className={buttonVariants({ variant: "outline", className: "mt-4 w-full sm:hidden rounded-full h-10 border-slate-300 dark:border-slate-800 font-semibold" })}>
          View All Products
        </Link>
      </section>



      {/* Promotional Banner */}
      <section className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-950">
          <div className="absolute inset-0 opacity-50 mix-blend-multiply">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop"
              alt="Sale Background"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative flex flex-col items-center justify-center p-6 text-center sm:p-8 lg:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              End of Season Sale
            </h2>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Get up to 50% off on selected items. Don't miss out on these exclusive deals available for a limited time only.
            </p>
            <div className="mt-8">
              <Link href="/products?sale=true" className={buttonVariants({ size: "lg", variant: "secondary", className: "h-12 px-8 font-semibold" })}>
                Shop the Sale
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
