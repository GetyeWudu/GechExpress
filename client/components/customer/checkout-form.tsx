"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Truck, ShieldCheck, Smartphone, Landmark, Banknote, MapPin, Phone } from "lucide-react";

export function CheckoutForm() {
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [paymentMethod, setPaymentMethod] = useState<"telebirr" | "cbebirr" | "chapa" | "cod">("chapa");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate backend API call to initialize Chapa payment
    setTimeout(() => {
      // Redirect to the simulated external payment gateway
      window.location.href = "/checkout/payment";
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">


      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        {step === "shipping" ? (
          <div>
            <div className="bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Shipping Information</h2>
            </div>
            
            <form onSubmit={handleShippingSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone Number (Required for Delivery)</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input id="phone" type="tel" placeholder="+251 900 000 000" required className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region / City</Label>
                  <div className="relative">
                    <select 
                      id="region"
                      required
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                    >
                      <option value="">Select Region</option>
                      <option value="addis-ababa">Addis Ababa</option>
                      <option value="oromia">Oromia</option>
                      <option value="amhara">Amhara</option>
                      <option value="sidama">Sidama</option>
                      <option value="dire-dawa">Dire Dawa</option>
                      <option value="other">Other Region</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcity">Sub-city / Kifle Ketema</Label>
                  <Input id="subcity" placeholder="e.g. Bole, Kirkos" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="kebele">Kebele / Neighborhood / Specific Location</Label>
                  <Input id="kebele" placeholder="e.g. Kebele 04, Next to Atlas Hotel" required className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Continue to Payment
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold">Payment Method</h2>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 sm:p-8 space-y-6">
              
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Telebirr */}
                <label className="cursor-not-allowed rounded-xl border-2 p-4 flex flex-col gap-3 transition-all border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="telebirr"
                      disabled
                      className="h-4 w-4 text-slate-400" 
                    />
                    <Smartphone className="h-5 w-5 text-slate-500" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Telebirr</span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold uppercase">Coming Soon</span>
                    </div>
                  </div>
                </label>

                {/* CBE Birr */}
                <label className="cursor-not-allowed rounded-xl border-2 p-4 flex flex-col gap-3 transition-all border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cbebirr"
                      disabled
                      className="h-4 w-4 text-slate-400" 
                    />
                    <Landmark className="h-5 w-5 text-slate-500" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">CBE Birr</span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold uppercase">Coming Soon</span>
                    </div>
                  </div>
                </label>

                {/* Chapa / Card */}
                <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col gap-3 transition-all ${paymentMethod === "chapa" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10" : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900"}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="chapa"
                      checked={paymentMethod === "chapa"}
                      onChange={() => setPaymentMethod("chapa")}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" 
                    />
                    <CreditCard className={`h-5 w-5 ${paymentMethod === "chapa" ? "text-indigo-600" : "text-slate-500"}`} />
                    <span className="font-semibold text-slate-900 dark:text-white">Chapa (Cards/Banks)</span>
                  </div>
                  {paymentMethod === "chapa" && (
                    <div className="pl-7 mt-2">
                      <p className="text-xs text-slate-600 dark:text-slate-400">You will be securely redirected to Chapa to complete your payment using Awash, BOA, or standard Bank Cards.</p>
                    </div>
                  )}
                </label>

                {/* Cash on Delivery */}
                <label className="cursor-not-allowed rounded-xl border-2 p-4 flex flex-col gap-3 transition-all border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 opacity-60">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod"
                      disabled
                      className="h-4 w-4 text-slate-400" 
                    />
                    <Banknote className="h-5 w-5 text-slate-500" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Cash on Delivery</span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold uppercase">Coming Soon</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setStep("shipping")} className="text-slate-500 hover:text-slate-800" disabled={isProcessing}>
                  &larr; Back to Shipping
                </Button>
                <Button type="submit" size="lg" disabled={isProcessing} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 min-w-[160px]">
                  {isProcessing ? (
                    <div className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {isProcessing ? "Redirecting..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
