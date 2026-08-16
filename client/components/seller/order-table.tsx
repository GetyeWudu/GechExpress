import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Eye, Package, Truck } from "lucide-react";
import Link from "next/link";

const ORDERS = [
  { id: "ORD-902102", customer: "John Doe", date: "Oct 24, 2026", items: 2, total: 323.99, status: "Delivered" },
  { id: "ORD-902099", customer: "Alice Smith", date: "Oct 22, 2026", items: 1, total: 145.50, status: "Processing" },
  { id: "ORD-901844", customer: "Robert Chen", date: "Oct 20, 2026", items: 4, total: 899.00, status: "Shipped" },
  { id: "ORD-901523", customer: "Emily Johnson", date: "Oct 15, 2026", items: 1, total: 49.99, status: "Cancelled" },
];

export function OrderTable() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 gap-1"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>;
      case "Shipped":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 gap-1"><Truck className="h-3 w-3" /> Shipped</Badge>;
      case "Processing":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 gap-1"><Package className="h-3 w-3" /> Processing</Badge>;
      case "Cancelled":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 gap-1">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {status}</Badge>;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
        <h2 className="font-semibold text-slate-900 dark:text-white">Recent Orders</h2>
        <Button variant="outline" size="sm" className="h-8">View all</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Total</th>
              <th className="px-6 py-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {ORDERS.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{order.id}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.customer}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{order.date}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.items} items</td>
                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <Link href={`/seller/orders/${order.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400")}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View order</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
