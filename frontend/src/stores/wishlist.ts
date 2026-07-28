import { create } from 'zustand'
import { Wishlist, WishlistItem } from '@types/index'

interface WishlistState {
  wishlist: Wishlist | null
  setWishlist: (wishlist: Wishlist) => void
  toggleItem: (item: WishlistItem) => void
  removeItem: (itemId: number) => void
  clearWishlist: () => void
  isInWishlist: (productId: number) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  setWishlist: (wishlist) => set({ wishlist }),
  toggleItem: (item) =>
    set((state) => {
      if (!state.wishlist) return state
      const exists = state.wishlist.items.find((i) => i.id === item.id)
      if (exists) {
        return {
          wishlist: {
            ...state.wishlist,
            items: state.wishlist.items.filter((i) => i.id !== item.id),
          },
        }
      }
      return {
        wishlist: {
          ...state.wishlist,
          items: [...state.wishlist.items, item],
        },
      }
    }),
  removeItem: (itemId) =>
    set((state) => {
      if (!state.wishlist) return state
      return {
        wishlist: {
          ...state.wishlist,
          items: state.wishlist.items.filter((i) => i.id !== itemId),
        },
      }
    }),
  clearWishlist: () => set({ wishlist: null }),
  isInWishlist: (productId) => {
    const state = get()
    return (
      state.wishlist?.items.some((i) => i.product === productId) ||
      false
    )
  },
}))
