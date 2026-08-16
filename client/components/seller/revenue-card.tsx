import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RevenueCardProps {
  title: string;
  amount: string;
  trend: string;
  trendUp: boolean;
}

export function RevenueCard({ title, amount, trend, trendUp }: RevenueCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      <div className="mt-2 flex items-baseline gap-4">
        <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {amount}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-sm">
        <span 
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
            trendUp 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
              : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
          )}
        >
          {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {trend}
        </span>
        <span className="text-slate-500 dark:text-slate-400">vs last month</span>
      </div>
    </div>
  );
}
