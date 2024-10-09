<template>
  <div v-if="pending" class="container mx-auto px-4 py-8">
    <p class="text-xl">Loading recipe...</p>
  </div>
  <div v-else-if="error" class="container mx-auto px-4 py-8">
    <p class="text-xl text-red-600">{{ error.message }}</p>
  </div>
  <div v-else-if="recipe" class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Edit Recipe: {{ recipe.title }}</h1>
    <form @submit.prevent="updateRecipe" class="max-w-2xl mx-auto">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="recipe.title" type="text" id="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea v-model="recipe.description" id="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
      </div>

      <div class="mb-4">
        <label for="instructions" class="block text-sm font-medium text-gray-700">Instructions</label>
        <div class="mt-1">
          <TipTapEditor
            v-model="recipe.instructions"
            placeholder="Enter recipe instructions..."
          />
        </div>
      </div>

      <div class="mb-4">
        <label for="servings" class="block text-sm font-medium text-gray-700">Servings</label>
        <input v-model.number="recipe.servings" type="number" id="servings" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      </div>

      <div class="mb-4">
        <label for="cookTime" class="block text-sm font-medium text-gray-700">Cook Time (minutes)</label>
        <input v-model.number="recipe.cookTime" type="number" id="cookTime" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-medium text-gray-700 mb-2">Ingredients</h3>
        <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="flex items-center mb-2">
          <input v-model="ingredient.quantity" type="text" placeholder="Quantity" class="mr-2 w-1/4 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <input v-model="ingredient.name" type="text" placeholder="Ingredient" class="mr-2 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <button @click="removeIngredient(index)" type="button" class="text-red-600 hover:text-red-800">Remove</button>
        </div>
        <button @click="addIngredient" type="button" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Ingredient</button>
      </div>

      <div class="mb-4">
        <label for="imageUrl" class="block text-sm font-medium text-gray-700">Image URL</label>
        <input v-model="recipe.imageUrl" type="url" id="imageUrl" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      </div>

      <div class="mt-8">
        <button type="submit" class="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">Update Recipe</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

definePageMeta({
  layout: 'main'
})

const route = useRoute()
const router = useRouter()
const recipeId = route.params.id

const { data: recipe, error, pending } = await useAuthFetch(`/api/recipes/${recipeId}`)

const addIngredient = () => {
  recipe.value.ingredients.push({ quantity: '', name: '' })
}

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const updateRecipe = async () => {
  try {
    const { data } = await useAuthFetch(`/api/recipes/${recipeId}`, {
      method: 'PUT',
      body: recipe.value
    })

    if (data.value) {
      // Redirect to the updated recipe page
      router.push(`/recipes/${recipeId}`)
    }
  } catch (error) {
    console.error('Error updating recipe:', error)
    // TODO: Add error handling and user feedback
  }
}
</script>