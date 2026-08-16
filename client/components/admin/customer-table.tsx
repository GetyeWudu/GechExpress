import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, User, ShieldBan } from "lucide-react";

const CUSTOMERS = [
  { id: "CUS-801", name: "Alex Morgan", email: "alex.m@example.com", joined: "Oct 24, 2026", orders: 12, spent: 1240.50, status: "Active" },
  { id: "CUS-802", name: "Jamie Lane", email: "j.lane@example.com", joined: "Oct 20, 2026", orders: 2, spent: 145.00, status: "Active" },
  { id: "CUS-803", name: "Sam Wilson", email: "samw@example.com", joined: "Sep 15, 2026", orders: 0, spent: 0, status: "Inactive" },
  { id: "CUS-804", name: "Taylor Swift", email: "taylor@example.com", joined: "Aug 10, 2026", orders: 45, spent: 5890.00, status: "Banned" },
];

export function CustomerTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 gap-4 bg-slate-50 dark:bg-slate-900/50">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Platform Customers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Global overview of all registered buyers.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Customer Details</th>
              <th className="px-6 py-4 font-medium">Joined Date</th>
              <th className="px-6 py-4 font-medium">Total Orders</th>
              <th className="px-6 py-4 font-medium">Total Spent</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {CUSTOMERS.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white block">{customer.name}</span>
                      <span className="text-xs text-slate-500">{customer.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{customer.joined}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{customer.orders}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">${customer.spent.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {customer.status === "Active" && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">Active</Badge>}
                  {customer.status === "Inactive" && <Badge variant="outline" className="text-slate-500 dark:text-slate-400">Inactive</Badge>}
                  {customer.status === "Banned" && <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 gap-1"><ShieldBan className="h-3 w-3" /> Banned</Badge>}
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
  );
}
