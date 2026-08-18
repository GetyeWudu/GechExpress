import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Package, ShieldCheck, CheckCircle2, ArrowLeft, Clock, Lock, CreditCard, RotateCcw } from "lucide-react";

interface CartSummaryProps {
  items?: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
}

export function CartSummary({ items = [], subtotal, shipping, tax, discount = 0 }: CartSummaryProps) {
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-slate-800 text-white px-5 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold">Order Summary</h2>
        </div>
        <div className="bg-white/20 px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5" />
          {items.length} items
        </div>
      </div>
      
      <div className="p-6">



        {/* Pricing Breakdown */}
        <div className="space-y-3 text-sm mb-5">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Subtotal</span>
            <span className="text-slate-900 dark:text-white font-medium">ETB {subtotal.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Shipping</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[13px]">Free</span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Tax (15%)</span>
            <span className="text-slate-900 dark:text-white font-medium">ETB {tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 mb-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 mb-2 font-medium text-[13px] text-slate-800 dark:text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            Free shipping unlocked!
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-full rounded-full"></div>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-end mb-6">
          <span className="font-bold text-base text-slate-900 dark:text-white">Total</span>
          <div className="text-right">
            <div className="font-bold text-xl text-slate-900 dark:text-white font-serif">ETB {total.toFixed(2)}</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">Shipping included free</div>
          </div>
        </div>

        {/* Checkout Button */}
        <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full text-base font-bold h-13 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white border-0 transition-colors flex items-center justify-center gap-2 mb-4 rounded-xl" })}>
          <ShieldCheck className="w-5 h-5" />
          Proceed to Checkout
        </Link>

        <div className="text-center mb-6">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Continue Shopping
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] mb-6">
          <Clock className="w-3.5 h-3.5" />
          Estimated delivery: 3-5 business days
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            SSL Secure
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Buyer Protection
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-amber-500" />
            Multiple Cards
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Easy Returns
          </div>
        </div>
      </div>
    </div>
  );
}
