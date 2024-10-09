<template>
  <NuxtLink :to="`/recipes/${recipeId}/edit`" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
    Edit Recipe
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  recipeId: number
}>()
</script>