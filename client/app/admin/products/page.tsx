import { ProductTable } from "@/components/admin/product-table";

export default function AdminProductsPage() {
  return (
    
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Global Product Catalog</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                View and moderate all products listed by sellers.
              </p>
            </div>
            
            <ProductTable />
          </div>
        );
}
