import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 border-b border-slate-200 pb-8 dark:border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Checkout
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1 space-y-10">
          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">1. Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
          </section>

          <Separator className="dark:bg-slate-800" />

          {/* Shipping Method */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">2. Shipping Method</h2>
            <RadioGroup defaultValue="standard" className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <RadioGroupItem value="standard" id="standard" className="peer sr-only" />
                <Label
                  htmlFor="standard"
                  className="flex flex-col rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 cursor-pointer"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">Standard Delivery</span>
                  <span className="text-sm text-slate-500 mt-1">3-5 business days</span>
                  <span className="font-semibold text-slate-900 dark:text-white mt-2">Free</span>
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="express" id="express" className="peer sr-only" />
                <Label
                  htmlFor="express"
                  className="flex flex-col rounded-xl border-2 border-slate-200 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 cursor-pointer"
                >
                  <span className="font-semibold text-slate-900 dark:text-white">Express Delivery</span>
                  <span className="text-sm text-slate-500 mt-1">1-2 business days</span>
                  <span className="font-semibold text-slate-900 dark:text-white mt-2">$15.00</span>
                </Label>
              </div>
            </RadioGroup>
          </section>

          <Separator className="dark:bg-slate-800" />

          {/* Payment Method */}
          <section>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">3. Payment Method</h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Credit Card
                </div>
                <div className="flex gap-1">
                  {/* Fake card icons */}
                  <div className="h-6 w-10 rounded bg-blue-600"></div>
                  <div className="h-6 w-10 rounded bg-red-500"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <aside className="w-full lg:w-[400px] shrink-0">
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Order Summary</h2>
            
            {/* Items */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 rounded bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <Image 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200&auto=format&fit=crop" 
                    fill 
                    className="object-cover" 
                    alt="Product" 
                  />
                  <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-slate-500 text-[10px] font-bold text-white flex items-center justify-center">1</div>
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <span className="text-sm font-medium line-clamp-2">Premium Wireless Headphones</span>
                  <span className="text-sm text-slate-500 mt-1">$299.99</span>
                </div>
              </div>
            </div>

            <Separator className="my-4 dark:bg-slate-800" />
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span className="text-slate-900 dark:text-white font-medium">$299.99</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-slate-900 dark:text-white font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Tax</span>
                <span className="text-slate-900 dark:text-white font-medium">$24.00</span>
              </div>
            </div>
            
            <Separator className="my-4 dark:bg-slate-800" />
            
            <div className="flex justify-between font-bold text-xl text-slate-900 dark:text-white mb-6">
              <span>Total</span>
              <span>$323.99</span>
            </div>
            
            <Button size="lg" className="w-full text-base font-semibold h-12 gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Place Order
            </Button>
            <p className="text-xs text-center text-slate-500 mt-4">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
