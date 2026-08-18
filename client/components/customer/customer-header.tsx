"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, ShoppingCart, Heart, Search, Menu, User, LogOut, ChevronDown, ChevronRight, Sun, Moon, Monitor, Home, Grid, PlusCircle, LogIn } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { 
    name: "Shop", 
    href: "/products",
    subItems: [
      { name: "All Products", href: "/products" },
      { name: "New Arrivals", href: "/products?sort=new" },
      { name: "Trending", href: "/products?sort=trending" },
    ]
  },
  { 
    name: "Categories", 
    href: "/categories",
    subItems: [
      { name: "Electronics", href: "/categories/electronics" },
      { name: "Fashion", href: "/categories/fashion" },
      { name: "Home & Living", href: "/categories/home-living" },
      { name: "Beauty", href: "/categories/beauty" },
    ]
  },
  { name: "Deals", href: "/deals" },
];

export function CustomerHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);

  const toggleMobileMenu = (menu: string) => {
    setOpenMobileMenu(openMobileMenu === menu ? null : menu);
  };

  const { getTotalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const cartItemsCount = mounted ? getTotalItems() : 0;
  const wishlistCount = mounted ? wishlistItems.length : 0;

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userStr));
      } catch (e) { }
    } else {
      setIsLoggedIn(!!localStorage.getItem("userAuth"));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/");
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 ease-in-out text-slate-50",
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-slate-900/10 py-2"
          : "bg-gradient-to-b from-slate-950/80 to-slate-950/20 backdrop-blur-sm border-b border-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-6">

          {/* LEFT: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden rounded-full shrink-0 hover:bg-white/10 hover:text-white text-slate-300 transition-colors h-10 w-10")}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-slate-950 border-r border-slate-800 text-slate-50">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2 text-slate-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                      <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                      Gech<span className="text-indigo-400">Express</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 mt-6 pb-6 overflow-y-auto max-h-[85vh] scrollbar-none">
                  {/* SEARCH */}
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="pl-9 bg-slate-900/50 border-slate-800 rounded-xl text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500/50 h-11"
                    />
                  </form>

                  {/* PROFILE CARD */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                      {isLoggedIn ? (
                        <img src="https://i.pravatar.cc/150?u=gechexpress_user" alt="Avatar" className="h-full w-full object-cover rounded-full" />
                      ) : (
                        <User className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100">{isLoggedIn ? user?.name || "Welcome Back!" : "Welcome!"}</h4>
                      <p className="text-xs text-slate-400">{isLoggedIn ? "View your account profile" : "Sign in to your account"}</p>
                    </div>
                  </div>

                  {/* APPEARANCE */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">Appearance</h4>
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-900/40 border border-slate-800/60">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                        <Sun className="h-4 w-4" />
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-slate-200">
                        <Moon className="h-4 w-4" />
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-slate-400 hover:text-slate-200">
                        <Monitor className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* GET STARTED */}
                  {!isLoggedIn && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">Get Started</h4>
                      <div className="flex flex-col gap-1">
                        <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900/60 transition-colors">
                          <LogIn className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">Sign In</span>
                        </Link>
                        <Link href="/register" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900/60 transition-colors">
                          <PlusCircle className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">Create Account</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* QUICK ACCESS */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">Quick Access</h4>
                    <div className="flex flex-col gap-1">
                      <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900/60 transition-colors">
                        <Home className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium">Home</span>
                      </Link>
                      <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900/60 transition-colors">
                        <Grid className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium">All Products</span>
                      </Link>
                      <Link href="/cart" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-medium">Cart</span>
                        </div>
                        {cartItemsCount > 0 && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                            {cartItemsCount}
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* SHOP CATEGORIES */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">Shop Categories</h4>
                    <div className="flex flex-col gap-1">
                      {NAV_LINKS.find(l => l.name === "Categories")?.subItems?.map((cat) => (
                        <Link 
                          key={cat.name} 
                          href={cat.href} 
                          className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-300 hover:bg-slate-900/60 transition-colors group"
                        >
                          <span className="text-sm font-medium">{cat.name}</span>
                          <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="hidden sm:block text-xl font-extrabold tracking-tight text-slate-50 group-hover:text-indigo-400 transition-colors">
                Gech<span className="text-indigo-400 font-medium">Express</span>
              </span>
            </Link>
          </div>

          {/* CENTER: Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <NavigationMenuItem key={link.href}>
                      <Link 
                        href={link.href}
                        className={cn(
                          "group relative inline-flex h-10 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors hover:text-white focus:text-white focus:outline-none data-[active]:text-white duration-300 !bg-transparent hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent",
                          isActive ? "text-white" : "text-slate-300"
                        )}
                        data-active={isActive ? "" : undefined}
                      >
                        {link.name}
                        {/* Animated underline */}
                        <span
                          className={cn(
                            "absolute inset-x-4 -bottom-[1px] h-[2px] rounded-t-full transition-all duration-300 ease-out origin-center",
                            isActive
                              ? "bg-indigo-500 shadow-[0_-2px_10px_rgba(99,102,241,0.5)] scale-x-100"
                              : "bg-white/40 scale-x-0 opacity-0 group-hover:opacity-100 group-hover:scale-x-100"
                          )}
                        />
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center relative mr-2 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="h-10 w-[200px] lg:w-[260px] rounded-full bg-white/5 border border-white/10 pl-11 pr-4 text-sm text-slate-100 outline-none transition-all duration-300 focus:w-[240px] lg:focus:w-[320px] hover:bg-white/10 focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 placeholder:text-slate-400"
              />
            </form>

            {/* Search - Mobile */}
            <button className="md:hidden flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              <Search className="h-4 w-4" />
            </button>

            <ThemeToggle className="text-slate-300 hover:text-white hover:bg-white/10 h-10 w-10" />

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors relative group">
              <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
            </Link>

            {/* User Account / Avatar */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-10 w-10 items-center justify-center rounded-full shrink-0 transition-colors border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:ring-2 hover:ring-white/20 overflow-hidden ml-1">
                  <img src="https://i.pravatar.cc/150?u=gechexpress_user" alt="User Avatar" className="h-full w-full object-cover" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-slate-950/95 backdrop-blur-xl border-slate-800 text-slate-200 shadow-xl">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    {user?.role === "ADMIN" ? (
                      <DropdownMenuItem onClick={() => router.push("/admin")} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                        <User className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    ) : user?.role === "SELLER" ? (
                      <DropdownMenuItem onClick={() => router.push("/seller")} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                        <User className="mr-2 h-4 w-4" />
                        <span>Seller Dashboard</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => router.push("/customer/settings")} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push("/customer/orders")} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-rose-500/10 text-rose-400 focus:bg-rose-500/10 focus:text-rose-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="flex items-center gap-2 h-10 px-4 ml-1 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/15 hover:border-white/20 transition-all text-sm font-medium shrink-0 shadow-sm backdrop-blur-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link href="/cart" className="ml-2 flex items-center justify-center h-10 px-5 gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:-translate-y-0.5">
              <ShoppingCart className="h-4 w-4" />
              <span className="font-semibold text-sm">{cartItemsCount}</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
