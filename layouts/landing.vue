<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-blue-600">RecipeApp</h1>
        <nav>
          <NuxtLink to="/login" class="text-gray-600 hover:text-gray-900 mr-4">Login</NuxtLink>
          <NuxtLink to="/register" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-20">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">Product</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-gray-300">Features</a></li>
              <li><a href="#" class="hover:text-gray-300">Pricing</a></li>
              <li><a href="#" class="hover:text-gray-300">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Company</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-gray-300">About</a></li>
              <li><a href="#" class="hover:text-gray-300">Blog</a></li>
              <li><a href="#" class="hover:text-gray-300">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Resources</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-gray-300">Documentation</a></li>
              <li><a href="#" class="hover:text-gray-300">Support</a></li>
              <li><a href="#" class="hover:text-gray-300">API</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Legal</h3>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-gray-300">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-gray-300">Terms of Service</a></li>
              <li><a href="#" class="hover:text-gray-300">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; 2024 RecipeApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Any necessary imports or setup logic
</script>