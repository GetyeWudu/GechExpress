import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { EarningsCard } from "@/components/seller/earnings-card";
import { EarningsTable } from "@/components/seller/earnings-table";
import { Button } from "@/components/ui/button";
import { Download, Wallet } from "lucide-react";

export default function EarningsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <SellerSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <SellerHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Earnings & Payouts</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Track your revenue, platform fees, and upcoming payouts.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-700">
                  <Download className="h-4 w-4" />
                  Export Statement
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <Wallet className="h-4 w-4" />
                  Request Payout
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EarningsCard 
                title="Available Balance" 
                amount="$12,450.00" 
                subtitle="Ready to withdraw" 
                trend="+15%" 
                isPositive={true}
                highlight={true} 
              />
              <EarningsCard 
                title="Pending Clearance" 
                amount="$3,240.50" 
                subtitle="From recent orders" 
                trend="+5%" 
                isPositive={true} 
              />
              <EarningsCard 
                title="Total Platform Fees" 
                amount="$1,450.00" 
                subtitle="This month" 
                trend="-2%" 
                isPositive={false} 
              />
            </div>

            <EarningsTable />
          </div>
        </main>
      </div>
    </div>
  );
}
