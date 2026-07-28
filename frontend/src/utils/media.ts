const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '')

/** Resolve category/product media URLs from the backend. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  return `${API_ORIGIN}${normalizedPath}`
}
