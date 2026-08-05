import { Link, useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useAuthStore } from '@stores/auth'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <footer className="bg-accent text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">GechExpress</h3>
            <p className="text-gray-300 text-sm mb-4">
              Discover unique products from independent sellers worldwide.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/1" className="hover:text-white transition">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white transition">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-semibold mb-4">
              {user ? 'My Account' : 'Account'}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {user ? (
                <>
                  <li>
                    <Link to="/account" className="hover:text-white transition">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/orders" className="hover:text-white transition">
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link to="/wishlist" className="hover:text-white transition">
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link to="/cart" className="hover:text-white transition">
                      Cart
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/auth/login" className="hover:text-white transition">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth/register" className="hover:text-white transition">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:support@getchexpress.com" className="hover:text-white transition">
                  support@getchexpress.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-0.5 flex-shrink-0" />
                <a href="tel:+251911234567" className="hover:text-white transition">
                  +251 911 234 567
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
              {user && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent p-0 text-gray-300 hover:text-white transition"
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>&copy; {currentYear} GechExpress. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
