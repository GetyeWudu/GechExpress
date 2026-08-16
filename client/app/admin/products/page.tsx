import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { ProductTable } from "@/components/admin/product-table";

export default function AdminProductsPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Global Product Catalog</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                View and moderate all products listed by sellers.
              </p>
            </div>
            
            <ProductTable />
          </div>
        </main>
      </div>
    </div>
  );
}
