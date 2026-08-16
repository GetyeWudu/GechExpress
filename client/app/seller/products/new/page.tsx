import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerHeader } from "@/components/seller/seller-header";
import { ProductForm } from "@/components/seller/product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <SellerSidebar />
      <div className="flex flex-1 flex-col lg:pl-64">
        <SellerHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <Link href="/seller/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Add New Product</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Create a new product listing in your store.
              </p>
            </div>
            <ProductForm />
          </div>
        </main>
      </div>
    </div>
  );
}
