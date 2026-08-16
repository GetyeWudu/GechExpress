"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, MoreHorizontal, Plus, Tag } from "lucide-react";

const INITIAL_CATEGORIES = [
  { id: "CAT-001", name: "Electronics", slug: "electronics", products: 1245, status: "Active" },
  { id: "CAT-002", name: "Home & Furniture", slug: "home-furniture", products: 840, status: "Active" },
  { id: "CAT-003", name: "Fashion & Apparel", slug: "fashion-apparel", products: 3200, status: "Active" },
  { id: "CAT-004", name: "Seasonal / Holiday", slug: "seasonal", products: 0, status: "Draft" },
];

export function CategoryTable() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySlug, setNewCategorySlug] = useState("");
  const [newCategoryStatus, setNewCategoryStatus] = useState("Draft");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName || !newCategorySlug) return;

    const newCategory = {
      id: `CAT-00${categories.length + 1}`,
      name: newCategoryName,
      slug: newCategorySlug,
      products: 0,
      status: newCategoryStatus,
    };

    setCategories([newCategory, ...categories]);
    setIsDialogOpen(false);
    
    // Reset form
    setNewCategoryName("");
    setNewCategorySlug("");
    setNewCategoryStatus("Draft");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/50 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 gap-4 bg-slate-50 dark:bg-slate-900/50">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white text-lg">Product Categories</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage the global taxonomy that sellers can assign their products to.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={<Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" />}>
            <Plus className="h-4 w-4" />
            Add Category
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-white">Create New Category</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                Add a new category to the platform taxonomy.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Category Name</Label>
                <Input 
                  id="name" 
                  value={newCategoryName} 
                  onChange={(e) => {
                    setNewCategoryName(e.target.value);
                    if (!newCategorySlug || newCategorySlug === newCategoryName.toLowerCase().replace(/\s+/g, '-')) {
                      setNewCategorySlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }} 
                  placeholder="e.g. Health & Beauty" 
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-slate-700 dark:text-slate-300">URL Slug</Label>
                <Input 
                  id="slug" 
                  value={newCategorySlug} 
                  onChange={(e) => setNewCategorySlug(e.target.value)} 
                  placeholder="e.g. health-beauty" 
                  className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-mono text-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-slate-700 dark:text-slate-300">Initial Status</Label>
                <select 
                  id="status" 
                  value={newCategoryStatus}
                  onChange={(e) => setNewCategoryStatus(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-200 dark:border-slate-800">
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Save Category
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-slate-500 dark:bg-slate-950 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Category Name</th>
              <th className="px-6 py-4 font-medium">Slug</th>
              <th className="px-6 py-4 font-medium text-right">Total Products</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 shrink-0">
                      <Tag className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{cat.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4 text-slate-900 dark:text-white font-medium text-right">{cat.products.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={cat.status === "Active" ? "default" : "secondary"} className={cat.status === "Active" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300"}>
                    {cat.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
