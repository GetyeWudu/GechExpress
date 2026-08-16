import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const WISHLIST_ITEMS = [
  {
    id: "p1",
    name: "Premium Wireless Headphones with Active Noise Cancellation",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  },
  {
    id: "p3",
    name: "Smart Fitness Watch Series 7",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    inStock: false,
  },
  {
    id: "p4",
    name: "Leather Messenger Bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    inStock: true,
  }
];

export default function WishlistPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Wishlist</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {WISHLIST_ITEMS.length} items saved
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WISHLIST_ITEMS.map((item) => (
          <div key={item.id} className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 transition-all hover:shadow-md">
            
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/80 text-rose-500 opacity-0 backdrop-blur-sm transition-all hover:bg-white hover:text-rose-600 group-hover:opacity-100 dark:bg-slate-950/80 dark:hover:bg-slate-950"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove from wishlist</span>
              </Button>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <Link href={`/products/${item.id}`} className="hover:underline">
                <h3 className="line-clamp-2 text-sm font-medium text-slate-900 dark:text-white">
                  {item.name}
                </h3>
              </Link>
              
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  ${item.price.toFixed(2)}
                </span>
                <span className={`text-xs font-medium ${item.inStock ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {item.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <Button 
                className="mt-4 w-full" 
                disabled={!item.inStock}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
