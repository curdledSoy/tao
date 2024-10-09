// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  runtimeConfig:{
    databaseHost: 'sqlite.db',
    jwtSecret: 'secret'
  },

  routeRules: {
    '/profile': { appMiddleware: ['auth'] },
    '/home': { appMiddleware: ['auth'] },
    '/recipes': {appMiddleware: ['auth']}
    // Add more protected routes as needed
  },
  nitro: {
    publicAssets: [
      {
        dir: 'public/uploads',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      }
    ]
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon']
})