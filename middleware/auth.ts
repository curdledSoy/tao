export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()
  
  // List of routes that require authentication
  const protectedRoutes = ['/profile', '/dashboard', '/home']
  
  if (protectedRoutes.includes(to.path) && !auth.value.token) {
    // Redirect to login page if trying to access a protected route without authentication
    return navigateTo('/login')
  }
})