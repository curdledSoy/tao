<template>
  <button @click="logout">Logout</button>
</template>

<script setup>
import { useAuth } from '~/composables/useAuthStore'

const { setAuth } = useAuth()

function logout() {
  setAuth(null, null)
  navigateTo('/login')
}
</script>