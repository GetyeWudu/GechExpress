import { Edit, MoreHorizontal, Plus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const PRODUCTS = [
  { id: "P1", name: "Premium Wireless Headphones", category: "Electronics", price: 299.99, rating: 4.8, sales: 1420, status: "Active", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop" },
  { id: "P2", name: "Minimalist Mechanical Keyboard", category: "Electronics", price: 129.99, rating: 4.9, sales: 840, status: "Active", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200&auto=format&fit=crop" },
  { id: "P3", name: "Ergonomic Office Chair", category: "Furniture", price: 199.50, rating: 4.5, sales: 320, status: "Draft", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=200&auto=format&fit=crop" },
];

export function ProductTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Product Catalog</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your store's products, pricing, and visibility.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Product Details</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Total Sales</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {PRODUCTS.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white line-clamp-2 max-w-[200px]">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.category}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.sales.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={product.status === "Active" ? "default" : "secondary"} className={product.status === "Active" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"}>
                    {product.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
