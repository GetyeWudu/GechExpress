import { CategoryTable } from "@/components/admin/category-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AdminCategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Categories & Inventory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage product categories, track inventory alerts, and organize the catalog.
          </p>
        </div>
        
        <Sheet>
          <SheetTrigger render={
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          } />
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Create New Category</SheetTitle>
              <SheetDescription>
                Add a new top-level category to the GechExpress catalog.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category Name</label>
                <Input placeholder="e.g. Electronics" className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                <Input placeholder="e.g. electronics" className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <Textarea placeholder="Brief description of the category..." className="w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 resize-none h-24" />
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Category
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <CategoryTable />
    </div>
  );
}
