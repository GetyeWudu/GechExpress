import { ReactNode } from "react";
import { CustomerHeader } from "@/components/customer/customer-header";
import { CustomerSidebar } from "@/components/customer/customer-sidebar";
import { Footer } from "@/components/shared/footer";

export default function CustomerDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <CustomerHeader />
      
      <div className="container mx-auto px-4 py-8 md:py-12 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          <CustomerSidebar />
          
          {/* Main Content */}
          <main className="flex-1">
            <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950 min-h-[500px]">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
