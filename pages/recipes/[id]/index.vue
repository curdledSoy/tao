<template>
  <div v-if="pending" class="container mx-auto px-4 py-8">
    <p class="text-xl">Loading recipe...</p>
  </div>
  <div v-else-if="error" class="container mx-auto px-4 py-8">
    <p class="text-xl text-red-600">{{ error.message }}</p>
  </div>
  <div v-else-if="recipe" class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">{{ recipe.title }}</h1>
      <div class="flex items-center">
        <LikeButton :recipe-id="recipe.id" :initial-likes="recipe.likes" class="mr-4" />
        <EditButton v-if="isAuthor" :recipe-id="recipe.id" />
      </div>
    </div>
    <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-64 object-cover rounded-lg mb-6">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="md:col-span-2">
        <h2 class="text-2xl font-semibold mb-4">Instructions</h2>
        <p class="whitespace-pre-line prose" v-html="recipe.instructions"></p>
      </div>
      
      <div>
        <h2 class="text-2xl font-semibold mb-4">Ingredients</h2>
        <ul class="list-disc list-inside">
          <li v-for="ingredient in recipe.ingredients" :key="ingredient.id" class="mb-2">
            {{ ingredient.quantity }} {{ ingredient.name }}
          </li>
        </ul>
        
        <div class="mt-8">
          <h3 class="text-xl font-semibold mb-2">Details</h3>
          <p><strong>Servings:</strong> {{ recipe.servings }}</p>
          <p><strong>Cook Time:</strong> {{ recipe.cookTime }} minutes</p>
          <p><strong>Author:</strong> {{ recipe.author }}</p>
        </div>
      </div>
    </div>

    <CommentSection :recipe-id="recipe.id" :comments="recipe.comments" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/composables/useAuthStore'

definePageMeta({
  layout: 'main'
})

const route = useRoute()
const recipeId = route.params.id
const auth = useAuthStore()

const { data: recipe, error, pending } = await useAuthFetch(`/api/recipes/${recipeId}`)

const isAuthor = computed(() => {
  return auth.value.user?.id === recipe.value?.userId
})
</script>