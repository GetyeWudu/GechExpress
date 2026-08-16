import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
        
        {/* Background decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative flex justify-center">
          <div className="h-24 w-24 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2 shadow-sm ring-8 ring-emerald-50 dark:ring-emerald-950">
            <CheckCircle2 className="h-12 w-12" />
          </div>
        </div>

        <div className="space-y-2 relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Thank you for your purchase. Your order <span className="font-semibold text-slate-900 dark:text-slate-200">#ORD-902102</span> has been placed successfully.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400 text-left border border-slate-100 dark:border-slate-800">
          <p>We've sent an email confirmation with your order details and tracking information to your registered email address.</p>
        </div>

        <div className="flex flex-col gap-3 pt-4 relative z-10">
          <Button asChild size="lg" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
            <Link href="/customer/orders">
              <Package className="mr-2 h-5 w-5" />
              Track Your Order
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/">
              <Home className="mr-2 h-5 w-5 text-slate-500" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
