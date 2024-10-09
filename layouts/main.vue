<template>
    <div class="flex min-h-screen bg-gray-100">
      <!-- Left Sidebar -->
      <aside class="w-64 border-r border-gray-200 bg-white">
        <!-- Logo -->
        <div class="p-4">
          <h1 class="text-xl font-bold">RecipeApp</h1>
        </div>
        <!-- Navigation -->
        <nav class="mt-5">
          <NuxtLink to="/home" class="block px-4 py-2 hover:bg-gray-100">Home</NuxtLink>
          <NuxtLink to="/profile" class="block px-4 py-2 hover:bg-gray-100">Profile</NuxtLink>
          <NuxtLink to="/recipes" class="block px-4 py-2 hover:bg-gray-100">Recipes</NuxtLink>
        </nav>
      </aside>
  
      <!-- Main Content -->
      <main class="flex-1">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold">{{ $route.name }}</h2>
          <div class="flex items-center">
            <input type="text" placeholder="Search..." class="border rounded-full px-4 py-2 mr-4">
            <LogoutButton />
          </div>
        </header>
  
        <!-- Page Content -->
        <div class="p-4">
          <slot />
        </div>
      </main>
  
      <!-- Right Sidebar -->
      <aside class="w-64 border-l border-gray-200 bg-white p-4">
        <slot name="rhsSidebar">
          <!-- Trending or Suggested Content -->
        <h3 class="font-semibold mb-4">Trending Recipes</h3>
        <!-- Add trending recipes or other relevant content here -->
        </slot>
        
      </aside>
    </div>
  </template>
  
  <script setup lang="ts">
  </script>