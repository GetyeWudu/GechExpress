import { Package } from "lucide-react";

export function OrderSummary() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Fulfillment Overview</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-100">Pending Orders</p>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80">Requires immediate attention</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-amber-700 dark:text-amber-500">12</span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">Processing</p>
              <p className="text-sm text-blue-700/80 dark:text-blue-400/80">Currently being packed</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-500">28</span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-100">Shipped</p>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">In transit to customer</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-500">84</span>
        </div>
      </div>
    </div>
  );
}
