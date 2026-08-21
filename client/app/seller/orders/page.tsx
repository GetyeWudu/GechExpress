import { OrderTable } from "@/components/seller/order-table";
import { ShoppingCart, PackageOpen, Truck, CheckCircle, XCircle, DollarSign, RefreshCw, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ALL_ORDERS } from "@/lib/dummy-orders";

export default function OrdersPage() {
  const totalOrders = ALL_ORDERS.length;
  const pendingOrders = ALL_ORDERS.filter(o => o.status === "Pending").length;
  const shippedOrders = ALL_ORDERS.filter(o => o.status === "Shipped").length;
  const deliveredOrders = ALL_ORDERS.filter(o => o.status === "Delivered").length;
  const cancelledOrders = ALL_ORDERS.filter(o => o.status === "Cancelled").length;
  const revenue = ALL_ORDERS.filter(o => o.paymentStatus === "Paid").reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6 pt-0">
      
      {/* Top Back Navigation */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800/60">
        <Link href="/seller" className="flex items-center hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <div className="flex flex-col ml-4 border-l border-slate-200 dark:border-slate-700 pl-4">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">My Orders</h1>
          <span className="text-xs text-slate-500">Manage and fulfill customer orders</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/seller" className="sm:hidden flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">My Orders</h1>
            <Badge variant="secondary" className="bg-slate-200/60 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 rounded-sm font-medium">256 total</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">Track and manage your order fulfillment pipeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-300 dark:border-slate-700">
            <RefreshCw className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-300 dark:border-slate-700">
            <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Custom 6-Column Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Link href="/seller/orders" className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-blue-200 bg-white shadow-sm dark:border-blue-900/30 dark:bg-slate-950 h-16 sm:h-20 hover:opacity-80 transition-opacity">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-500">{totalOrders}</span>
        </Link>
        
        <Link href="/seller/orders?status=Pending" className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white shadow-sm dark:border-amber-900/30 dark:bg-slate-950 h-16 sm:h-20 hover:opacity-80 transition-opacity">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending</span>
            <PackageOpen className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-500">{pendingOrders}</span>
        </Link>

        <Link href="/seller/orders?status=Shipped" className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-indigo-200 bg-white shadow-sm dark:border-indigo-900/30 dark:bg-slate-950 h-16 sm:h-20 hover:opacity-80 transition-opacity">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Shipped</span>
            <Truck className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-500">{shippedOrders}</span>
        </Link>

        <Link href="/seller/orders?status=Delivered" className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/30 dark:bg-slate-950 h-16 sm:h-20 hover:opacity-80 transition-opacity">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Delivered</span>
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-500">{deliveredOrders}</span>
        </Link>

        <Link href="/seller/orders?status=Cancelled" className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-rose-200 bg-white shadow-sm dark:border-rose-900/30 dark:bg-slate-950 h-16 sm:h-20 hover:opacity-80 transition-opacity">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Cancelled</span>
            <XCircle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-500">{cancelledOrders}</span>
        </Link>

        <Link href="/seller/orders?payment=Paid" className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/30 dark:bg-slate-950 h-16 sm:h-20 hover:opacity-80 transition-opacity">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Revenue</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-500">${revenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </Link>
      </div>

      <div className="pt-2">
        <OrderTable />
      </div>
    </div>
  );
}
