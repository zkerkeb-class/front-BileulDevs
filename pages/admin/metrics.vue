<template>
  <div class="container mx-auto px-5 py-8 max-w-7xl">
    <header class="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b-2 border-gray-200">
      <h1 class="text-4xl font-bold text-gray-900 mb-4 md:mb-0">Dashboard Metrics</h1>
      <div class="flex flex-col md:flex-row items-center gap-4 text-gray-500">
        <span class="text-sm">Dernière mise à jour : {{ lastUpdate }}</span>
        <button @click="refreshData" class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5">
          <span class="text-base refresh-icon">🔄</span>
          Actualiser
        </button>
      </div>
    </header>

    <div v-if="loading" class="flex flex-col items-center justify-center py-16">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full loading-spinner mb-6"></div>
      <p class="text-gray-600">Chargement des métriques...</p>
    </div>

    <div v-else-if="error" class="flex justify-center items-center py-16">
      <div class="text-center p-10 bg-red-50 border border-red-200 rounded-xl text-red-600">
        <h3 class="text-lg font-semibold mb-2">Erreur de chargement</h3>
        <p class="mb-4">{{ error }}</p>
        <button @click="refreshData" class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Réessayer
        </button>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      <div v-for="service in services" :key="service.name" class="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ service.name }}</h2>
          <div class="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide" :class="getServiceStatusClass(service.stats)">
            {{ getServiceStatusText(service.stats) }}
          </div>
        </div>
        
        <div class="flex justify-center my-6">
          <MetricsDonutChart :dataset="formatDatasetForService(service)" :name="service.name" />
        </div>
        

      </div>
    </div>

    <div v-if="services.length === 0 && !loading" class="text-center py-20 text-gray-500">
      <div class="text-6xl mb-6">📊</div>
      <h3 class="text-xl text-gray-700 mb-3">Aucun service trouvé</h3>
      <p>Réessayez plus tard.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const config = useRuntimeConfig()

// État réactif
const services = ref([])
const loading = ref(true)
const error = ref(null)
const lastUpdate = ref('')

// Fonction pour charger les données
const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    const { data: dataset, error: fetchError } = await useFetch(`${config.public.SERVICE_METRICS_URL}/api/metrics`)
    
    if (fetchError.value) {
      throw new Error(fetchError.value.message || 'Erreur lors du chargement des données')
    }
    
    services.value = dataset.value || []
    lastUpdate.value = new Date().toLocaleString('fr-FR')
    
  } catch (err) {
    error.value = err.message
    console.error('Erreur de chargement:', err)
  } finally {
    loading.value = false
  }
}

// Fonction pour actualiser les données
const refreshData = () => {
  loadData()
}

// Formater les données pour le composant Donut
const formatDatasetForService = (service) => {
  return {
    labels: ["Infos", "Warns", "Errors"],
    datasets: [
      {
        backgroundColor: ['#41B883', 'orange', '#DD1B16'],
        data: [
          parseInt(service.stats.success) || 0,
          parseInt(service.stats.warn) || 0,
          parseInt(service.stats.error) || 0
        ]
      }
    ]
  }
}

// Déterminer la classe CSS du statut d'un service
const getServiceStatusClass = (stats) => {
  const errors = parseInt(stats.error) || 0
  const warns = parseInt(stats.warn) || 0
  const success = parseInt(stats.success) || 0
  
  if (errors > 5) return 'bg-red-100 text-red-800'
  if (warns > 15) return 'bg-yellow-100 text-yellow-800'
  if (success > 0) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}

// Texte du statut
const getServiceStatusText = (stats) => {
  const errors = parseInt(stats.error) || 0
  const warns = parseInt(stats.warn) || 0
  const success = parseInt(stats.success) || 0
  
  if (errors > 5) return 'Critique'
  if (warns > 15) return 'Attention'
  if (success > 0) return 'Sain'
  return 'Inconnu'
}

// Charger les données au montage
onMounted(() => {
  loadData()
})
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
</style>