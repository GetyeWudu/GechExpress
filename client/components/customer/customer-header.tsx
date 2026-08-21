"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ShoppingBag, ShoppingCart, Heart, Search, Menu, User, LogOut, ChevronDown, ChevronRight, Sun, Moon, Monitor, Home, Grid, PlusCircle, LogIn, Flame } from "lucide-react";
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
  const { theme, setTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  const isHomePage = pathname === "/";
  const headerSolid = isScrolled || !isHomePage;

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
        headerSolid
          ? "bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 border-b border-slate-200 dark:border-slate-800 shadow-sm py-3"
          : "bg-transparent text-slate-50 border-b border-white/15 py-4"
      )}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-12 items-center justify-between gap-4 lg:gap-8">

          {/* LEFT: Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden rounded-full shrink-0 hover:bg-white/10 hover:text-white text-slate-300 transition-colors h-10 w-10")}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50">
                <SheetHeader>
                  <SheetTitle className="text-left flex items-center gap-2 text-slate-900 dark:text-slate-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                      <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <span className="text-lg font-bold tracking-tight">
                      Gech<span className="text-indigo-500 dark:text-indigo-400">Express</span>
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
                      className="pl-9 bg-slate-100 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500/50 h-11"
                    />
                  </form>

                  {/* PROFILE CARD */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                      {isLoggedIn ? (
                        <img src="https://i.pravatar.cc/150?u=gechexpress_user" alt="Avatar" className="h-full w-full object-cover rounded-full" />
                      ) : (
                        <User className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{isLoggedIn ? user?.name || "Welcome Back!" : "Welcome!"}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{isLoggedIn ? "View your account profile" : "Sign in to your account"}</p>
                    </div>
                  </div>

                  {/* APPEARANCE */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">Appearance</h4>
                    <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60">
                      <button type="button" onClick={() => setTheme("light")} className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors", mounted && theme === "light" ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200")}>
                        <Sun className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setTheme("dark")} className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors", mounted && theme === "dark" ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200")}>
                        <Moon className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setTheme("system")} className={cn("flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors", mounted && theme === "system" ? "bg-white text-indigo-600 shadow-sm dark:bg-indigo-500/20 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200")}>
                        <Monitor className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* GET STARTED */}
                  {!isLoggedIn && (
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">Get Started</h4>
                      <div className="flex flex-col gap-1">
                        <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                          <LogIn className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm font-medium">Sign In</span>
                        </Link>
                        <Link href="/register" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                          <PlusCircle className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm font-medium">Create Account</span>
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* QUICK ACCESS */}
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">Quick Access</h4>
                    <div className="flex flex-col gap-1">
                      <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                        <Home className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-medium">Home</span>
                      </Link>
                      <Link href="/products" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                        <Grid className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-medium">All Products</span>
                      </Link>
                      <Link href="/deals" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                        <Flame className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-medium">Flash Deals</span>
                      </Link>
                      <Link href="/cart" className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <span className="text-sm font-medium">Cart</span>
                        </div>
                        {cartItemsCount > 0 && (
                          <span 
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white"
                            style={{ fontFamily: 'system-ui, sans-serif' }}
                          >
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
                          className="flex items-center justify-between px-3 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
                        >
                          <span className="text-sm font-medium">{cat.name}</span>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
                <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl font-extrabold tracking-tight leading-none group-hover:text-indigo-500 transition-colors">
                  Gech<span className="text-indigo-500">Express</span>
                </span>
                <span className={cn("text-[9px] uppercase tracking-wider font-bold mt-1", headerSolid ? "text-slate-500 dark:text-slate-400" : "text-slate-300")}>
                  Your Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation (Moved next to logo) */}
            <div className="hidden xl:flex items-center ml-6">
              <NavigationMenu>
                <NavigationMenuList className="gap-1">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <NavigationMenuItem key={link.href}>
                        <Link 
                          href={link.href}
                          className={cn(
                            "group relative inline-flex h-9 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none duration-300 !bg-transparent hover:!bg-transparent focus:!bg-transparent data-[active]:!bg-transparent",
                            headerSolid 
                              ? (isActive ? "text-indigo-600 dark:text-indigo-500" : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400")
                              : (isActive ? "text-indigo-400" : "text-slate-200 hover:text-white")
                          )}
                        >
                          {link.name}
                        </Link>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          {/* CENTER: Expanded Search Bar */}
          <div className="flex-1 hidden md:flex items-center max-w-3xl px-4 lg:px-8 min-w-0">
            <form onSubmit={handleSearch} className="relative w-full group">
              <Search className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors", headerSolid ? "text-slate-400" : "text-slate-300")} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className={cn(
                  "h-11 w-full rounded-full pl-11 pr-24 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50",
                  headerSolid 
                    ? "bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900"
                    : "bg-white/10 border border-white/20 text-white placeholder:text-slate-300 focus:bg-white/20"
                )}
              />
              <button 
                type="submit"
                className={cn(
                  "absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full text-xs font-bold transition-all flex items-center gap-1.5",
                  headerSolid
                    ? "bg-slate-900 dark:bg-indigo-500 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-indigo-400"
                    : "bg-indigo-500 text-white hover:bg-indigo-400"
                )}
              >
                <Search className="h-3 w-3" />
                Search
              </button>
            </form>
          </div>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">


            <ThemeToggle className={cn("h-9 w-9 rounded-full transition-colors", headerSolid ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-slate-200 hover:bg-white/10 hover:text-white")} />

            {/* Wishlist */}
            <Link href="/wishlist" className={cn("hidden sm:flex h-9 w-9 items-center justify-center rounded-full transition-colors relative group", headerSolid ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-slate-200 hover:bg-white/10 hover:text-white")}>
              <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
            </Link>

            {/* User Account / Sign In */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className={cn("hidden md:flex items-center gap-2 h-9 px-4 rounded-full transition-colors text-sm font-medium shrink-0", headerSolid ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" : "bg-white/15 text-white hover:bg-white/25")}>
                  <User className="h-4 w-4" />
                  <span className="hidden xl:inline max-w-[100px] truncate">{user?.name || "Account"}</span>
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
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer hover:bg-rose-500/10 text-rose-500 focus:bg-rose-500/10 focus:text-rose-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className={cn("hidden md:flex items-center gap-2 h-9 px-4 rounded-full transition-colors text-sm font-medium shrink-0", headerSolid ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700" : "bg-white/15 text-white hover:bg-white/25")}>
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link 
              href="/cart" 
              className={cn(
                "relative flex items-center justify-center h-10 w-10 rounded-full transition-transform hover:scale-105 shadow-sm",
                headerSolid 
                  ? "bg-slate-900 dark:bg-slate-800 text-white" 
                  : "bg-indigo-500 text-white"
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <span 
                  className={cn(
                    "absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ring-2",
                    headerSolid 
                      ? "bg-indigo-500 text-white ring-white dark:ring-slate-950" 
                      : "bg-white text-indigo-600 ring-transparent"
                  )}
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>


      </div>
    </header>
  );
}
