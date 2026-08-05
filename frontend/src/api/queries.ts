import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import { useAuthStore } from '@stores/auth'
import type {
  Product,
  Category,
  CategoryWithChildren,
  Tag,
  Cart,
  Order,
  Review,
  Wishlist,
  WishlistItem,
  ShippingMethod,
  PaginatedResponse,
} from '@types/index'

// Query keys
export const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: any) => [...queryKeys.products.lists(), { filters }] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.products.details(), slug] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    active: () => [...queryKeys.categories.all, 'active'] as const,
    roots: () => [...queryKeys.categories.all, 'roots'] as const,
    children: (parentId: number) =>
      [...queryKeys.categories.all, 'children', parentId] as const,
    nav: () => [...queryKeys.categories.all, 'nav'] as const,
    bySlug: (slug: string) => [...queryKeys.categories.all, 'slug', slug] as const,
    byPath: (slugs: string[]) => [...queryKeys.categories.all, 'path', ...slugs] as const,
  },
  tags: {
    all: ['tags'] as const,
  },
  cart: {
    detail: () => ['cart'] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.orders.details(), id] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: (productId?: number) => [...queryKeys.reviews.all, { productId }] as const,
  },
  wishlist: {
    detail: () => ['wishlist'] as const,
  },
  shipping: {
    methods: () => ['shipping', 'methods'] as const,
  },
}

// Product queries
export function useProducts(filters?: any, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Product>>('/catalog/products/', {
        params: filters,
      })
      return response.data
    },
    enabled,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get<Product>(`/catalog/products/${slug}/`)
      return response.data
    },
    enabled: !!slug,
    retry: false,
  })
}

function getCategoryChildren(categories: Category[], parentId: number | null) {
  return categories.filter(
    (cat) => cat.parent === parentId && cat.is_active === true
  )
}

function resolveCategoryPath(categories: Category[], slugs: string[]) {
  const chain: Category[] = []
  let expectedParent: number | null = null

  for (const slug of slugs) {
    const match = categories.find(
      (cat) =>
        cat.slug === slug &&
        cat.parent === expectedParent &&
        cat.is_active === true
    )

    if (!match) {
      return null
    }

    chain.push(match)
    expectedParent = match.id
  }

  return chain
}

/** All active categories (roots + descendants) from the real backend. */
export function useAllActiveCategories() {
  return useQuery({
    queryKey: queryKeys.categories.active(),
    queryFn: async () => {
      const response = await apiClient.get<Category[]>('/catalog/categories/', {
        params: { parent__isnull: true, is_active: true },
      })
      return response.data.filter((cat) => cat.is_active === true)
    },
    staleTime: 5 * 60 * 1000,
  })
}

/** Active top-level categories only (parent=null & is_active=true). */
export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: async () => {
      const response = await apiClient.get<Category[]>('/catalog/categories/', {
        params: { is_active: true },
      })
      return getCategoryChildren(response.data, null)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useRootCategories() {
  return useCategories()
}

/** Active children of a given parent category. */
export function useCategoryChildren(parentId: number | null) {
  return useQuery({
    queryKey: queryKeys.categories.children(parentId || 0),
    queryFn: async () => {
      const response = await apiClient.get<Category[]>('/catalog/categories/', {
        params: { parent: parentId, is_active: true },
      })
      return getCategoryChildren(response.data, parentId)
    },
    enabled: parentId !== null,
    staleTime: 5 * 60 * 1000,
  })
}

/** Active root categories with only their active direct children for the navbar. */
export function useNavCategories() {
  return useQuery({
    queryKey: queryKeys.categories.nav(),
    queryFn: async (): Promise<CategoryWithChildren[]> => {
      const response = await apiClient.get<Category[]>('/catalog/categories/', {
        params: { parent__isnull: true, is_active: true },
      })
      const categories = response.data.filter((cat) => cat.is_active === true)
      const roots = getCategoryChildren(categories, null)

      return roots.map((parent) => ({
        ...parent,
        subcategories: getCategoryChildren(categories, parent.id),
      }))
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await apiClient.get<Category>(`/catalog/categories/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

/** Resolve a category by slug from all active categories (roots + children). */
export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug || ''),
    queryFn: async () => {
      const response = await apiClient.get<Category[]>('/catalog/categories/', {
        params: { parent__isnull: true, is_active: true },
      })
      const match = response.data.find((cat) => cat.slug === slug && cat.is_active === true)
      if (!match) {
        throw new Error('Category not found')
      }
      return match
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

/** Resolve a nested /category/... slug path against the backend category tree. */
export function useCategoryPath(slugs: string[]) {
  return useQuery({
    queryKey: queryKeys.categories.byPath(slugs),
    queryFn: async () => {
      const response = await apiClient.get<Category[]>('/catalog/categories/', {
        params: { parent__isnull: true, is_active: true },
      })
      const chain = resolveCategoryPath(
        response.data.filter((cat) => cat.is_active === true),
        slugs
      )

      if (!chain || chain.length === 0) {
        throw new Error('Category path not found')
      }

      const current = chain[chain.length - 1]
      const children = getCategoryChildren(response.data, current.id)

      return {
        allCategories: response.data.filter((cat) => cat.is_active === true),
        breadcrumbs: chain,
        current,
        children,
      }
    },
    enabled: slugs.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
}

export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: async () => {
      const response = await apiClient.get<Tag[]>('/catalog/tags/')
      return response.data
    },
  })
}

// Cart queries and mutations
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.detail(),
    queryFn: async () => {
      const response = await apiClient.get<Cart>('/cart/')
      return response.data
    },
  })
}

export function useAddToCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      product: number
      quantity: number
      attribute_value_ids?: number[]
    }) => {
      const response = await apiClient.post('/cart/items/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail() })
    },
  })
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiClient.put(`/cart/items/${id}/`, { quantity })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail() })
    },
  })
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/cart/items/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail() })
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/cart/clear/', {})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail() })
    },
  })
}

// Order queries and mutations
export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.lists(),
    queryFn: async () => {
      const response = await apiClient.get<Order[]>('/orders/')
      return response.data
    },
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: async () => {
      const response = await apiClient.get<Order>(`/orders/${id}/`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      shipping_full_name: string
      shipping_phone: string
      shipping_address: string
      shipping_city: string
      shipping_country: string
      shipping_cost: string
    }) => {
      const response = await apiClient.post<Order>('/orders/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.detail() })
    },
  })
}

// Review queries
export function useReviews(productId?: number) {
  return useQuery({
    queryKey: queryKeys.reviews.list(productId),
    queryFn: async () => {
      const params = productId ? { product_id: productId } : {}
      const response = await apiClient.get<Review[]>('/reviews/', { params })
      return response.data
    },
  })
}

// Wishlist queries and mutations
export function useWishlist() {
  const user = useAuthStore((state) => state.user)

  return useQuery({
    queryKey: queryKeys.wishlist.detail(),
    queryFn: async () => {
      const response = await apiClient.get<Wishlist>('/wishlist/')
      return response.data
    },
    enabled: !!user,
  })
}

export function useWishlistItem(productId: number | undefined) {
  const { data: wishlist } = useWishlist()

  return useMemo(() => {
    const item = wishlist?.items.find((i) => i.product === productId)
    return { isInWishlist: !!item, wishlistItem: item }
  }, [wishlist, productId])
}

export function useAddToWishlist() {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.wishlist.detail()

  return useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiClient.post<WishlistItem>('/wishlist/add/', {
        product_id: productId,
      })
      return response.data
    },
    onMutate: async (_productId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousWishlist = queryClient.getQueryData<Wishlist>(queryKey)
      return { previousWishlist }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Wishlist>(queryKey, (old) => {
        if (!old) {
          return { id: 0, items: [data], created_at: '', updated_at: '' }
        }
        const exists = old.items.find((item) => item.id === data.id)
        if (exists) return old
        return { ...old, items: [...old.items, data] }
      })
    },
    onError: (error, _productId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKey, context.previousWishlist)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient()
  const queryKey = queryKeys.wishlist.detail()

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/wishlist/${id}/remove/`)
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      const previousWishlist = queryClient.getQueryData<Wishlist>(queryKey)
      queryClient.setQueryData<Wishlist>(queryKey, (old) => {
        if (!old) return old
        return { ...old, items: old.items.filter((item) => item.id !== id) }
      })
      return { previousWishlist }
    },
    onError: (error, _id, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKey, context.previousWishlist)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })
}

// Shipping queries
export function useShippingMethods() {
  return useQuery({
    queryKey: queryKeys.shipping.methods(),
    queryFn: async () => {
      const response = await apiClient.get<ShippingMethod[]>('/shipping/methods/')
      return response.data
    },
  })
}
