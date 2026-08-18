"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Package, Home, Printer, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 min-h-[70vh] flex flex-col items-center justify-center">
      
      {/* Receipt Container */}
      <div className="max-w-xl w-full bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
        
        {/* Receipt Header */}
        <div className="bg-emerald-600 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute -left-10 -bottom-10 h-32 w-32 bg-black opacity-10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-emerald-50 text-sm opacity-90">Thank you for shopping with GechExpress</p>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Order Number</p>
              <p className="font-bold text-slate-900 dark:text-white">#ORD-902102</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Date Paid</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{currentDate}</p>
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800 border-dashed border-b-2" />

          {/* Items breakdown */}
          <div className="space-y-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Order Summary</p>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Premium Wireless Headphones (x1)</span>
              <span className="font-medium text-slate-900 dark:text-white">ETB 299.99</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Standard Delivery (Addis Ababa)</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">VAT (15%)</span>
              <span className="font-medium text-slate-900 dark:text-white">ETB 24.00</span>
            </div>
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800" />

          {/* Total & Payment Method */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full flex items-center justify-center shrink-0">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold mb-0.5">Payment Method</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Chapa Gateway <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-black uppercase">PAID</span>
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-500 font-semibold mb-0.5">Total Paid</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">ETB 323.99</p>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex flex-col sm:flex-row gap-3">
          <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" onClick={() => router.push("/customer/orders")}>
            <Package className="mr-2 h-5 w-5" />
            Track Order
          </Button>
          <Button variant="outline" size="lg" className="flex-1 font-semibold" onClick={() => window.print()}>
            <Printer className="mr-2 h-5 w-5 text-slate-500" />
            Save Receipt
          </Button>
        </div>
        
      </div>
      
      <div className="mt-8">
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
          <Home className="h-4 w-4" />
          Return to Storefront
        </Link>
      </div>

    </div>
  );
}
