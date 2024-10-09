<template>
  <button @click="toggleLike" class="flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="{ 'text-red-500': isLiked, 'text-gray-400': !isLiked }" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
    <span class="ml-2">{{ likes }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  recipeId: number
  initialLikes: number
}>()

const likes = ref(props.initialLikes)
const isLiked = ref(false)

onMounted(async () => {
  await checkLikeStatus()
})

const checkLikeStatus = async () => {
  try {
    const { data } = await useAuthFetch(`/api/recipes/${props.recipeId}/like/status`)
    if (data.value) {
      isLiked.value = data.value.isLiked
      likes.value = data.value.count
    }
  } catch (error) {
    console.error('Error checking like status:', error)
  }
}

const toggleLike = async () => {
  try {
    const { data } = await useAuthFetch(`/api/recipes/${props.recipeId}/like`, {
      method: 'POST'
    })
    if (data.value) {
      isLiked.value = !isLiked.value
      likes.value = data.value.likes
    }
  } catch (error) {
    console.error('Error toggling like:', error)
  }
}
</script>