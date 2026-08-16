import { CartItem } from "@/components/customer/cart-item";
import { CartSummary } from "@/components/customer/cart-summary";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const MOCK_CART_ITEMS = [
  {
    id: "item_1",
    name: "Premium Wireless Headphones with Active Noise Cancellation",
    slug: "premium-wireless-headphones",
    price: 299.99,
    originalPrice: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    quantity: 1,
    variant: "Black"
  },
  {
    id: "item_2",
    name: "Leather Messenger Bag",
    slug: "leather-messenger-bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    quantity: 2,
  }
];

export default function CartPage() {
  const hasItems = MOCK_CART_ITEMS.length > 0;
  const subtotal = MOCK_CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 20.00; // Mock discount

  if (!hasItems) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-32 flex flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900 mb-6 text-slate-400">
          <ShoppingCart className="h-12 w-12" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your cart is empty</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
          Looks like you haven't added anything to your cart yet. Browse our categories and find something you love.
        </p>
        <Link href="/products" className={buttonVariants({ size: "lg" })}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
        Shopping Cart ({MOCK_CART_ITEMS.length})
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-6">
            {MOCK_CART_ITEMS.map((item) => (
              <CartItem key={item.id} {...item} />
            ))}
          </div>
        </div>
        
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-24">
            <CartSummary 
              subtotal={subtotal} 
              shipping={0} // Free shipping
              tax={subtotal * 0.08} // 8% tax
              discount={discount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
