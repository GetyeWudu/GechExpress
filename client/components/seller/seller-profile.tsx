"use client";

import { ChevronDown, LogOut, Settings, Store, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SellerProfile() {
  const router = useRouter();
  
  const handleSignOut = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    toast.success("Successfully logged out");
    router.push("/login");
  };

  return (
    <div className="relative flex items-center gap-2 group cursor-pointer">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800">
        GE
      </div>
      <div className="hidden lg:flex lg:items-center">
        <span className="text-sm font-semibold leading-6 text-slate-900 dark:text-white" aria-hidden="true">
          GechExpress Store
        </span>
        <ChevronDown className="ml-2 h-4 w-4 text-slate-400" aria-hidden="true" />
      </div>
      
      {/* Dropdown Menu (Hover for simplicity, or could use standard dropdown UI) */}
      <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-900 dark:ring-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <Link href="/seller/settings" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
          <Settings className="mr-2 h-4 w-4" />
          Profile Settings
        </Link>
        <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
        <button onClick={handleSignOut} className="flex w-full items-center px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
