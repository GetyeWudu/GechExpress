import { CustomerTable } from "@/components/admin/customer-table";

export default function AdminCustomersPage() {
  return (
    
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Customer Management</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                View all registered buyers across the entire platform.
              </p>
            </div>
            
            <CustomerTable />
          </div>
        );
}
