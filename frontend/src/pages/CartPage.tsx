import { Link } from 'react-router-dom'
import { X, Plus, Minus, ShoppingCart } from 'lucide-react'
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@api/queries'
import { useAuthStore } from '@stores/auth'
import { useState } from 'react'

export default function CartPage() {
  const { data: cart, isLoading } = useCart()
  const updateCartItem = useUpdateCartItem()
  const removeFromCart = useRemoveFromCart()
  const { user } = useAuthStore()
  const [updatingItems, setUpdatingItems] = useState<number[]>([])

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdatingItems((prev) => [...prev, itemId])
    try {
      await updateCartItem.mutateAsync({
        id: itemId,
        quantity: newQuantity,
      })
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== itemId))
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setUpdatingItems((prev) => [...prev, itemId])
    try {
      await removeFromCart.mutateAsync(itemId)
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== itemId))
    }
  }

  const items = cart?.items || []
  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.product.price || '0')
    return acc + price * item.quantity
  }, 0)
  const shipping = subtotal > 500 ? 0 : 0 // Free shipping (no shipping cost in ETB)
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-accent mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Start shopping to add items to your cart
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
      <h1 className="text-3xl font-bold text-accent mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 sm:p-6 border-b border-border last:border-b-0 ${
                  updatingItems.includes(item.id) ? 'opacity-50' : ''
                }`}
              >
                <div className="flex gap-4">
                  {/* Product image */}
                  <div className="w-24 h-24 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={item.product.image_url || 'https://via.placeholder.com/100?text=No+Image'}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=No+Image'
                      }}
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-accent mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        SKU: {item.product.sku}
                      </p>
                      {item.attribute_selections && item.attribute_selections.length > 0 && (
                        <p className="text-xs text-gray-500 mb-2">
                          {item.attribute_selections
                            .map((selection) => `${selection.attribute}: ${selection.value}`)
                            .join(', ')}
                        </p>
                      )}
                      <p className="font-bold text-primary">
                        ETB {parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition"
                      disabled={updatingItems.includes(item.id)}
                    >
                      <X size={20} />
                    </button>

                    {/* Quantity selector */}
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-secondary disabled:opacity-50"
                        disabled={item.quantity <= 1 || updatingItems.includes(item.id)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-3 py-1 text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-secondary disabled:opacity-50"
                        disabled={updatingItems.includes(item.id)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-soft p-6 sticky top-24">
            <h2 className="text-xl font-bold text-accent mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-accent">ETB {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-accent">
                  {shipping === 0 ? 'FREE' : `ETB ${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-primary font-medium">✓ Free shipping</p>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold text-accent">ETB {tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-bold text-accent">Total</span>
              <span className="text-2xl font-bold text-primary">
                ETB {total.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              {user ? (
                <Link
                  to="/checkout"
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium text-center hover:bg-orange-600 transition block"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <Link
                  to="/auth/login?redirect=/checkout"
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium text-center hover:bg-orange-600 transition block"
                >
                  Sign In to Checkout
                </Link>
              )}

              <Link
                to="/"
                className="block w-full border border-primary text-primary py-3 rounded-lg font-medium text-center hover:bg-primary/5 transition"
              >
                Continue Shopping
              </Link>
            </div>

            {subtotal < 500 && (
              <p className="text-xs text-gray-500 text-center mt-4">
                Add ETB {(500 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
