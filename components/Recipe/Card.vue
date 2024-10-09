<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-48 object-cover">
    <div class="p-4">
      <h2 class="text-xl font-semibold mb-2">{{ recipe.title }}</h2>
      <p class="text-gray-600 mb-4">{{ recipe.description }}</p>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-500">by {{ recipe.author }}</span>
        <div class="flex items-center">
          <LikeButton :recipeId="recipe.id" :initialLikes="recipe.likes" class="mr-4" />
          <NuxtLink :to="`/recipes/${recipe.id}`" class="text-blue-600 hover:underline">View Recipe</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  recipe: {
    id: number
    title: string
    description: string
    imageUrl: string
    author: string
    likes: number
  }
}>()
</script>