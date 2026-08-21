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
      
      <div className="p-0">
        {/* Mobile Card View (Hidden on medium screens and up) */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
          {TRANSACTIONS.map((trx) => (
            <div key={trx.id} className="p-4 bg-white dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2">
                    {trx.description}
                  </span>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>{trx.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="font-mono text-[10px]">{trx.id}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className={`flex items-center justify-end gap-0.5 font-bold text-sm ${trx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                    {trx.amount > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />}
                    {trx.amount > 0 ? '+' : ''}{trx.amount.toFixed(2)}
                  </div>
                  <div>
                    {trx.status === "Completed" ? (
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 gap-1 h-5 px-1.5 text-[10px]">
                        <CheckCircle2 className="h-2.5 w-2.5" /> Completed
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 gap-1 h-5 px-1.5 text-[10px]">
                        <Clock className="h-2.5 w-2.5" /> Pending
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (Hidden on small screens) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Transaction ID</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Date</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Description</th>
                <th className="px-6 py-3 font-medium whitespace-nowrap">Status</th>
                <th className="px-6 py-3 font-medium text-right whitespace-nowrap">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {TRANSACTIONS.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{trx.id}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{trx.date}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 min-w-[250px]">{trx.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
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
                  <td className="px-6 py-4 text-right font-medium whitespace-nowrap">
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
    </div>
  );
}
