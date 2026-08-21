import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Shield, Globe, Terminal, Key, ShieldAlert } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    
          <div className="mx-auto max-w-5xl space-y-8 pb-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-500 to-slate-600 rounded-lg blur opacity-20 dark:opacity-30"></div>
              <div className="relative bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white shadow-lg shadow-slate-500/20 shrink-0">
                  <Settings className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Global Settings</h1>
                  <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                    Manage platform configurations, security policies, and third-party integrations.
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="platform" className="w-full">
              <TabsList 
                className="bg-slate-100/80 dark:bg-slate-900/50 p-1.5 mb-8 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row w-full sm:w-fit gap-1.5 rounded-xl shadow-sm h-auto"
                style={{ height: 'auto' }}
              >
                <TabsTrigger value="platform" style={{ height: 'auto' }} className="w-full sm:w-auto justify-center gap-2 py-3 sm:py-2.5 px-4 sm:px-5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all"><Globe className="h-4 w-4 shrink-0" /> Platform Settings</TabsTrigger>
                <TabsTrigger value="security" style={{ height: 'auto' }} className="w-full sm:w-auto justify-center gap-2 py-3 sm:py-2.5 px-4 sm:px-5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all"><Shield className="h-4 w-4 shrink-0" /> Security & Access</TabsTrigger>
                <TabsTrigger value="integrations" style={{ height: 'auto' }} className="w-full sm:w-auto justify-center gap-2 py-3 sm:py-2.5 px-4 sm:px-5 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all"><Terminal className="h-4 w-4 shrink-0" /> Integrations</TabsTrigger>
              </TabsList>

              <TabsContent value="platform" className="space-y-6">
                <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                    <Globe className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Platform Configuration</h2>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-2.5">
                      <Label htmlFor="siteName" className="text-slate-600 dark:text-slate-300">Site Name</Label>
                      <Input id="siteName" defaultValue="GechExpress Platform" className="dark:bg-slate-900/50 focus-visible:ring-slate-500" />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="supportEmail" className="text-slate-600 dark:text-slate-300">Global Support Email</Label>
                      <Input id="supportEmail" type="email" defaultValue="admin@gechexpress.com" className="dark:bg-slate-900/50 focus-visible:ring-slate-500" />
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="baseCommission" className="text-slate-600 dark:text-slate-300">Base Commission Rate (%)</Label>
                      <Input id="baseCommission" type="number" defaultValue="5.0" className="dark:bg-slate-900/50 focus-visible:ring-slate-500" />
                      <p className="text-xs text-slate-500">Default cut taken from all seller transactions.</p>
                    </div>
                    <div className="space-y-2.5">
                      <Label htmlFor="currency" className="text-slate-600 dark:text-slate-300">Default Currency</Label>
                      <Input id="currency" defaultValue="USD ($)" disabled className="dark:bg-slate-900/50 cursor-not-allowed opacity-70" />
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-rose-100 bg-rose-50/30 dark:border-rose-900/30 dark:bg-rose-950/20">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold text-rose-600 dark:text-rose-500">Maintenance Mode</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">Take the storefront offline for maintenance. Only Admins will be able to access the site.</p>
                      </div>
                      <Switch id="maintenance-mode" className="data-[state=checked]:bg-rose-500" />
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-md">Save Configuration</Button>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                    <ShieldAlert className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security Policies</h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Enforce Seller 2FA</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Require all verified sellers to enable Two-Factor Authentication.</p>
                      </div>
                      <Switch defaultChecked id="enforce-seller-2fa" className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
                      <div className="space-y-1">
                        <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Strict Password Requirements</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Force passwords to have 12+ chars, special characters, and numbers.</p>
                      </div>
                      <Switch defaultChecked id="strict-passwords" className="data-[state=checked]:bg-slate-900 dark:data-[state=checked]:bg-slate-100" />
                    </div>
                  </div>
                </section>
              </TabsContent>

              <TabsContent value="integrations" className="space-y-6">
                <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
                  <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                    <Key className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">API Keys & Services</h2>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="space-y-4 p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-semibold text-slate-900 dark:text-white">Stripe Payment Gateway</Label>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Manage transaction processing keys.</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">Test Connection</Button>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="stripeSecret" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Secret Key</Label>
                        <Input id="stripeSecret" type="password" defaultValue="sk_test_1234567890abcdef" className="font-mono text-sm dark:bg-slate-950" />
                      </div>
                    </div>

                    <div className="space-y-4 p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/30 dark:bg-slate-900/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-base font-semibold text-slate-900 dark:text-white">SendGrid Email Service</Label>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Configure transactional email dispatch.</p>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">Test Connection</Button>
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="sendgridKey" className="text-xs font-semibold uppercase tracking-wider text-slate-500">API Key</Label>
                        <Input id="sendgridKey" type="password" defaultValue="SG.mock.123456789" className="font-mono text-sm dark:bg-slate-950" />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-md">Update Keys</Button>
                  </div>
                </section>
              </TabsContent>
            </Tabs>
          </div>
        );
}
