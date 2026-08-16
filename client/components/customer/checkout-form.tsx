"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Truck, ShieldCheck } from "lucide-react";
import { AddressForm } from "./address-form";

export function CheckoutForm() {
  const [step, setStep] = useState<"shipping" | "payment">("shipping");

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would process payment and redirect to success
    window.location.href = "/customer/orders";
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex items-center ${step === "shipping" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === "shipping" ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-300 dark:border-slate-700"} font-bold`}>
            1
          </div>
          <span className="ml-2 font-medium">Contact</span>
        </div>
        <div className="mx-4 h-[2px] w-12 bg-slate-200 dark:bg-slate-800"></div>
        <div className={`flex items-center ${step === "payment" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500"}`}>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === "payment" ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-300 dark:border-slate-700"} font-bold`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-8">
        {step === "shipping" ? (
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Truck className="h-6 w-6 text-indigo-500" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact Information</h2>
            </div>
            
            <form onSubmit={handleShippingSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input type="email" id="email" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8">
                  Continue to Payment
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <CreditCard className="h-6 w-6 text-indigo-500" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Payment Details</h2>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-3 mb-4">
                  <input type="radio" id="card" name="paymentMethod" defaultChecked className="h-4 w-4 text-indigo-600" />
                  <Label htmlFor="card" className="font-medium text-slate-900 dark:text-white">Credit Card</Label>
                </div>
                
                <div className="space-y-4 pl-7">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="bg-white dark:bg-slate-950" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="bg-white dark:bg-slate-950" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" className="bg-white dark:bg-slate-950" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setStep("shipping")}>
                  &larr; Back to Contact
                </Button>
                <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Place Order
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
