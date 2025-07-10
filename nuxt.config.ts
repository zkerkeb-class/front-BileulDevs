// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxt/image', '@nuxt/ui'],
    vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/css/tailwind.css'],
    runtimeConfig: {
      public: {
        SERVICE_BDD_URL: process.env.SERVICE_BDD_URL,
        SERVICE_AUTH_URL: process.env.SERVICE_AUTH_URL,
        SERVICE_AI_URL: process.env.SERVICE_AI_URL,
        SERVICE_METRICS_URL: process.env.SERVICE_METRICS_URL,
        SERVICE_PAY_URL: process.env.SERVICE_PAY_URL
      }
  }
})