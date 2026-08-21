"use client";

import { useEffect, useState } from "react";
import { CartItem } from "@/components/customer/cart-item";
import { CartSummary } from "@/components/customer/cart-summary";
import { ShoppingCart, ArrowLeft, Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, getTotalPrice, updateQuantity, removeItem } = useCartStore();
  const subtotal = getTotalPrice();
  const discount = 0; // Dynamic discount can be added later

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const hasItems = items.length > 0;

  if (!hasItems) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-16 md:pt-48 md:pb-32 flex flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 mb-6 text-slate-400">
          <ShoppingCart className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
          Looks like you haven't added anything to your cart yet. Browse our categories and find something you love.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg" })}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      <div className="container mx-auto px-4 pt-28 pb-12 sm:pt-32 max-w-[1200px]">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: "serif" }}>
              Shopping Cart
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">{items.length} items</p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-[#fdf8ed] dark:bg-[#332c1c] text-[#c69a53] px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold border border-[#faecd8] dark:border-[#52442a] whitespace-nowrap">
             <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m4.93 10.93 2.83-2.83"/><path d="M2 18h4"/><path d="m4.93 25.07 2.83 2.83"/><path d="M12 30v-4"/><path d="m19.07 25.07-2.83 2.83"/><path d="M22 18h-4"/><path d="m19.07 10.93-2.83-2.83"/></svg>
             Free Shipping Unlocked
          </div>
        </div>

        {/* Production-Level Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-8">
          <ol className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1.5">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </li>
            <li>
              <Link href="/products" className="hover:text-primary transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
            </li>
            <li aria-current="page" className="text-slate-900 dark:text-slate-100 font-medium">
              Shopping Cart
            </li>
          </ol>
          <div className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 px-3 py-1 rounded text-xs font-semibold border border-slate-100 dark:border-slate-800 hidden sm:block">
            {items.length} items in cart
          </div>
        </nav>



        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 lg:max-w-[700px]">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6" style={{ fontFamily: "serif" }}>Shopping Cart</h2>
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <CartItem 
                  key={item.id} 
                  {...item} 
                  onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="w-full lg:w-[420px] shrink-0">
            <div className="sticky top-24">
              <CartSummary 
                items={items}
                subtotal={subtotal} 
                shipping={0} // Free shipping
                tax={subtotal * 0.15} // 15% tax (matching image)
                discount={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
