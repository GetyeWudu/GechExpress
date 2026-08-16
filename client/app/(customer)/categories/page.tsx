import { CategoryCard } from "@/components/customer/category-card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { id: "1", name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600&auto=format&fit=crop", itemCount: 124 },
  { id: "2", name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=600&auto=format&fit=crop", itemCount: 86 },
  { id: "3", name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1484101403630-f273448c5667?q=80&w=600&auto=format&fit=crop", itemCount: 42 },
  { id: "4", name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop", itemCount: 53 },
  { id: "5", name: "Sports & Outdoors", slug: "sports", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop", itemCount: 78 },
  { id: "6", name: "Books & Media", slug: "books", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=600&auto=format&fit=crop", itemCount: 215 },
  { id: "7", name: "Toys & Games", slug: "toys", image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=600&auto=format&fit=crop", itemCount: 93 },
  { id: "8", name: "Health & Wellness", slug: "health", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop", itemCount: 112 },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Browse our entire collection across various categories to find exactly what you're looking for.
          </p>
        </div>
        
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search categories..." 
            className="pl-11 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-base shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </div>
  );
}
