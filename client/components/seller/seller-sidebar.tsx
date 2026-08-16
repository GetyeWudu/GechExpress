"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Tags,
  Settings,
  Store,
  Wallet,
  MessageSquare,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Overview", href: "/seller", icon: LayoutDashboard },
  { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
  { name: "Products", href: "/seller/products", icon: Package },
  { name: "Inventory", href: "/seller/inventory", icon: Store },
  { name: "Customers", href: "/seller/customers", icon: Users },
  { name: "Analytics", href: "/seller/analytics", icon: BarChart3 },
  { name: "Earnings", href: "/seller/earnings", icon: Wallet },
  { name: "Promotions", href: "/seller/promotions", icon: Tags },
  { name: "Reviews", href: "/seller/reviews", icon: MessageSquare },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:flex">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 px-6 dark:border-slate-800">
        <Store className="h-6 w-6 text-amber-500" />
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          GechExpress <span className="font-normal text-slate-500">Seller</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-amber-600 dark:text-amber-500" : "text-slate-400")} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer / Settings */}
      <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
        <ul className="space-y-1">
          <li>
            <Link
              href="/seller/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === "/seller/settings"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-white"
              )}
            >
              <Settings className="h-5 w-5 text-slate-400" />
              Settings
            </Link>
          </li>
          <li>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-500 transition-colors">
              <LogOut className="h-5 w-5 text-slate-400" />
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
