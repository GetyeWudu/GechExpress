import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDownRight, CheckCircle2, Clock, DollarSign } from "lucide-react";

const COMMISSIONS = [
  { id: "COM-9021", seller: "TechHaven Electronics", orderId: "ORD-902102", amount: 323.99, fee: 48.60, netPayout: 275.39, status: "Paid", date: "Oct 24, 2026" },
  { id: "COM-9020", seller: "Minimalist Desk Co", orderId: "ORD-902099", amount: 145.50, fee: 21.83, netPayout: 123.67, status: "Pending", date: "Oct 22, 2026" },
  { id: "COM-9019", seller: "TechHaven Electronics", orderId: "ORD-901844", amount: 899.00, fee: 134.85, netPayout: 764.15, status: "Pending", date: "Oct 20, 2026" },
];

export function CommissionTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 gap-4 bg-slate-50 dark:bg-slate-900/50">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Platform Commission Splitting</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track order totals, platform fees, and pending payouts to sellers.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Record ID</th>
              <th className="px-6 py-4 font-medium">Seller</th>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium text-right">Order Total</th>
              <th className="px-6 py-4 font-medium text-right text-indigo-600 dark:text-indigo-400">Platform Fee</th>
              <th className="px-6 py-4 font-medium text-right">Seller Payout</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {COMMISSIONS.map((com) => (
              <tr key={com.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white font-mono text-xs">{com.id}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{com.seller}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{com.orderId}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white text-right">${com.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-medium text-right flex items-center justify-end gap-1">
                  <ArrowDownRight className="h-3 w-3" /> ${com.fee.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-slate-900 dark:text-white font-bold text-right">${com.netPayout.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {com.status === "Paid" ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Paid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 gap-1">
                      <Clock className="h-3 w-3" /> Pending
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
