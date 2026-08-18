import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { CheckoutForm } from "@/components/customer/checkout-form";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Checkout
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1">
          <CheckoutForm />
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop" 
                    fill 
                    className="object-cover" 
                    alt="Product" 
                  />
                  <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-slate-500 text-[10px] font-bold text-white flex items-center justify-center">1</div>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-sm font-medium line-clamp-2">Premium Wireless Headphones</span>
                  <span className="text-sm text-slate-500 mt-1">$299.99</span>
                </div>
              </div>
            </div>

            <Separator className="my-4 dark:bg-slate-800" />
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-900 dark:text-white font-medium">$299.99</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-slate-900 dark:text-white font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax</span>
                <span className="text-slate-900 dark:text-white font-medium">$24.00</span>
              </div>
            </div>
            
            <Separator className="my-4 dark:bg-slate-800" />
            
            <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white mb-6">
              <span>Total</span>
              <span>$323.99</span>
            </div>
            
            <p className="text-xs text-center text-slate-500 mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
