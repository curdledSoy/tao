<template>
  <div class="mt-12">
    <h2 class="text-2xl font-semibold mb-4">Comments</h2>
    <div v-if="comments.length === 0" class="mb-4">
      No comments yet. Be the first to comment!
    </div>
    <div v-else class="space-y-4 mb-8">
      <div v-for="comment in comments" :key="comment.id" class="bg-gray-100 p-4 rounded">
        <p class="font-semibold">{{ comment.author }}</p>
        <p>{{ comment.content }}</p>
        <p class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</p>
      </div>
    </div>
    <form @submit.prevent="submitComment" class="space-y-4">
      <textarea v-model="newComment" rows="3" class="w-full border rounded p-2" placeholder="Write a comment..."></textarea>
      <button type="submit" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        Post Comment
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  recipeId: number
  comments: Array<{
    id: number
    author: string
    content: string
    createdAt: Date
  }>
}>()

const newComment = ref('')

const submitComment = async () => {
  if (!newComment.value.trim()) return

  try {
    const { data } = await useAuthFetch(`/api/recipes/${props.recipeId}/comments`, {
      method: 'POST',
      body: { content: newComment.value }
    })
    if (data.value) {
      props.comments.push(data.value)
      newComment.value = ''
    }
  } catch (error) {
    console.error('Error posting comment:', error)
  }
}

const formatDate = (dateString: Date) => {
  return new Date(dateString).toLocaleString()
}
</script>