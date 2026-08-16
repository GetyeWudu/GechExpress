"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Tag } from "lucide-react";

export function PromotionForm() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Promotion Details</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="promoName">Promotion Name</Label>
              <Input id="promoName" placeholder="e.g. Summer Sale 2026" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="promoCode">Discount Code (Optional)</Label>
              <div className="relative">
                <Tag className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input id="promoCode" placeholder="SUMMER26" className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 uppercase" />
              </div>
              <p className="text-xs text-slate-500">Customers will need to enter this code at checkout. Leave blank for an automatic discount.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Discount Configuration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <select 
                id="discountType" 
                className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input id="discountValue" type="number" placeholder="20" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Schedule</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input id="startDate" type="date" className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <Input id="endDate" type="date" className="pl-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="radio" id="promo-active" name="promoStatus" defaultChecked className="text-indigo-600" />
              <Label htmlFor="promo-active">Active</Label>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" id="promo-draft" name="promoStatus" className="text-indigo-600" />
              <Label htmlFor="promo-draft">Draft</Label>
            </div>
          </div>
          
          <div className="mt-8">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Save Promotion</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
