import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/customer/product-card";
import { CategoryCard } from "@/components/customer/category-card";
import { HeroSlider } from "@/components/customer/hero-slider";

// Mock data for initial UI build
const CATEGORIES = [
  { id: "1", name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop", itemCount: 124 },
  { id: "2", name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop", itemCount: 86 },
  { id: "3", name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1484101403630-f273448c5667?q=80&w=600&auto=format&fit=crop", itemCount: 42 },
  { id: "4", name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop", itemCount: 53 },
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
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero: Full-screen immersive slider */}
      <HeroSlider />

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Shop by Category</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Find exactly what you're looking for</p>
          </div>
          <Link href="/categories" className={buttonVariants({ variant: "ghost", className: "hidden sm:flex" })}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
        </div>
        <Link href="/categories" className={buttonVariants({ variant: "outline", className: "mt-6 w-full sm:hidden" })}>
          View All Categories
        </Link>
      </section>

      {/* Trending Products */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Trending Now</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Our most popular products this week</p>
          </div>
          <Link href="/products?sort=trending" className={buttonVariants({ variant: "ghost", className: "hidden sm:flex" })}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <Link href="/products?sort=trending" className={buttonVariants({ variant: "outline", className: "mt-6 w-full sm:hidden" })}>
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
          <div className="relative flex flex-col items-center justify-center p-12 text-center sm:p-16 lg:p-24">
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
