import { ArrowDownRight, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TRANSACTIONS = [
  { id: "TRX-82910", date: "Oct 24, 2026", description: "Payout to Bank Account ending in 4921", amount: -4250.00, status: "Completed", type: "withdrawal" },
  { id: "TRX-82909", date: "Oct 23, 2026", description: "Order #ORD-902102 Settlement", amount: 323.99, status: "Completed", type: "deposit" },
  { id: "TRX-82908", date: "Oct 22, 2026", description: "Order #ORD-902099 Settlement", amount: 145.50, status: "Completed", type: "deposit" },
  { id: "TRX-82907", date: "Oct 21, 2026", description: "Platform Fee (October)", amount: -45.00, status: "Completed", type: "fee" },
  { id: "TRX-82906", date: "Oct 20, 2026", description: "Order #ORD-901844 Settlement", amount: 899.00, status: "Pending", type: "deposit" },
];

export function EarningsTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
        <button className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400">
          View all
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3 font-medium">Transaction ID</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {TRANSACTIONS.map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{trx.id}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{trx.date}</td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{trx.description}</td>
                <td className="px-6 py-4">
                  {trx.status === "Completed" ? (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 gap-1">
                      <Clock className="h-3 w-3" /> Pending
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right font-medium">
                  <div className={`flex items-center justify-end gap-1 ${trx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {trx.amount > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4 text-rose-500" />}
                    {trx.amount > 0 ? '+' : ''}{trx.amount.toFixed(2)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
