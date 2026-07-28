import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart, useCreateOrder, useShippingMethods } from '@api/queries'

const checkoutSchema = z.object({
  shipping_full_name: z.string().min(2, 'Name is required'),
  shipping_phone: z.string().min(10, 'Valid phone number required'),
  shipping_address: z.string().min(5, 'Address is required'),
  shipping_city: z.string().min(2, 'City is required'),
  shipping_country: z.string().min(2, 'Country is required'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { data: cart } = useCart()
  const { data: shippingMethods } = useShippingMethods()
  const createOrder = useCreateOrder()

  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [selectedShipping, setSelectedShipping] = useState<number | null>(
    shippingMethods?.[0]?.id || null
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const items = cart?.items || []
  const subtotal = items.reduce((acc, item) => {
    const price = parseFloat(item.product.price || '0')
    return acc + price * item.quantity
  }, 0)

  const shippingCost = shippingMethods?.find((m) => m.id === selectedShipping)?.base_cost
    ? parseFloat(shippingMethods.find((m) => m.id === selectedShipping)!.base_cost)
    : 0

  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const order = await createOrder.mutateAsync({
        ...data,
        shipping_cost: shippingCost.toString(),
      })

      setStep('payment')
      // In a real app, redirect to payment gateway here
      // For now, show confirmation
      setTimeout(() => setStep('confirmation'), 1000)
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Error creating order. Please try again.')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Progress indicator */}
      <div className="mb-8 flex items-center justify-between max-w-md">
        <div
          className={`flex-1 h-1 rounded ${
            step === 'shipping' || step === 'payment' || step === 'confirmation'
              ? 'bg-primary'
              : 'bg-border'
          }`}
        ></div>
        <div className="px-4">
          <p className="text-sm font-medium text-accent">Shipping</p>
        </div>
        <div
          className={`flex-1 h-1 rounded ${
            step === 'payment' || step === 'confirmation' ? 'bg-primary' : 'bg-border'
          }`}
        ></div>
        <div className="px-4">
          <p className="text-sm font-medium text-accent">Payment</p>
        </div>
        <div
          className={`flex-1 h-1 rounded ${
            step === 'confirmation' ? 'bg-primary' : 'bg-border'
          }`}
        ></div>
        <div className="px-4">
          <p className="text-sm font-medium text-accent">Confirmation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="text-2xl font-bold text-accent mb-6">Shipping Address</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">
                      Full Name
                    </label>
                    <input
                      {...register('shipping_full_name')}
                      type="text"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.shipping_full_name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shipping_full_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('shipping_phone')}
                      type="tel"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.shipping_phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shipping_phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-accent mb-2">
                    Address
                  </label>
                  <input
                    {...register('shipping_address')}
                    type="text"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {errors.shipping_address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.shipping_address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">
                      City
                    </label>
                    <input
                      {...register('shipping_city')}
                      type="text"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.shipping_city && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shipping_city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">
                      Country
                    </label>
                    <input
                      {...register('shipping_country')}
                      type="text"
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.shipping_country && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shipping_country.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping method */}
                {shippingMethods && shippingMethods.length > 0 && (
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold text-accent mb-3">Shipping Method</h3>
                    <div className="space-y-2">
                      {shippingMethods.map((method) => (
                        <label
                          key={method.id}
                          className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary"
                        >
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShipping === method.id}
                            onChange={() => setSelectedShipping(method.id)}
                            className="rounded-full"
                          />
                          <div className="ml-3 flex-1">
                            <p className="font-medium text-accent">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                          <p className="font-semibold text-primary">
                            ETB {parseFloat(method.base_cost).toFixed(2)}
                          </p>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-6 flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 'payment' && (
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="text-2xl font-bold text-accent mb-6">Payment Method</h2>
              <p className="text-gray-600 mb-6">
                Payment gateway integration coming soon. This will support Stripe, PayPal,
                and Chapa.
              </p>
              <button
                onClick={() => setStep('confirmation')}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
              >
                Complete Payment (Demo)
              </button>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="bg-white rounded-lg shadow-soft p-6 text-center">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-accent mb-4">Order Confirmed!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order. You will receive an email confirmation shortly.
              </p>
              <a
                href="/orders"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
              >
                View My Orders
              </a>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-soft p-6 sticky top-24">
            <h2 className="text-xl font-bold text-accent mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="font-semibold text-accent">
                    ETB
                    {(
                      parseFloat(item.product.price) * item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">ETB {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">ETB {shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">ETB {tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="font-bold text-accent">Total</span>
              <span className="text-2xl font-bold text-primary">ETB {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
