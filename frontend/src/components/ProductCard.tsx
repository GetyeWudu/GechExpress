import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, AlertCircle } from 'lucide-react'
import { Product } from '@types/index'
import { useAddToCart } from '@api/queries'
import { useWishlistStore } from '@stores/wishlist'
import { useAddToWishlist, useRemoveFromWishlist } from '@api/queries'
import { useState } from 'react'
import { useAuthProtectedAction } from '@hooks/useAuthProtectedAction'
import { useToast } from '@hooks/useToast'
import {
  formatPrice,
  getProductCardImage,
  getProductCardPrice,
  getProductDetailUrl,
  getSelectableAttributeGroups,
} from '@utils/product'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductCardImage(product)
  const { price, currency } = getProductCardPrice(product)
  const rating = product.rating || 0
  const reviewCount = product.review_count || 0
  const productId = product.id

  const addToCart = useAddToCart()
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(productId))
  const [isLoadingCart, setIsLoadingCart] = useState(false)
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)
  const { execute: executeProtectedAction } = useAuthProtectedAction()
  const toast = useToast()

  // Check if product has required attributes/variants
  const attributeGroups = getSelectableAttributeGroups(product)
  const hasRequiredAttributes = attributeGroups.length > 0

  // Check if product is in stock
  const isInStock = product.is_in_stock !== false

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!productId) return

    setCartError(null)

    // Check if product is out of stock
    if (!isInStock) {
      setCartError('This product is currently out of stock.')
      return
    }

    // If product has required attributes, redirect to detail page
    if (hasRequiredAttributes) {
      window.location.href = getProductDetailUrl(product)
      return
    }

    await executeProtectedAction(async () => {
      setIsLoadingCart(true)
      try {
        // For simple products without variants
        await addToCart.mutateAsync({
          product: productId,
          quantity: 1,
          attribute_value_ids: [],
        })
        toast.success(`${product.name} added to cart!`)
      } catch (error: any) {
        // Handle specific backend errors
        if (error.response?.status === 400) {
          const errorMessage =
            error.response?.data?.detail ||
            error.response?.data?.attribute_value_ids?.[0] ||
            error.response?.data?.product?.[0] ||
            'Unable to add this product to cart. Please try again or select options on the product page.'
          setCartError(errorMessage)
        }
        throw error
      } finally {
        setIsLoadingCart(false)
      }
    })
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!productId) return

    await executeProtectedAction(async () => {
      setIsLoadingWishlist(true)
      try {
        if (isInWishlist) {
          const wishlistItem = useWishlistStore
            .getState()
            .wishlist?.items.find((item) => item.product === productId)
          if (wishlistItem) {
            await removeFromWishlist.mutateAsync(wishlistItem.id)
            toast.success(`Removed from wishlist`)
          }
        } else {
          await addToWishlist.mutateAsync(productId)
          toast.success(`${product.name} added to wishlist!`)
        }
      } finally {
        setIsLoadingWishlist(false)
      }
    })
  }

  return (
    <Link
      to={getProductDetailUrl(product)}
      className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
    >
      <div className="relative bg-gray-100 overflow-hidden aspect-square">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />

        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Out of Stock
            </span>
          </div>
        )}

        <button
          onClick={handleToggleWishlist}
          disabled={isLoadingWishlist || !productId}
          className={`absolute top-3 right-3 p-2.5 rounded-full transition-all backdrop-blur-sm ${
            isInWishlist
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-600'
          } ${isLoadingWishlist ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition">
          {product.name}
        </h3>

        {rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(rating)
                      ? 'fill-orange-400 text-orange-400'
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            {reviewCount > 0 && (
              <span className="text-xs text-gray-500">({reviewCount})</span>
            )}
          </div>
        )}

        <div className="mb-4 mt-auto">
          <p className="text-lg font-bold text-gray-900">
            {formatPrice(price, currency)}
          </p>
        </div>

        {cartError && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{cartError}</p>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={isLoadingCart || !productId || !isInStock}
          className="w-full bg-orange-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
        >
          <ShoppingCart size={16} />
          <span>
            {!isInStock ? 'Out of Stock' : isLoadingCart ? 'Adding...' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </Link>
  )
}
