import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@stores/auth'
import { useState } from 'react'

/**
 * Hook to protect actions that require authentication
 * Redirects anonymous users to signup/login with a return URL
 */
export function useAuthProtectedAction() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const [error, setError] = useState<string | null>(null)

  /**
   * Execute a protected action
   * If user is not authenticated, redirects to signup with return URL
   * If user is authenticated, executes the action
   */
  const execute = async (action: () => Promise<void>) => {
    setError(null)

    if (!user) {
      // Store the current product page so we can return after signup
      const returnUrl = location.pathname + location.search
      navigate(`/auth/register?redirect=${encodeURIComponent(returnUrl)}`)
      return
    }

    try {
      await action()
    } catch (error: any) {
      // Handle 401 errors - redirect to login
      if (error.response?.status === 401) {
        const returnUrl = location.pathname + location.search
        navigate(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`)
        throw error
      }

      // Handle 400 errors - likely validation errors
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.attribute_value_ids?.[0] ||
          error.response?.data?.product?.[0] ||
          'This product cannot be added to cart. Please select options on the product page.'
        setError(errorMessage)
        throw error
      }

      throw error
    }
  }

  return { execute, isAuthenticated: !!user, error, setError }
}
