import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { CustomerTable } from "@/components/admin/customer-table";

export default function AdminCustomersPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Customer Management</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                View all registered buyers across the entire platform.
              </p>
            </div>
            
            <CustomerTable />
          </div>
        </main>
      </div>
    </div>
  );
}
