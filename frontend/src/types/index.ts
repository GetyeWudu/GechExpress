// Auth types
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  role: 'CUSTOMER' | 'STAFF' | 'MANAGER'
  email_verified: boolean
}

export interface AuthResponse {
  access: string
  refresh: string
}

// Product types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent: number | null
  is_active: boolean
  image?: string | null
}

export interface CategoryWithChildren extends Category {
  subcategories: Category[]
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface ProductAttributeOption {
  id: number
  value: string
}

export interface ProductAttributeGroup {
  attribute: string
  values: ProductAttributeOption[]
}

export interface SelectableAttribute {
  name: string
  options: string[]
}

export interface ProductVariant {
  id: number
  sku: string
  price: string
  currency: string
  is_default: boolean
  is_active: boolean
  available_quantity?: number
  is_in_stock?: boolean
  attribute_values?: Array<{
    id: number
    attribute: string
    value: string
  }>
}

export interface Product {
  id: number
  name: string
  slug: string
  sku?: string
  description?: string
  price?: string
  rating?: number
  review_count?: number
  image_url?: string
  primary_image?: string | null
  currency?: string
  shop_name?: string
  categories?: Array<{ id: number; name: string; slug: string }> | number[]
  tags?: Array<{ id: number; name: string; slug: string }> | number[]
  is_active: boolean
  attributes?: ProductAttributeGroup[]
  selectable_attributes?: SelectableAttribute[]
  has_selectable_variants?: boolean
  variants?: ProductVariant[]
  available_quantity?: number
  is_in_stock?: boolean
  images?: ProductImage[]
  created_at?: string
  updated_at?: string
}

export interface ProductImage {
  id: number
  image_url: string
  alt_text?: string
  is_primary?: boolean
  display_order?: number
}

// Cart types
export interface CartProductSummary {
  id: number
  name: string
  slug: string
  sku: string
  price: string
  currency: string
  shop_name?: string
  is_active: boolean
}

export interface CartItemAttributeSelection {
  id: number
  attribute_value: number
  attribute: string
  value: string
}

export interface CartItem {
  id: number
  product: CartProductSummary
  quantity: number
  selection_key?: string
  attribute_selections?: CartItemAttributeSelection[]
  created_at: string
  updated_at: string
}

export interface Cart {
  id: number
  items: CartItem[]
  created_at: string
  updated_at: string
}

// Order types
export interface OrderItem {
  id: number
  product: number
  product_name: string
  sku: string
  unit_price: string
  quantity: number
  subtotal: string
  selected_options?: Record<string, number | string>
  created_at: string
}

export interface Order {
  id: number
  order_number: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: string
  shipping_cost: string
  total: string
  shipping_full_name: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_country: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

// Payment types
export interface Payment {
  id: number
  order: number
  amount: string
  currency: string
  status: 'pending' | 'processing' | 'successful' | 'failed' | 'refunded'
  provider: 'stripe' | 'paypal' | 'chapa' | 'other'
  transaction_id?: string
  provider_reference?: string
  payment_method?: string
  created_at: string
  updated_at: string
}

// Review types
export interface Review {
  id: number
  user_email: string
  product: number
  rating: number
  title: string
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  helpful_count: number
  unhelpful_count: number
  created_at: string
}

// Wishlist types
export interface WishlistItem {
  id: number
  product: number
  product_name: string
  sku: string
  price: string
  created_at: string
}

export interface Wishlist {
  id: number
  items: WishlistItem[]
  created_at: string
  updated_at: string
}

// Shipping types
export interface ShippingMethod {
  id: number
  name: string
  code: string
  description: string
  base_cost: string
  estimated_days_min: number
  estimated_days_max: number
  is_active: boolean
}

export interface Shipment {
  id: number
  order: number
  shipping_method_name: string
  status: 'pending' | 'shipped' | 'in_transit' | 'delivered'
  tracking_number?: string
  carrier_url?: string
  shipped_at?: string
  delivered_at?: string
  items: any[]
}

// API Response types
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export interface PaginatedResponse<T> {
  count: number
  next?: string
  previous?: string
  results: T[]
}

// Error type
export interface ApiError {
  detail?: string
  message?: string
  [key: string]: any
}
