import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// Note: Price sliders are replaced by numeric inputs below.

const CATEGORIES = [
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "home-living", label: "Home & Living" },
  { id: "beauty", label: "Beauty" },
];

export function ProductFilters() {
  return (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Categories</h3>
        <div className="flex flex-col gap-3">
          {CATEGORIES.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox id={`cat-${category.id}`} />
              <Label htmlFor={`cat-${category.id}`} className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Price Range</h3>
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-xs text-slate-500">Min ($)</Label>
            <input 
              type="number" 
              placeholder="0" 
              className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <Label className="text-xs text-slate-500">Max ($)</Label>
            <input 
              type="number" 
              placeholder="500" 
              className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Availability</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="in-stock" />
            <Label htmlFor="in-stock" className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer">
              In Stock
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="on-sale" />
            <Label htmlFor="on-sale" className="text-sm font-normal text-slate-600 dark:text-slate-400 cursor-pointer">
              On Sale
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
}
