import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Truck, RotateCcw } from 'lucide-react'
import { useProduct, useReviews, useAddToCart, useAddToWishlist, useRemoveFromWishlist } from '@api/queries'
import { useWishlistStore } from '@stores/wishlist'
import { useAuthProtectedAction } from '@hooks/useAuthProtectedAction'
import { useToast } from '@hooks/useToast'
import { motion } from 'framer-motion'
import { resolveMediaUrl } from '@utils/media'
import {
  findVariantBySelections,
  formatPrice,
  getDefaultAttributeSelections,
  getPrimaryImageUrl,
  getProductImages,
  getSelectableAttributeGroups,
  getSelectedAttributeValueIds,
  hasCompleteAttributeSelection,
} from '@utils/product'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading: productLoading, isError } = useProduct(slug || '')
  const attributeGroups = useMemo(
    () => (product ? getSelectableAttributeGroups(product) : []),
    [product]
  )
  const productImages = useMemo(
    () => (product ? getProductImages(product) : []),
    [product]
  )

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, number>>({})
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoadingCart, setIsLoadingCart] = useState(false)
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false)

  const { data: reviews } = useReviews(product?.id)
  const addToCart = useAddToCart()
  const addToWishlist = useAddToWishlist()
  const removeFromWishlist = useRemoveFromWishlist()
  const { execute: executeProtectedAction } = useAuthProtectedAction()
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product?.id || 0)
  )
  const toast = useToast()

  useEffect(() => {
    if (!product) return

    setSelectedAttributes(getDefaultAttributeSelections(attributeGroups))
    setSelectedImageUrl(getPrimaryImageUrl(product))
    setQuantity(1)
  }, [product, attributeGroups])

  const handleAttributeSelect = (attribute: string, valueId: number) => {
    setSelectedAttributes((previous) => ({
      ...previous,
      [attribute]: valueId,
    }))
  }

  const attributeValueIds = useMemo(
    () => getSelectedAttributeValueIds(attributeGroups, selectedAttributes),
    [attributeGroups, selectedAttributes]
  )

  const selectedVariant = useMemo(
    () => (product ? findVariantBySelections(product, selectedAttributes) : undefined),
    [product, selectedAttributes]
  )

  const canAddToCart =
    hasCompleteAttributeSelection(attributeGroups, selectedAttributes) &&
    product?.is_in_stock !== false

  const handleAddToCart = async () => {
    if (!product || !canAddToCart) return

    await executeProtectedAction(async () => {
      setIsLoadingCart(true)
      try {
        await addToCart.mutateAsync({
          product: product.id,
          quantity,
          attribute_value_ids: attributeValueIds,
        })
        toast.success(`${quantity} × ${product.name} added to cart!`)
        setQuantity(1)
      } finally {
        setIsLoadingCart(false)
      }
    })
  }

  const handleToggleWishlist = async () => {
    if (!product) return

    await executeProtectedAction(async () => {
      setIsLoadingWishlist(true)
      try {
        if (isInWishlist) {
          const wishlistItem = useWishlistStore
            .getState()
            .wishlist?.items.find((item) => item.product === product.id)
          if (wishlistItem) {
            await removeFromWishlist.mutateAsync(wishlistItem.id)
            toast.success('Removed from wishlist')
          }
        } else {
          await addToWishlist.mutateAsync(product.id)
          toast.success(`${product.name} added to wishlist!`)
        }
      } finally {
        setIsLoadingWishlist(false)
      }
    })
  }

  if (productLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent mb-4">Product not found</h1>
          <Link
            to="/"
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const mainImageUrl = selectedImageUrl || getPrimaryImageUrl(product)
  const avgRating = reviews?.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0
  const displayPrice = selectedVariant?.price || product.price || '0'
  const displayCurrency = selectedVariant?.currency || product.currency || 'USD'
  const isOutOfStock =
    selectedVariant?.is_in_stock === false ||
    (product.is_in_stock === false && !selectedVariant)

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-soft border border-gray-100"
          >
            <img
              src={mainImageUrl}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
            {productImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {productImages.map((image) => {
                  const imageUrl = resolveMediaUrl(image.image_url)
                  if (!imageUrl) return null

                  return (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageUrl(imageUrl)}
                      className={`flex-shrink-0 rounded-lg border-2 overflow-hidden ${
                        mainImageUrl === imageUrl
                          ? 'border-orange-500'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={image.alt_text || product.name}
                        className="w-16 h-16 object-cover"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col"
          >
            <h1 className="text-3xl font-bold text-accent mb-3">{product.name}</h1>

            {product.shop_name && (
              <p className="text-sm text-gray-600 mb-3">{product.shop_name}</p>
            )}

            {avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={
                        i < Math.floor(avgRating)
                          ? 'fill-primary text-primary'
                          : 'text-border'
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviews?.length || 0} reviews)
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-4xl font-bold text-primary mb-2">
                {formatPrice(displayPrice, displayCurrency)}
              </p>
              <p
                className={`text-sm font-medium ${
                  isOutOfStock ? 'text-red-600' : 'text-green-700'
                }`}
              >
                {isOutOfStock
                  ? 'Out of stock'
                  : `${selectedVariant?.available_quantity ?? product.available_quantity ?? 'In'} available`}
              </p>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Hide completely when product has no selectable in-stock variants */}
            {attributeGroups.length > 0 && (
              <div className="space-y-5 mb-6">
                {attributeGroups.map((group) => (
                  <div key={group.attribute}>
                    <label className="block font-semibold text-accent mb-2">
                      {group.attribute}
                    </label>
                    <select
                      value={selectedAttributes[group.attribute] || ''}
                      onChange={(event) =>
                        handleAttributeSelect(
                          group.attribute,
                          Number.parseInt(event.target.value, 10)
                        )
                      }
                      className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-accent focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="" disabled>
                        Select an option
                      </option>
                      {group.values.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-accent mb-2">
                Quantity
              </label>
              <div className="flex items-center border border-border rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-secondary"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-12 text-center border-l border-r border-border focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-secondary"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isLoadingCart || !canAddToCart || isOutOfStock}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                <span>{isLoadingCart ? 'Adding...' : 'Add to cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={isLoadingWishlist}
                className={`px-6 py-3 rounded-lg font-medium transition ${
                  isInWishlist
                    ? 'bg-primary text-white'
                    : 'border border-primary text-primary hover:bg-primary/5'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-start gap-3">
                <Truck size={20} className="text-primary flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="font-medium text-accent">Free shipping</p>
                  <p className="text-gray-600">On orders over ETB 500</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw size={20} className="text-primary flex-shrink-0 mt-1" />
                <div className="text-sm">
                  <p className="font-medium text-accent">Easy returns</p>
                  <p className="text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {reviews && reviews.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-accent mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < review.rating
                              ? 'fill-primary text-primary'
                              : 'text-border'
                          }
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{review.status}</p>
                  </div>
                  <h3 className="font-semibold text-accent text-sm mb-1">
                    {review.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <p>by {review.user_email}</p>
                    <p>Helpful: {review.helpful_count}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}
