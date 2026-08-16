"use client";

import { Bell, Search, Menu, User, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden -ml-2 text-slate-500">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open sidebar</span>
      </Button>

      {/* Separator for mobile */}
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-4 self-stretch lg:gap-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-slate-900 placeholder:text-slate-400 focus:ring-0 dark:text-white sm:text-sm"
            placeholder="Global search (Sellers, Users, Orders...)"
            type="search"
            name="search"
          />
        </form>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ThemeToggle />
          
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-500 relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500"></span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

          {/* Profile */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="hidden lg:flex lg:flex-col lg:items-start">
              <span className="text-sm font-semibold leading-none text-slate-900 dark:text-white">Super Admin</span>
              <span className="text-xs text-slate-500 mt-1">Global Control</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
