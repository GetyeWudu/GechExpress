import { Package, Search, ChevronRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const MOCK_ORDERS = [
  {
    id: "ORD-902102",
    date: "Oct 24, 2026",
    status: "Delivered",
    total: 323.99,
    items: 2,
  },
  {
    id: "ORD-843921",
    date: "Sep 12, 2026",
    status: "Delivered",
    total: 129.50,
    items: 1,
  },
  {
    id: "ORD-739211",
    date: "Jul 05, 2026",
    status: "Processing",
    total: 899.99,
    items: 1,
  }
];

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Orders</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and track your recent orders
          </p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Input 
            placeholder="Search orders..." 
            className="pl-9 bg-slate-50 dark:bg-slate-900/50"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="space-y-4">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-900">
                <Package className="h-6 w-6 text-slate-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{order.id}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span>{order.date}</span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span>{order.items} {order.items === 1 ? 'item' : 'items'}</span>
                  <span className="hidden sm:inline">&bull;</span>
                  <span className="font-medium text-slate-900 dark:text-slate-300">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-slate-100 dark:border-slate-800 md:border-0 pt-4 md:pt-0">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 
                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'}
              `}>
                {order.status}
              </span>
              
              <Link href={`/customer/orders/${order.id}`} className={buttonVariants({ variant: "ghost", className: "shrink-0" })}>
                View Details <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white pointer-events-none opacity-50" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive className="bg-indigo-500 text-white hover:bg-indigo-600 hover:text-white border-transparent">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white pointer-events-none opacity-50" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
