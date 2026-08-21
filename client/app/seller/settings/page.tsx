import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Store, CreditCard, Truck, Bell, Image as ImageIcon, MapPin, Building2, Upload } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 dark:opacity-30"></div>
        <div className="relative bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Store className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Profile Settings</h1>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal profile, payout methods, and fulfillment preferences.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList 
          className="bg-slate-100/80 dark:bg-slate-900/50 p-1.5 mb-8 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:flex sm:flex-row w-full sm:w-fit gap-1.5 rounded-xl shadow-sm h-auto"
          style={{ height: 'auto' }}
        >
          <TabsTrigger value="profile" style={{ height: 'auto' }} className="w-full sm:w-auto justify-center gap-2 py-2.5 px-3 sm:px-5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"><Store className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> Profile</TabsTrigger>
          <TabsTrigger value="payouts" style={{ height: 'auto' }} className="w-full sm:w-auto justify-center gap-2 py-2.5 px-3 sm:px-5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"><CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> Payout Details</TabsTrigger>
          <TabsTrigger value="shipping" style={{ height: 'auto' }} className="w-full sm:w-auto justify-center gap-2 py-2.5 px-3 sm:px-5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"><Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> Shipping Zones</TabsTrigger>
          <TabsTrigger value="notifications" style={{ height: 'auto' }} className="w-full sm:w-auto justify-center gap-2 py-2.5 px-3 sm:px-5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all text-xs sm:text-sm"><Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" /> Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          {/* Personal Information Section */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
              <Store className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="firstName" className="text-slate-600 dark:text-slate-300">First Name</Label>
                <Input id="firstName" defaultValue="Abebe" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="lastName" className="text-slate-600 dark:text-slate-300">Last Name</Label>
                <Input id="lastName" defaultValue="Kebede" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-slate-600 dark:text-slate-300">Email Address</Label>
                <Input id="email" type="email" defaultValue="abebe.seller@techhaven.store" disabled className="dark:bg-slate-900/50 focus-visible:ring-indigo-500 opacity-70 cursor-not-allowed" />
                <p className="text-xs text-slate-500">Contact support to change your login email.</p>
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="phone" className="text-slate-600 dark:text-slate-300">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+251 911 234 567" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">Save Personal Info</Button>
            </div>
          </section>

          {/* Business & Legal Documents Section */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
              <Building2 className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Business Details & Documents</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2.5 sm:col-span-2">
                <Label htmlFor="shopFocus" className="text-slate-600 dark:text-slate-300">Shop Focus</Label>
                <Input id="shopFocus" defaultValue="Electronics & Tech Accessories" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
                <p className="text-xs text-slate-500">The primary category of goods your shop sells.</p>
              </div>

              <div className="space-y-2.5">
                <Label className="text-slate-600 dark:text-slate-300">TIN Document</Label>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                      <Upload className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">tin_document_verified.pdf</span>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 ml-4">Update</Button>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label className="text-slate-600 dark:text-slate-300">Business License</Label>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                      <Upload className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">trade_license_2024.pdf</span>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 ml-4">Update</Button>
                </div>
              </div>

              <div className="space-y-2.5 sm:col-span-2">
                <Label className="text-slate-600 dark:text-slate-300">Fayda Document</Label>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/30 max-w-md">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                      <Upload className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">fayda_id_card.jpg</span>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 ml-4">Update</Button>
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
              <CreditCard className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bank Account Details</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="bankName" className="text-slate-600 dark:text-slate-300">Bank Name</Label>
                <Input id="bankName" placeholder="e.g. Chase Bank" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="accountName" className="text-slate-600 dark:text-slate-300">Account Holder Name</Label>
                <Input id="accountName" placeholder="John Doe" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="accountNumber" className="text-slate-600 dark:text-slate-300">Account Number</Label>
                <Input id="accountNumber" type="password" placeholder="••••••••4921" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
              </div>
              <div className="space-y-2.5">
                <Label htmlFor="routingNumber" className="text-slate-600 dark:text-slate-300">Routing Number</Label>
                <Input id="routingNumber" placeholder="123456789" className="dark:bg-slate-900/50 focus-visible:ring-indigo-500" />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20">Update Payment Method</Button>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Shipping Preferences</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="space-y-1">
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">International Shipping</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Allow customers outside your primary country to place orders.</p>
                </div>
                <Switch id="international-shipping" className="data-[state=checked]:bg-indigo-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="space-y-1">
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Free Shipping Threshold</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Offer free shipping when cart total exceeds a specific amount.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <Input type="number" defaultValue="150" className="pl-7 dark:bg-slate-900/50" />
                  </div>
                  <Switch defaultChecked id="free-shipping" className="data-[state=checked]:bg-indigo-500" />
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
              <Bell className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Store Alerts</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="space-y-1">
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">New Orders</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Receive an email immediately when a new order is placed.</p>
                </div>
                <Switch defaultChecked id="alert-orders" className="data-[state=checked]:bg-indigo-500" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="space-y-1">
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Low Inventory</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Get notified when a product's stock falls below 5 items.</p>
                </div>
                <Switch defaultChecked id="alert-inventory" className="data-[state=checked]:bg-indigo-500" />
              </div>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
