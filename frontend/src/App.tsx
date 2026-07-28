import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiClient } from '@api/client'
import { AuthContext, useAuthStore } from '@stores/auth'
import Layout from '@components/Layout/Layout'
import ToastContainer from '@components/Toast/ToastContainer'
import HomePage from '@pages/HomePage'
import SearchResultsPage from '@pages/SearchResultsPage'
import CategoryPage from '@pages/CategoryPage'
import ProductDetailPage from '@pages/ProductDetailPage'
import CartPage from '@pages/CartPage'
import CheckoutPage from '@pages/CheckoutPage'
import OrdersPage from '@pages/OrdersPage'
import WishlistPage from '@pages/WishlistPage'
import LoginPage from '@pages/auth/LoginPage'
import RegisterPage from '@pages/auth/RegisterPage'
import AccountPage from '@pages/AccountPage'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const { user, hydrateFromStorage } = useAuthStore()

  useEffect(() => {
    // Hydrate auth state from localStorage on app startup
    hydrateFromStorage()
    setIsLoading(false)
  }, [hydrateFromStorage])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-accent">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/category/:parentSlug/:childSlug" element={<CategoryPage />} />
          <Route
            path="/category/:parentSlug/:childSlug/:grandChildSlug"
            element={<CategoryPage />}
          />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Protected routes */}
        {user ? (
          <>
            <Route element={<Layout />}>
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </>
        ) : (
          <>
            <Route path="/checkout" element={<Navigate to="/auth/login?redirect=/checkout" />} />
            <Route path="/orders" element={<Navigate to="/auth/login?redirect=/orders" />} />
            <Route path="/account" element={<Navigate to="/auth/login?redirect=/account" />} />
          </>
        )}

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  )
}

export default App
