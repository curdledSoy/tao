<template>
  <div>
    <div v-for="recipe in recipes" :key="recipe.id" class="mb-8">
      <RecipeCard :recipe="recipe" />
    </div>
    <div v-if="loading" class="text-center py-4">
      <p>Loading more recipes...</p>
    </div>
    <div v-if="error" class="text-center py-4 text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'


const recipes = ref<any[]>([])
const page = ref(1)
const loading = ref(false)
const error = ref('')

const fetchRecipes = async () => {
  if (loading.value) return
  loading.value = true
  try {
    const { data } = await useAuthFetch(`/api/recipes`, {
      query: { page: page.value, limit: 10 }
    })
    if (data.value) {
      recipes.value.push(...data.value.recipes)
      page.value++
    }
  } catch (err) {
    error.value = 'Failed to load recipes. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleScroll = () => {
  const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight
  if (bottomOfWindow) {
    fetchRecipes()
  }
}

onMounted(() => {
  fetchRecipes()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>