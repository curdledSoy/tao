import type { UseFetchOptions } from 'nuxt/app'
import { useAuthStore } from './useAuthStore'

export function useAuthFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const auth = useAuthStore()
  

  const defaults: UseFetchOptions<T> = {
    headers: {
      ...options.headers,
      Authorization: `Bearer ${auth.value.token}`,
    },
  }

  return useFetch(url, { ...defaults, ...options })
}