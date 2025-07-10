<template>
  <div class="w-full max-w-sm mx-auto">
    <!-- Titre avec style amélioré -->
    <div class="text-center mb-4">
      <h3 class="text-lg font-semibold text-gray-800 truncate" :title="name">
        {{ name }}
      </h3>
    </div>
    
    <!-- Container du graphique avec dimensions fixes -->
    <div class="relative h-48 w-48 mx-auto">
      <!-- Affichage conditionnel si pas de données -->
      <div v-if="hasNoData" class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="w-32 h-32 mx-auto border-4 border-gray-200 rounded-full flex items-center justify-center">
            <span class="text-gray-400 text-sm">Pas de données</span>
          </div>
        </div>
      </div>
      
      <!-- Graphique Chart.js -->
      <Doughnut 
        v-else
        :data="chartData" 
        :options="chartOptions"
        class="w-full h-full"
      />
      
      <!-- Valeur totale au centre -->
      <div v-if="!hasNoData" class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="text-center">
          <div class="text-2xl font-bold text-gray-800">{{ totalValue }}</div>
          <div class="text-xs text-gray-500 uppercase tracking-wide">Total</div>
        </div>
      </div>
    </div>
    
    <!-- Légende personnalisée -->
    <div v-if="!hasNoData" class="mt-4 space-y-2">
      <div 
        v-for="(item, index) in legendItems" 
        :key="index"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center space-x-2">
          <div 
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span class="text-gray-700">{{ item.label }}</span>
        </div>
        <div class="font-semibold text-gray-900">
          {{ item.value }}
          <span class="text-gray-500 ml-1">({{ item.percentage }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

// Enregistrement des composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

// Props avec validation améliorée
const props = defineProps({
  dataset: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && 
             Array.isArray(value.labels) && 
             Array.isArray(value.datasets) &&
             value.datasets.length > 0
    },
    default: () => ({
      labels: ["Info", "Warn", "Error"],
      datasets: [{
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        data: [0, 0, 0]
      }]
    })
  },
  name: {
    type: String,
    required: true,
    default: "Service Name"
  }
})

// Destructuration réactive des props
const { dataset, name } = toRefs(props)

// Vérification si il n'y a pas de données
const hasNoData = computed(() => {
  const data = dataset.value?.datasets?.[0]?.data || []
  return data.every(value => !value || value === 0)
})

// Calcul de la valeur totale
const totalValue = computed(() => {
  const data = dataset.value?.datasets?.[0]?.data || []
  return data.reduce((sum, value) => sum + (Number(value) || 0), 0)
})

// Données formatées pour le graphique
const chartData = computed(() => {
  if (hasNoData.value) return null
  
  return {
    labels: dataset.value.labels,
    datasets: [{
      ...dataset.value.datasets[0],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverBorderWidth: 3,
      hoverBorderColor: '#ffffff'
    }]
  }
})

// Options optimisées pour le graphique
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%', // Taille du trou central
  plugins: {
    legend: {
      display: false // On utilise notre légende personnalisée
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      borderColor: '#374151',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: (context) => {
          const value = context.parsed
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0)
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0
          return `${context.label}: ${value} (${percentage}%)`
        }
      }
    }
  },
  elements: {
    arc: {
      borderWidth: 0
    }
  },
  interaction: {
    intersect: false
  },
  animation: {
    duration: 800,
    easing: 'easeInOutQuart'
  }
}))

// Items pour la légende personnalisée
const legendItems = computed(() => {
  if (hasNoData.value) return []
  
  const labels = dataset.value.labels || []
  const data = dataset.value.datasets[0]?.data || []
  const colors = dataset.value.datasets[0]?.backgroundColor || []
  const total = totalValue.value
  
  return labels.map((label, index) => ({
    label,
    value: data[index] || 0,
    color: colors[index] || '#6B7280',
    percentage: total > 0 ? Math.round(((data[index] || 0) / total) * 100) : 0
  })) // Suppression du filtre .filter(item => item.value > 0)
})
</script>

<style scoped>
/* Styles additionnels si nécessaire */
</style>