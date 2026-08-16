import Link from "next/link";
import { Package, Heart, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function CustomerDashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Welcome back, John! Here is an overview of your account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Stat Cards */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
            </div>
          </div>
          <Link href="/customer/orders" className="text-sm text-primary font-medium hover:underline">
            View all orders &rarr;
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Wishlist Items</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
            </div>
          </div>
          <Link href="/customer/wishlist" className="text-sm text-primary font-medium hover:underline">
            View wishlist &rarr;
          </Link>
        </div>


      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Orders</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden dark:border-slate-800">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#ORD-902102</td>
                <td className="px-6 py-4 text-slate-500">Oct 24, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Delivered
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">$323.99</td>
              </tr>
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">#ORD-843921</td>
                <td className="px-6 py-4 text-slate-500">Sep 12, 2026</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Delivered
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium">$129.50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
