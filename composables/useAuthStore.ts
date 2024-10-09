import { useState } from '#app'
import type { Ref } from 'vue'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: number
  email: string
  username: string
}

interface DecodedToken {
  exp: number
  userId: number
}

export const useAuthStore = () => useState('auth', () => ({
  token: null as string | null,
  user: null as User | null
}))

export const useAuth = () => {
  const auth = useAuthStore()

  const setAuth = (token: string | null, user: User | null) => {
    auth.value = { token, user }
    if (token && user) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  const initAuth = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const decoded = jwtDecode(token) as DecodedToken
      if (decoded.exp * 1000 > Date.now()) {
        try {
          const { data } = await $fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (data.value) {
            setAuth(token, data.value.user)
          }
        } catch (error) {
          console.error('Failed to fetch user data', error)
          setAuth(null, null)
        }
      } else {
        setAuth(null, null)
      }
    }
  }

  const isAuthenticated = computed(() => !!auth.value.token)

  return {
    auth,
    setAuth,
    initAuth,
    isAuthenticated
  }
}