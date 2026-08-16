import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { SalesOverview } from "@/components/seller/sales-overview";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <SellerSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <SellerHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Store Analytics</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Deep dive into your store's performance.
              </p>
            </div>
            <SalesOverview />
          </div>
        </main>
      </div>
    </div>
  );
}
