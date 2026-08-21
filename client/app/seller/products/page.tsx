import { ProductTable } from "@/components/seller/product-table";
import { Package, CheckCircle, Clock, AlertTriangle, ShoppingCart, DollarSign, RefreshCw, Download, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 pt-0">
      
      {/* Top Back Navigation (Simulated from image) */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800/60">
        <Link href="/seller" className="flex items-center hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <div className="flex flex-col ml-4 border-l border-slate-200 dark:border-slate-700 pl-4">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">My Products</h1>
          <span className="text-xs text-slate-500">Manage your product inventory</span>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/seller" className="sm:hidden flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white tracking-tight">My Products</h1>
            <Badge variant="secondary" className="bg-slate-200/60 text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 rounded-sm font-medium">3 total</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage and monitor your product catalog</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-300 dark:border-slate-700">
            <RefreshCw className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-slate-300 dark:border-slate-700">
            <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
          <Link href="/seller/products/new">
            <Button className="h-9 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-medium px-4 ml-1">
              <Plus className="h-4 w-4 mr-1.5" /> Add product
            </Button>
          </Link>
        </div>
      </div>

      {/* Custom 6-Column Stat Cards mimicking reference image */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 h-16 sm:h-20">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Products</span>
            <Package className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">3</span>
        </div>
        
        <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/30 dark:bg-slate-950 h-16 sm:h-20">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active</span>
            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-500">3</span>
        </div>

        <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-amber-200 bg-white shadow-sm dark:border-amber-900/30 dark:bg-slate-950 h-16 sm:h-20">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending</span>
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-500">0</span>
        </div>

        <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-rose-200 bg-white shadow-sm dark:border-rose-900/30 dark:bg-slate-950 h-16 sm:h-20">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Low Stock</span>
            <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-500">0</span>
        </div>

        <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-blue-200 bg-white shadow-sm dark:border-blue-900/30 dark:bg-slate-950 h-16 sm:h-20">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Sales</span>
            <ShoppingCart className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-500">307</span>
        </div>

        <div className="flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-emerald-200 bg-white shadow-sm dark:border-emerald-900/30 dark:bg-slate-950 h-16 sm:h-20">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Revenue</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-500">ETB 0</span>
        </div>
      </div>
      
      <div className="pt-2">
        <ProductTable />
      </div>
    </div>
  );
}
