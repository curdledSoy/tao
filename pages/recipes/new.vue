<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Create New Recipe</h1>
    <form @submit.prevent="submitRecipe" class="max-w-2xl mx-auto">
      <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
        <input v-model="recipe.title" type="text" id="title" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
      </div>

      <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea v-model="recipe.description" required id="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
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
        <button type="submit" class="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">Create Recipe</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'main'
})

const router = useRouter()

const recipe = ref({
  title: '',
  description: '',
  instructions: '',
  servings: 1,
  cookTime: 0,
  ingredients: [{ quantity: '', name: '' }],
  imageUrl: ''
})

const addIngredient = () => {
  recipe.value.ingredients.push({ quantity: '', name: '' })
}

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const submitRecipe = async () => {
  try {
    const { data } = await useAuthFetch('/api/recipes', {
      method: 'POST',
      body: recipe.value
    })

    if (data.value) {
      // Redirect to the newly created recipe page
      router.push(`/recipes/${data.value.id}`)
    }
  } catch (error) {
    console.error('Error creating recipe:', error)
    // Handle error (e.g., show error message to user)
  }
}
</script>