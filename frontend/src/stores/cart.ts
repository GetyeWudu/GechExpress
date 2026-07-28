import { create } from 'zustand'
import { Cart, CartItem } from '@types/index'

interface CartState {
  cart: Cart | null
  setCart: (cart: Cart) => void
  addItem: (item: CartItem) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  addItem: (item) =>
    set((state) => {
      if (!state.cart) return state
      const exists = state.cart.items.find((i) => i.id === item.id)
      if (exists) return state
      return { cart: { ...state.cart, items: [...state.cart.items, item] } }
    }),
  removeItem: (itemId) =>
    set((state) => {
      if (!state.cart) return state
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.filter((i) => i.id !== itemId),
        },
      }
    }),
  updateQuantity: (itemId, quantity) =>
    set((state) => {
      if (!state.cart) return state
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        },
      }
    }),
  clearCart: () => set({ cart: null }),
  getItemCount: () => {
    const state = get()
    return state.cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0
  },
  getTotal: () => {
    const state = get()
    return (
      state.cart?.items.reduce((acc, item) => {
        const price = parseFloat(item.product.price || '0')
        return acc + price * item.quantity
      }, 0) || 0
    )
  },
}))
