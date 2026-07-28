import { Link } from 'react-router-dom'
import { Calendar, Package } from 'lucide-react'
import { useOrders } from '@api/queries'
import { format } from 'date-fns'

export default function OrdersPage() {
  const { data: orders, isLoading } = useOrders()

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-accent mb-4">No Orders Yet</h1>
          <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-accent mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="bg-white rounded-lg shadow-soft p-6 hover:shadow-md-soft transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Order number */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Order Number</p>
                <p className="font-semibold text-accent">{order.order_number}</p>
              </div>

              {/* Date */}
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <Calendar size={14} />
                  Date
                </p>
                <p className="font-semibold text-accent">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status as keyof typeof statusColors] ||
                    'bg-gray-100 text-gray-800'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Total */}
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-xl font-bold text-primary">ETB {parseFloat(order.total).toFixed(2)}</p>
              </div>
            </div>

            {/* Items preview */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-gray-500" />
                <p className="text-sm text-gray-600">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-1 ml-auto text-xs text-gray-500">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <span key={idx}>{item.product_name}</span>
                  ))}
                  {order.items.length > 2 && (
                    <span>+{order.items.length - 2} more</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
