import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react'
import { useAuthStore } from '@stores/auth'
import { useCartStore } from '@stores/cart'
import { useCart } from '@api/queries'
import { DesktopNavigation, MobileNavigation } from './Navigation'

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const cartItemCount = useCartStore((state) => state.getItemCount())
  const { data: cartData } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Desktop Header */}
      <div className="hidden md:block">
        {/* Top bar with logo, search, and actions */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 justify-between">
            {/* Logo - fixed width */}
            <Link to="/" className="flex-shrink-0 whitespace-nowrap">
              <span className="text-2xl font-bold text-gray-900">GechExpress</span>
            </Link>

            {/* Search bar - grows to fill space */}
            <form onSubmit={handleSearch} className="flex-1 mx-4 min-w-0">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, or creators..."
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Right actions - fixed width, no shrinking */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                title="Wishlist"
              >
                <Heart size={22} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                title="Cart"
              >
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Account / Sign In */}
              {user ? (
                <Link
                  to="/account"
                  className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                  title="Account"
                >
                  <User size={22} />
                </Link>
              ) : (
                <div className="flex items-center gap-2 whitespace-nowrap">
                  <Link
                    to="/auth/login"
                    className="px-3 py-2 text-sm font-semibold text-orange-600 border-2 border-orange-600 rounded-lg hover:bg-orange-50 transition bg-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-3 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Desktop + Mobile) */}
      <DesktopNavigation />

      {/* Mobile Header */}
      <div className="md:hidden px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="text-lg font-bold text-gray-900">GechExpress</div>
          </Link>

          {/* Search icon and menu toggle */}
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-orange-600">
              <Search size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-orange-600"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
              <Search size={16} className="text-gray-400" />
            </button>
          </div>
        </form>

        {/* Mobile action buttons */}
        <div className="flex items-center gap-2 justify-between">
          <Link to="/wishlist" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-600 hover:text-orange-600">
            <Heart size={16} />
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-600 hover:text-orange-600 relative">
            <ShoppingCart size={16} />
            <span>Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/account" className="flex-1 flex items-center justify-center gap-1 py-2 text-xs text-gray-600 hover:text-orange-600">
              <User size={16} />
              <span>Account</span>
            </Link>
          ) : (
            <div className="flex-1 flex items-center justify-center gap-1">
              <Link to="/auth/login" className="flex-1 px-2 py-2 text-xs font-semibold text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 text-center bg-white">
                Sign In
              </Link>
              <Link to="/auth/register" className="flex-1 px-2 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg text-center">
                Join
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && <MobileNavigation />}
    </header>
  )
}
