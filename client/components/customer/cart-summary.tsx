import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
}

export function CartSummary({ subtotal, shipping, tax, discount = 0 }: CartSummaryProps) {
  const total = subtotal + shipping + tax - discount;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="text-slate-900 dark:text-white font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Shipping estimate</span>
          <span className="text-slate-900 dark:text-white font-medium">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Tax estimate</span>
          <span className="text-slate-900 dark:text-white font-medium">${tax.toFixed(2)}</span>
        </div>
      </div>
      
      <Separator className="my-4 dark:bg-slate-800" />
      
      <div className="flex justify-between font-semibold text-lg text-slate-900 dark:text-white mb-6">
        <span>Order Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full text-base font-semibold h-12" })}>
        Checkout
      </Link>
      
      <div className="mt-4 text-center">
        <Link href="/products" className="text-sm text-primary hover:underline font-medium">
          or Continue Shopping
        </Link>
      </div>
    </div>
  );
}
