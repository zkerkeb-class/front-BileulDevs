<template>
  <div class="container mx-auto px-5 py-8 max-w-7xl">
    <header class="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b-2 border-gray-200">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 md:mb-0">📊 Administration</h1>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <Nuxt-link v-for="service in services" :key="service.name" :to="service.to" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ service.name }}</h2>
          <div class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
            {{ (service.stats) }}
          </div>
        </div>
        <div class="flex justify-center my-6 text-sm text-center text-gray-500">
          {{ service.description }}
        </div>
      </Nuxt-link>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig()

const services = ref([
    {
        name: "〽️ Metrics",
        to: "/admin/metrics",
        description: "Consulte les différentes métrics de chaque micro-services"
    },
    {
        name: "📸 Publications",
        to: "/admin/posts",
        description: "Gère les publications qui apparaissent sur SpotR"
    },
    {
        name: "🙋 Utilisateurs",
        to: "/admin/users",
        description: "Gère les utilisateurs de SpotR"
    },
    {
        name: "💰 Premium",
        to: "/admin/premium",
        description: "Gère les tarifs de la fonctionnalité Premium"
    }
])

</script>