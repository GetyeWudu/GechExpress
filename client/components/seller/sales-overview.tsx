"use client";

import { useState } from "react";
import { SalesChart } from "./sales-chart";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function SalesOverview() {
  const [timeRange, setTimeRange] = useState("12m");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total sales and earnings across all products</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === "7d" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              7d
            </button>
            <button 
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === "30d" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              30d
            </button>
            <button 
              onClick={() => setTimeRange("12m")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${timeRange === "12m" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
            >
              12m
            </button>
          </div>
          <Button variant="outline" size="sm" className="h-8 hidden sm:flex gap-2 border-slate-200 dark:border-slate-700">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">Custom</span>
          </Button>
        </div>
      </div>

      <SalesChart />
    </div>
  );
}
