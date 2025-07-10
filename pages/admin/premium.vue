<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Gestion des Plans Premium</h1>
        
        <!-- Barre de recherche et filtres -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1">
            <input 
              type="text" 
              v-model="searchInput" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Rechercher par description..." 
            />
          </div>
          <div class="flex gap-2">
            <select v-model="priceFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les prix</option>
              <option value="0-500">0€ - 500€</option>
              <option value="500-1000">500€ - 1000€</option>
              <option value="1000+">1000€+</option>
            </select>
            <select v-model="priorityFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Toutes les priorités</option>
              <option value="0">Priorité 0</option>
              <option value="1">Priorité 1</option>
              <option value="2">Priorité 2</option>
              <option value="3">Priorité 3</option>
            </select>
            <button 
              @click="refreshPremiums" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualiser
            </button>
            <button 
              @click="createPremium" 
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Nouveau Plan
            </button>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ totalPremiums }}</div>
            <div class="text-sm text-gray-600">Total plans</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ totalSubscriptions }}</div>
            <div class="text-sm text-gray-600">Total abonnements</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ formatTarif(averagePrice) }}€</div>
            <div class="text-sm text-gray-600">Prix moyen</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">{{ mostPopularPlan?.title || 'N/A' }}</div>
            <div class="text-sm text-gray-600">Plan le plus populaire</div>
          </div>
        </div>
      </div>

      <!-- Messages d'alerte -->
      <div v-if="alertMessage" class="mb-6">
        <div :class="[
          'p-4 rounded-lg',
          alertType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        ]">
          {{ alertMessage }}
        </div>
      </div>

      <!-- Liste des plans premium -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Plans Premium ({{ filteredPremiums.length }})</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abonnements</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priorité</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="premium in filteredPremiums" :key="premium._id || premium.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ premium.title || 'Pas de titre' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500">ID: {{ premium._id || premium.id }}</div>
                  <div class="text-sm font-medium text-gray-900">{{ premium.description || 'Sans description' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">{{ formatTarif(premium.tarif) }}€</div>
                  <div class="text-sm text-gray-500">{{ formatPrice(premium.tarif) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    premium.subCount > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ premium.subCount }} abonnés
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    getPriorityColor(premium.priorityId)
                  ]">
                    Priorité {{ premium.priorityId }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(premium.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="editPremium(premium)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Modifier
                    </button>
                    <button 
                      @click="duplicatePremium(premium)"
                      class="text-purple-600 hover:text-purple-900 transition-colors"
                    >
                      Dupliquer
                    </button>
                    <button 
                      @click="deletePremium(premium)"
                      class="text-red-600 hover:text-red-900 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de création/modification -->
      <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">
            {{ isCreating ? 'Créer un nouveau plan' : 'Modifier le plan premium' }}
          </h3>
          
          <form @submit.prevent="savePremium">
            <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input 
                    v-model.number="editingPremium.title" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  v-model="editingPremium.description" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Décrivez les fonctionnalités de ce plan..."
                  required
                ></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Prix (cts)</label>
                  <input 
                    v-model.number="editingPremium.tarif" 
                    type="number" 
                    min="0"
                    step="0.01"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                  <select 
                    v-model.number="editingPremium.priorityId"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="0">Priorité 0 (Basique)</option>
                    <option value="1">Priorité 1 (Standard)</option>
                    <option value="2">Priorité 2 (Premium)</option>
                    <option value="3">Priorité 3 (VIP)</option>
                  </select>
                </div>
              </div>
              
              <div v-if="!isCreating">
                <label class="block text-sm font-medium text-gray-700 mb-2">Nombre d'abonnements</label>
                <input 
                  v-model.number="editingPremium.subCount" 
                  type="number" 
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-gray-900 mb-2">Aperçu du plan</h4>
                <div class="text-sm text-gray-600">
                  <p><strong>Prix:</strong> {{ formatTarif(editingPremium.tarif) }}€ ({{ formatPrice(editingPremium.tarif) }})</p>
                  <p><strong>Priorité:</strong> {{ getPriorityLabel(editingPremium.priorityId) }}</p>
                  <p><strong>Description:</strong> {{ editingPremium.description || 'Aucune description' }}</p>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                @click="closeEditModal"
                class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                :disabled="isUpdating"
              >
                {{ isUpdating ? 'Sauvegarde...' : (isCreating ? 'Créer' : 'Mettre à jour') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de confirmation de suppression -->
      <div v-if="isDeleteModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4">Confirmer la suppression</h3>
          <p class="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer le plan "{{ premiumToDelete?.description }}" ? 
            Cette action est irréversible et peut affecter {{ premiumToDelete?.subCount }} abonnements.
          </p>
          
          <div class="flex justify-end space-x-3">
            <button 
              @click="closeDeleteModal"
              class="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Annuler
            </button>
            <button 
              @click="confirmDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              :disabled="isDeleting"
            >
              {{ isDeleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

// État réactif
const searchInput = ref('');
const priceFilter = ref('');
const priorityFilter = ref('');
const alertMessage = ref('');
const alertType = ref('success');
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isCreating = ref(false);
const editingPremium = ref({});
const premiumToDelete = ref(null);
const isUpdating = ref(false);
const isDeleting = ref(false);

// Récupération des plans premium
const { data: premiums, error, refresh } = await useFetch(`${config.public.SERVICE_BDD_URL}/api/premium`);

// Computed properties
const filteredPremiums = computed(() => {
  if (!premiums.value) return [];
  
  return premiums.value.filter(premium => {
    const matchesSearch = !searchInput.value || 
      premium.description?.toLowerCase().includes(searchInput.value.toLowerCase());
    
    const matchesPrice = !priceFilter.value || 
      (priceFilter.value === '0-500' && premium.tarif >= 0 && premium.tarif <= 50000) ||
      (priceFilter.value === '500-1000' && premium.tarif > 50000 && premium.tarif <= 100000) ||
      (priceFilter.value === '1000+' && premium.tarif > 100000);
    
    const matchesPriority = !priorityFilter.value || 
      premium.priorityId.toString() === priorityFilter.value;
    
    return matchesSearch && matchesPrice && matchesPriority;
  });
});

const totalPremiums = computed(() => premiums.value?.length || 0);
const totalSubscriptions = computed(() => premiums.value?.reduce((sum, p) => sum + (p.subCount || 0), 0) || 0);
const averagePrice = computed(() => {
  if (!premiums.value?.length) return 0;
  const total = premiums.value.reduce((sum, p) => sum + (p.tarif || 0), 0);
  return Math.round(total / premiums.value.length);
});
const mostPopularPlan = computed(() => {
  if (!premiums.value?.length) return null;
  return premiums.value.reduce((max, p) => (p.subCount > max.subCount ? p : max));
});

// Méthodes
const formatTarif = (tarif) => {
  if (!Number.isInteger(tarif)) {
    throw new Error("Le paramètre doit être un entier.");
  }

  const format = tarif / 100;
  return format.toFixed(2);
}

const showAlert = (message, type = 'success') => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = '';
  }, 5000);
};

const refreshPremiums = async () => {
  await refresh();
  showAlert('Plans premium actualisés avec succès');
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  if (price < 100) return 'Économique';
  if (price < 500) return 'Abordable';
  if (price < 1000) return 'Standard';
  return 'Premium';
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case 0: return 'bg-gray-100 text-gray-800';
    case 1: return 'bg-blue-100 text-blue-800';
    case 2: return 'bg-purple-100 text-purple-800';
    case 3: return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityLabel = (priority) => {
  switch (priority) {
    case 0: return 'Basique';
    case 1: return 'Standard';
    case 2: return 'Premium';
    case 3: return 'VIP';
    default: return 'Basique';
  }
};

const createPremium = () => {
  editingPremium.value = {
    tarif: 999,
    description: '',
    subCount: 0,
    priorityId: 0
  };
  isCreating.value = true;
  isEditModalOpen.value = true;
};

const editPremium = (premium) => {
  editingPremium.value = { ...premium };
  isCreating.value = false;
  isEditModalOpen.value = true;
};

const duplicatePremium = (premium) => {
  editingPremium.value = {
    ...premium,
    description: `${premium.description} (Copie)`,
    subCount: 0
  };
  delete editingPremium.value._id;
  delete editingPremium.value.id;
  isCreating.value = true;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingPremium.value = {};
  isCreating.value = false;
};

const savePremium = async () => {
  isUpdating.value = true;
  
  try {
    if (isCreating.value) {
      const { data } = await $fetch(`${config.public.SERVICE_BDD_URL}/api/premium`, {
        method: 'POST',
        body: editingPremium.value
      });
      
      premiums.value.push(data);
      showAlert('Plan premium créé avec succès');
    } else {
      const { data } = await $fetch(`${config.public.SERVICE_BDD_URL}/api/premium/${editingPremium.value._id || editingPremium.value.id}`, {
        method: 'PUT',
        body: editingPremium.value
      });
      
      const index = premiums.value.findIndex(p => (p._id || p.id) === (editingPremium.value._id || editingPremium.value.id));
      if (index !== -1) {
        premiums.value[index] = { ...editingPremium.value };
      }
      
      showAlert('Plan premium mis à jour avec succès');
    }
    
    closeEditModal();
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showAlert('Erreur lors de la sauvegarde du plan premium', 'error');
  } finally {
    isUpdating.value = false;
  }
};

const deletePremium = (premium) => {
  premiumToDelete.value = premium;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  premiumToDelete.value = null;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  
  try {
    await $fetch(`${config.public.SERVICE_BDD_URL}/api/premium/${premiumToDelete.value._id || premiumToDelete.value.id}`, {
      method: 'DELETE'
    });
    
    premiums.value = premiums.value.filter(p => (p._id || p.id) !== (premiumToDelete.value._id || premiumToDelete.value.id));
    
    showAlert('Plan premium supprimé avec succès');
    closeDeleteModal();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showAlert('Erreur lors de la suppression du plan premium', 'error');
  } finally {
    isDeleting.value = false;
  }
};

// Gestion des erreurs
if (error.value) {
  console.error('Erreur lors du chargement des plans premium:', error.value);
}
</script>