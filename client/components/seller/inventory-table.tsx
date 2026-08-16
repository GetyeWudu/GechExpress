import { StockStatus, StockLevel } from "./stock-status";
import { Button } from "@/components/ui/button";
import { Edit, RefreshCw } from "lucide-react";
import Image from "next/image";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  stockLevel: StockLevel;
  quantity: number;
  lastUpdated: string;
}

const INVENTORY: InventoryItem[] = [
  { id: "P1", sku: "SKU-9012", name: "Premium Wireless Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop", price: 299.99, stockLevel: "in_stock", quantity: 145, lastUpdated: "2 hours ago" },
  { id: "P2", sku: "SKU-9013", name: "Minimalist Mechanical Keyboard", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200&auto=format&fit=crop", price: 129.99, stockLevel: "low_stock", quantity: 8, lastUpdated: "1 day ago" },
  { id: "P3", sku: "SKU-9014", name: "Ergonomic Office Chair", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=200&auto=format&fit=crop", price: 199.50, stockLevel: "out_of_stock", quantity: 0, lastUpdated: "3 days ago" },
];

export function InventoryTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Inventory Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track and update your product stock levels.</p>
        </div>
        <Button variant="outline" className="gap-2 border-slate-200 dark:border-slate-700">
          <RefreshCw className="h-4 w-4" />
          Sync Inventory
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">SKU</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Stock Status</th>
              <th className="px-6 py-4 font-medium">Last Updated</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {INVENTORY.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white line-clamp-2 max-w-[200px]">
                      {item.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{item.sku}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <StockStatus status={item.stockLevel} quantity={item.quantity} />
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.lastUpdated}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit stock</span>
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
