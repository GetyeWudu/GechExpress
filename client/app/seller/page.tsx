import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { SalesOverview } from "@/components/seller/sales-overview";
import { RevenueCard } from "@/components/seller/revenue-card";
import { OrderSummary } from "@/components/seller/order-summary";

export default function SellerDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <SellerSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <SellerHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Here's what's happening with your store today.
              </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <RevenueCard title="Total Revenue" amount="$45,231.89" trend="+20.1%" trendUp={true} />
              <RevenueCard title="Active Orders" amount="124" trend="+12.5%" trendUp={true} />
              <RevenueCard title="Products Sold" amount="1,429" trend="+5.2%" trendUp={true} />
              <RevenueCard title="Store Views" amount="48.2k" trend="-2.4%" trendUp={false} />
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
        </main>
      </div>
    </div>
  );
}
