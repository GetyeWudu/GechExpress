"use client";

import { RevenueCard } from "@/components/seller/revenue-card";
import { SalesOverview } from "@/components/seller/sales-overview";
import { OrderSummary } from "@/components/seller/order-summary";
import { buttonVariants } from "@/components/ui/button";
import { Plus, DollarSign, ShoppingCart, Package, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useSellerStore } from "@/stores/seller-store";

export default function SellerDashboard() {
  const { products, orders } = useSellerStore();

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter(
    (o) => o.status !== "Delivered" && o.status !== "Cancelled"
  ).length;
  const productsSold = products.reduce((sum, p) => sum + p.sales, 0);

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <section className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-slate-200/50 dark:border-slate-700 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Seller Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Overview of your store performance for the selected period.
          </p>
        </div>
        <Select defaultValue="30days">
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="year">Current Year</SelectItem>
          </SelectContent>
        </Select>
        <Link
          href="/seller/products/new"
          className={buttonVariants({ variant: "default", size: "sm", className: "h-9 px-3 bg-indigo-600 hover:bg-indigo-700 text-white" })}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Link>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <RevenueCard
          title="Total Revenue"
          amount={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend="+20.1%"
          trendUp={true}
          icon={DollarSign}
        />
        <RevenueCard
          title="Active Orders"
          amount={String(activeOrders)}
          trend="+12.5%"
          trendUp={true}
          icon={ShoppingCart}
        />
        <RevenueCard
          title="Products Sold"
          amount={String(productsSold)}
          trend="+5.2%"
          trendUp={true}
          icon={Package}
        />
        <RevenueCard
          title="Store Views"
          amount="48.2k"
          trend="-2.4%"
          trendUp={false}
          icon={Eye}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <SalesOverview />
        </div>
        <div className="space-y-8">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
