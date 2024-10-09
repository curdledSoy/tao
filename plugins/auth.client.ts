import { defineNuxtPlugin } from '#app'
import { useAuth } from '~/composables/useAuthStore'

export default defineNuxtPlugin(async () => {
  const { initAuth } = useAuth()
  await initAuth()
})