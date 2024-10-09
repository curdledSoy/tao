<template>
  <div>
    <h1>Profile</h1>
    <p v-if="auth.user">Welcome, {{ auth.user.username }}!</p>
    <p v-else>Loading user data...</p>
  </div>
</template>

<script setup>
definePageMeta({
    layout:"main"
})
import { useAuth } from '~/composables/useAuthStore'

const { auth } = useAuth()

</script>