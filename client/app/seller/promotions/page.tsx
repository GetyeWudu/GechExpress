import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag, Calendar, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const PROMOTIONS = [
  { id: "PRM-001", name: "Summer Sale 2026", code: "SUMMER26", discount: "20%", status: "Active", startDate: "Oct 01, 2026", endDate: "Oct 31, 2026" },
  { id: "PRM-002", name: "Welcome Discount", code: "WELCOME10", discount: "10%", status: "Active", startDate: "Jan 01, 2026", endDate: "Dec 31, 2026" },
  { id: "PRM-003", name: "Black Friday Pre-sale", code: "BFPRE", discount: "$50 off", status: "Draft", startDate: "Nov 20, 2026", endDate: "Nov 26, 2026" },
];

export default function PromotionsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <SellerSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <SellerHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 gap-4">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Promotions & Discounts</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your store's promotional campaigns.</p>
                </div>
                <Link href="/seller/promotions/new" className={cn(buttonVariants({ variant: "default" }), "bg-indigo-600 hover:bg-indigo-700 text-white gap-2")}>
                  <Plus className="h-4 w-4" />
                  Create Promotion
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium">Campaign Name</th>
                      <th className="px-6 py-4 font-medium">Promo Code</th>
                      <th className="px-6 py-4 font-medium">Discount</th>
                      <th className="px-6 py-4 font-medium">Duration</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {PROMOTIONS.map((promo) => (
                      <tr key={promo.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{promo.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                            <Tag className="h-3 w-3 text-slate-400" />
                            {promo.code}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">{promo.discount}</td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {promo.startDate} - {promo.endDate}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={promo.status === "Active" ? "default" : "secondary"} className={promo.status === "Active" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"}>
                            {promo.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
