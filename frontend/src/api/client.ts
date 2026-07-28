import axios, { AxiosInstance, AxiosError } from 'axios'
import { AuthResponse, ApiError } from '@types/index'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private client: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add token to requests
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshAccessToken()
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return this.client(originalRequest)
          } catch (refreshError) {
            this.clearTokens()
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }

  private setTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      try {
        const refreshToken = this.getRefreshToken()
        if (!refreshToken) throw new Error('No refresh token available')

        const response = await axios.post<AuthResponse>(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh: refreshToken }
        )

        const { access } = response.data
        localStorage.setItem('access_token', access)
        return access
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  async login(email: string, password: string): Promise<{ user: any; tokens: AuthResponse }> {
    const response = await this.client.post<AuthResponse>('/auth/login/', {
      email,
      password,
    })
    const { access, refresh } = response.data
    this.setTokens(access, refresh)
    return { user: null, tokens: response.data }
  }

  async register(data: {
    email: string
    password: string
    first_name?: string
    last_name?: string
    phone_number?: string
  }): Promise<any> {
    return this.client.post('/auth/register/', data)
  }

  logout(): void {
    this.clearTokens()
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken()
  }

  // Generic request methods
  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config)
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config)
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config)
  }

  patch<T>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config)
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config)
  }

  // Error handling helper
  static handleError(error: AxiosError<ApiError>) {
    if (error.response?.data) {
      return error.response.data
    }
    return { message: 'An unexpected error occurred' }
  }
}

export const apiClient = new ApiClient()
