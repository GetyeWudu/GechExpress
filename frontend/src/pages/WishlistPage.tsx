import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '@api/queries'
import ProductCard from '@components/ProductCard'
import { motion } from 'framer-motion'

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  const items = wishlist?.items || []

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-accent mb-4">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">
            Save your favorite items to view them later
          </p>
          <Link
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-accent mb-8">Saved Items ({items.length})</h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {/* Note: This is a simplified wishlist item display
                In production, you'd fetch full product data for each wishlist item */}
            <div className="bg-white rounded-lg shadow-soft p-4">
              <div className="w-full h-40 bg-secondary rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="font-semibold text-accent mb-2 line-clamp-2">
                {item.product_name}
              </h3>
              <p className="text-xs text-gray-600 mb-3">SKU: {item.sku}</p>
              <p className="text-lg font-bold text-primary mb-4">
                ETB {parseFloat(item.price).toFixed(2)}
              </p>
              <button className="w-full bg-primary text-white py-2 rounded-lg font-medium text-sm hover:bg-orange-600 transition">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
