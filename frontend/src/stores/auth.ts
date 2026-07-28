import { create } from 'zustand'
import { createContext } from 'react'
import { User } from '@types/index'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  setUser: (user: User | null) => void
  setTokens: (access: string, refresh: string) => void
  clearAuth: () => void
  hydrateFromStorage: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  
  setUser: (user) => set({ user }),
  
  setTokens: (access, refresh) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    set({ accessToken: access, refreshToken: refresh })
  },
  
  clearAuth: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    set({ user: null, accessToken: null, refreshToken: null })
  },

  // Load auth state from localStorage on app init
  hydrateFromStorage: () => {
    const access = localStorage.getItem('access_token')
    const refresh = localStorage.getItem('refresh_token')
    const userStr = localStorage.getItem('user')
    
    let user = null
    try {
      user = userStr ? JSON.parse(userStr) : null
    } catch (e) {
      user = null
    }
    
    if (access && refresh) {
      set({ accessToken: access, refreshToken: refresh, user })
    }
  },
}))

export const AuthContext = createContext<{ user: User | null }>({ user: null })
