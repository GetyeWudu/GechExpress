"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, Eye, Package, Truck, MoreVertical, XCircle, RefreshCcw, Search, Calendar, Filter } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_ORDERS } from "@/lib/dummy-orders";

export function OrderTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialStatus = searchParams.get("status") || "All";
  const initialPayment = searchParams.get("payment") || "All";
  
  const [orders, setOrders] = useState(ALL_ORDERS);
  const [activeTab, setActiveTab] = useState(initialStatus);
  const [paymentFilter, setPaymentFilter] = useState(initialPayment);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("All");

  // Keep state in sync with URL
  useEffect(() => {
    const urlStatus = searchParams.get("status");
    setActiveTab(urlStatus || "All");

    const urlPayment = searchParams.get("payment");
    setPaymentFilter(urlPayment || "All");
  }, [searchParams]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50 gap-1"><CheckCircle2 className="h-3 w-3" /> Delivered</Badge>;
      case "Shipped":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50 gap-1"><Truck className="h-3 w-3" /> Shipped</Badge>;
      case "Processing":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50 gap-1"><Package className="h-3 w-3" /> Processing</Badge>;
      case "Cancelled":
        return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50 gap-1"><XCircle className="h-3 w-3" /> Cancelled</Badge>;
      case "Pending":
      default:
        return <Badge variant="outline" className="gap-1 bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"><Clock className="h-3 w-3" /> {status}</Badge>;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchQuery.toLowerCase()) || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === "All" || order.status === activeTab;
    const matchesPayment = paymentFilter === "All" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter("All");
    setActiveTab("All");
    setPaymentFilter("All");
  };

  const hasActiveFilters = activeTab !== "All" || dateFilter !== "All" || paymentFilter !== "All";

  return (
    <div className="flex flex-col space-y-6">
      {/* Advanced Filters Bar */}
      <div className="flex flex-col gap-4 bg-transparent">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-2xl w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by ID, customer, etc..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-11 w-full rounded-lg shadow-sm"
          />
        </div>
        
        {/* Right-Aligned Dropdowns */}
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <Select value={activeTab} onValueChange={(val) => val && setActiveTab(val)}>
            <SelectTrigger className="w-[140px] h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={(val) => val && setPaymentFilter(val)}>
            <SelectTrigger className="w-[140px] h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <SelectValue placeholder="All payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All payments</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={(val) => val && setDateFilter(val)}>
            <SelectTrigger className="w-[140px] h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All time</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-md border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-11 hidden md:flex">
            <Button variant="ghost" size="icon" className="h-full w-9 rounded-sm bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M4.5 5.5C5.05228 5.5 5.5 5.05228 5.5 4.5C5.5 3.94772 5.05228 3.5 4.5 3.5C3.94772 3.5 3.5 3.94772 3.5 4.5C3.5 5.05228 3.94772 5.5 4.5 5.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path><path d="M4.5 11.5C5.05228 11.5 5.5 11.0523 5.5 10.5C5.5 9.94772 5.05228 9.5 4.5 9.5C3.94772 9.5 3.5 9.94772 3.5 10.5C3.5 11.0523 3.94772 11.5 4.5 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path><path d="M10.5 5.5C11.0523 5.5 11.5 5.05228 11.5 4.5C11.5 3.94772 11.0523 3.5 10.5 3.5C9.94772 3.5 9.5 3.94772 9.5 4.5C9.5 5.05228 9.94772 5.5 10.5 5.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path><path d="M10.5 11.5C11.0523 11.5 11.5 11.0523 11.5 10.5C11.5 9.94772 11.0523 9.5 10.5 9.5C9.94772 9.5 9.5 9.94772 9.5 10.5C9.5 11.0523 9.94772 11.5 10.5 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-full w-9 rounded-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M3.15 4C3.61944 4 4 3.61944 4 3.15C4 2.68056 3.61944 2.3 3.15 2.3C2.68056 2.3 2.3 2.68056 2.3 3.15C2.3 3.61944 2.68056 4 3.15 4ZM3.15 8.35C3.61944 8.35 4 7.96944 4 7.5C4 7.03056 3.61944 6.65 3.15 6.65C2.68056 6.65 2.3 7.03056 2.3 7.5C2.3 7.96944 2.68056 8.35 3.15 8.35ZM3.15 12.7C3.61944 12.7 4 12.3194 4 11.85C4 11.3806 3.61944 11 3.15 11C2.68056 11 2.3 11.3806 2.3 11.85C2.3 12.3194 2.68056 12.7 3.15 12.7ZM5.5 3.15C5.5 2.73579 5.83579 2.4 6.25 2.4H12.25C12.6642 2.4 13 2.73579 13 3.15C13 3.56421 12.6642 3.9 12.25 3.9H6.25C5.83579 3.9 5.5 3.56421 5.5 3.15ZM5.5 7.5C5.5 7.08579 5.83579 6.75 6.25 6.75H12.25C12.6642 6.75 13 7.08579 13 7.5C13 7.91421 12.6642 8.25 12.25 8.25H6.25C5.83579 8.25 5.5 7.91421 5.5 7.5ZM5.5 11.85C5.5 11.4358 5.83579 11.1 6.25 11.1H12.25C12.6642 11.1 13 11.4358 13 11.85C13 12.2642 12.6642 12.6 12.25 12.6H6.25C5.83579 12.6 5.5 12.2642 5.5 11.85Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Button>
          </div>
        </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-3 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Showing <span className="text-slate-900 dark:text-white">{filteredOrders.length}</span> of {orders.length} orders
          </p>
          <Button variant="link" size="sm" className="h-auto p-0 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            Select all
          </Button>
        </div>

        <div className="p-0">
          {/* Mobile Card View (Hidden on medium screens and up) */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => router.push(`/seller/orders/${order.id}`)}
                  className="p-4 flex flex-col gap-3 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{order.id}</span>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{order.customer}</p>
                    </div>
                    <div>{getStatusBadge(order.status)}</div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {order.date.split(',')[0]}</span>
                      <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {order.items}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs px-2")} onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-3.5 w-3.5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "Shipped"); }}>
                          <Truck className="mr-2 h-4 w-4 text-blue-500" />
                          <span>Mark Shipped</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "Refunded"); }}>
                          <RefreshCcw className="mr-2 h-4 w-4 text-amber-500" />
                          <span>Refund Order</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "Cancelled"); }}>
                          <XCircle className="mr-2 h-4 w-4" />
                          <span>Cancel Order</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                No orders found for this status.
              </div>
            )}
          </div>

          {/* Desktop Table View (Hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto mt-0 pt-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => router.push(`/seller/orders/${order.id}`)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{order.id}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{order.customer}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{order.date}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">{order.items} items</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white whitespace-nowrap">${order.total.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 w-8 p-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer")} onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More actions</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "Shipped"); }}>
                                <Truck className="mr-2 h-4 w-4 text-blue-500" />
                                <span>Mark Shipped</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "Refunded"); }}>
                                <RefreshCcw className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Refund Order</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:focus:text-rose-400" onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, "Cancelled"); }}>
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Cancel Order</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      No orders found for this status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
