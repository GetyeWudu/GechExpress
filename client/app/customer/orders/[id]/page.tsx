import Link from "next/link";
import { use } from "react";
import Image from "next/image";
import { ArrowLeft, Package, Truck, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data
const ORDER = {
  id: "ORD-902102",
  date: "October 24, 2026 at 2:30 PM",
  status: "Delivered",
  paymentMethod: "Visa ending in 4242",
  shippingAddress: {
    name: "John Doe",
    street: "123 Main Street, Apt 4B",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA"
  },
  items: [
    {
      id: "p1",
      name: "Premium Wireless Headphones with Active Noise Cancellation",
      price: 299.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "p2",
      name: "Minimalist Mechanical Keyboard",
      price: 129.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200&auto=format&fit=crop"
    }
  ],
  subtotal: 429.98,
  shipping: 0,
  tax: 34.40,
  total: 464.38
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // Normally we would fetch order details using id
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/customer/orders" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-2 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Order {id}
            </h1>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
              {ORDER.status}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">Placed on {ORDER.date}</p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Invoice
        </Button>
      </div>

      {/* Progress Tracker */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-x-auto">
        <div className="min-w-[600px] flex items-center justify-between relative px-8">
          <div className="absolute left-10 right-10 top-5 h-1 bg-slate-100 dark:bg-slate-800 -z-10">
            <div className="h-full bg-primary w-full" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white border-4 border-white dark:border-slate-950">
              <Package className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Order Placed</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white border-4 border-white dark:border-slate-950">
              <Package className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Processing</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white border-4 border-white dark:border-slate-950">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">Shipped</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white border-4 border-white dark:border-slate-950">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">Delivered</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <h2 className="font-semibold text-slate-900 dark:text-white">Items Ordered</h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {ORDER.items.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.id}`} className="font-medium text-slate-900 dark:text-white hover:underline line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white text-right shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary & Details */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-900 dark:text-white">${ORDER.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-slate-900 dark:text-white">{ORDER.shipping === 0 ? 'Free' : `$${ORDER.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span className="text-slate-900 dark:text-white">${ORDER.tax.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white">
                <span>Total</span>
                <span>${ORDER.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 space-y-6">

            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm">Payment Method</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {ORDER.paymentMethod}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
