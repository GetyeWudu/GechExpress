import { ReportFilters } from "@/components/admin/report-filters";

export default function AdminReportsPage() {
  return (
    
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Platform Reports</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Generate and export detailed data for accounting and analysis.
              </p>
            </div>
            
            <ReportFilters />
            
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Select parameters to generate a report</h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400">Your generated data will appear here.</p>
            </div>
          </div>
        );
}
