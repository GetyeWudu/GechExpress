import { SellerTable } from "@/components/admin/seller-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminSellersPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sellers Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Approve, suspend, and manage store owners on GechExpress.
          </p>
        </div>
        <Link href="/admin/sellers/new" className={cn(buttonVariants({ variant: "default" }), "bg-indigo-600 hover:bg-indigo-700 text-white gap-2")}>
          <Plus className="h-4 w-4" />
          Onboard New Seller
        </Link>
      </div>
      
      <SellerTable />
    </div>
  );
}
