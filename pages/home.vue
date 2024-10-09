<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Welcome back, {{ auth.user?.username }}!</h1>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <NuxtLink to="/recipes/new" class="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition">
        <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Create New Recipe
      </NuxtLink>
      <NuxtLink to="/recipes/favorites" class="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition">
        <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        My Favorites
      </NuxtLink>
      <NuxtLink to="/recipes/explore" class="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition">
        <svg class="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        Explore Recipes
      </NuxtLink>
    </div>

    <!-- Recent Recipes -->
    <div class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">Your Recent Recipes</h2>
      <div v-if="recentRecipes.recipes.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="recipe in recentRecipes.recipes" :key="recipe.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ recipe.title }}</h3>
            <p class="text-gray-600 mb-4">{{ recipe.description }}</p>
            <NuxtLink :to="`/recipes/${recipe.id}`" class="text-blue-600 hover:underline">View Recipe</NuxtLink>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-600">You haven't created any recipes yet. Start by creating a new recipe!</p>
    </div>

    <!-- Trending Recipes -->
    <div>
      <h2 class="text-2xl font-semibold mb-4">Trending Recipes</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="recipe in trendingRecipes.recipes" :key="recipe.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <img :src="recipe.imageUrl" :alt="recipe.title" class="w-full h-40 object-cover">
          <div class="p-4">
            <h3 class="font-semibold text-lg mb-2">{{ recipe.title }}</h3>
            <p class="text-gray-600 mb-2">by {{ recipe.author }}</p>
            <NuxtLink :to="`/recipes/${recipe.id}`" class="text-blue-600 hover:underline">View Recipe</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({layout: "main"})
const auth = useAuthStore()

// Fetch recent recipes
const { data: recentRecipes } = await useFetch('/api/recipes', {
  query: { userId: auth.value.user?.id, limit: 3 }, key: "recentRecipes"
})

// Fetch trending recipes
const { data: trendingRecipes } = await useAuthFetch('/api/recipes/trending', {query: {limit: 10}, key: "trendingRecipes"})

</script>