import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export type StockLevel = "in_stock" | "low_stock" | "out_of_stock";

interface StockStatusProps {
  status: StockLevel;
  quantity?: number;
  showText?: boolean;
}

export function StockStatus({ status, quantity, showText = true }: StockStatusProps) {
  const config = {
    in_stock: {
      color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50",
      icon: CheckCircle2,
      text: "In Stock"
    },
    low_stock: {
      color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50",
      icon: AlertCircle,
      text: "Low Stock"
    },
    out_of_stock: {
      color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50",
      icon: XCircle,
      text: "Out of Stock"
    }
  };

  const { color, icon: Icon, text } = config[status];

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border", color)}>
      <Icon className="h-3.5 w-3.5" />
      {showText && (
        <span>
          {text} {quantity !== undefined && `(${quantity})`}
        </span>
      )}
    </div>
  );
}
