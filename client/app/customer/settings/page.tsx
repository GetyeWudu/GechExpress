import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Lock, Bell, AlertTriangle, ShieldCheck, Mail, Phone, Fingerprint } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 dark:opacity-30"></div>
        <div className="relative bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal information, security preferences, and notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
          <Fingerprint className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="firstName" className="text-slate-600 dark:text-slate-300">First Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="firstName" defaultValue="Mock" className="pl-9 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500" />
            </div>
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="lastName" className="text-slate-600 dark:text-slate-300">Last Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="lastName" defaultValue="User" className="pl-9 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500" />
            </div>
          </div>
          <div className="space-y-2.5 sm:col-span-2">
            <Label htmlFor="email" className="text-slate-600 dark:text-slate-300">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="email" type="email" defaultValue="customer@gechexpress.com" disabled className="pl-9 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed opacity-70" />
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              Verified email address. Contact support to change it.
            </p>
          </div>
          <div className="space-y-2.5 sm:col-span-2">
            <Label htmlFor="phone" className="text-slate-600 dark:text-slate-300">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="pl-9 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5">Save Changes</Button>
        </div>
      </section>

      {/* Password Changes */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
          <Lock className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security & Password</h2>
        </div>
        
        <div className="p-6 space-y-5 max-w-md">
          <div className="space-y-2.5">
            <Label htmlFor="currentPassword" className="text-slate-600 dark:text-slate-300">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="••••••••" className="dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500" />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="newPassword" className="text-slate-600 dark:text-slate-300">New Password</Label>
            <Input id="newPassword" type="password" placeholder="••••••••" className="dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500" />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="confirmPassword" className="text-slate-600 dark:text-slate-300">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" placeholder="••••••••" className="dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20 flex justify-end">
          <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-500/30 dark:text-indigo-400 dark:hover:bg-indigo-500/10">Update Password</Button>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-xl shadow-sm dark:border-slate-800/60 dark:bg-slate-950/50">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-900/20">
          <Bell className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</h2>
        </div>
        
        <div className="p-6 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Order Updates</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications about your order status, shipping, and delivery.</p>
            </div>
            <Switch defaultChecked id="order-updates" className="data-[state=checked]:bg-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-slate-900 dark:text-slate-200">Promotions & Offers</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive emails about new products, sales, and exclusive offers.</p>
            </div>
            <Switch id="promo-offers" className="data-[state=checked]:bg-indigo-500" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30 opacity-70">
            <div className="space-y-1">
              <Label className="text-base font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
                Security Alerts <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Get notified about suspicious activity or logins. (Always on)</p>
            </div>
            <Switch defaultChecked disabled id="security-alerts" className="data-[state=checked]:bg-indigo-500" />
          </div>
        </div>
      </section>
      
      {/* Danger Zone */}
      <section className="relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/30 backdrop-blur-xl shadow-sm dark:border-rose-900/30 dark:bg-rose-950/10 mt-8">
        <div className="px-6 py-5 border-b border-rose-100 dark:border-rose-900/40 flex items-center gap-3 bg-rose-50/80 dark:bg-rose-900/20">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          <h2 className="text-lg font-semibold text-rose-600 dark:text-rose-500">Danger Zone</h2>
        </div>
        
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-200">Delete Account</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive" className="shrink-0 bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-500/20">
            Delete Account
          </Button>
        </div>
      </section>
      
    </div>
  );
}
