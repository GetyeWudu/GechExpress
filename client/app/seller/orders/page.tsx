import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { OrderTable } from "@/components/seller/order-table";
import { OrderSummary } from "@/components/seller/order-summary";

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <SellerSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <SellerHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <OrderSummary />
            <OrderTable />
          </div>
        </main>
      </div>
    </div>
  );
}
