import { SalesOverview } from "@/components/seller/sales-overview";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Store Analytics</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Deep dive into your store's performance.
              </p>
            </div>
            <SalesOverview />
          </div>
  );
}
