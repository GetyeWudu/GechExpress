import { OrderDetails } from "@/components/seller/order-details";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <Link href="/seller/orders" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-4 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Order {id}</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Manage fulfillment and review order details.
              </p>
            </div>
            
            <OrderDetails orderId={id} />
          </div>
  );
}
