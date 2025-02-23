// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", 'nuxt-icon', "unplugin-icons/nuxt", '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      'Timmana': [400, 700],
    },
    display: 'swap'
  },
  runtimeConfig: {
    public: {
      apiBase: "https://jsonfakery.com/movies",
    },
  },
  icon: {
    customCollections: [
      {
        prefix: 'my-icon',
        dir: './assets/my-icons'
      },
    ],
  },
});
