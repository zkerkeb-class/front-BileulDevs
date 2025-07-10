<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Gestion des publications</h1>
        
        <!-- Barre de recherche et filtres -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1">
            <input 
              type="text" 
              v-model="searchInput" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Rechercher par marque, modèle, description ou tags..." 
            />
          </div>
          <div class="flex gap-2">
            <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="deactivated">Désactivé</option>
            </select>
            <select v-model="brandFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Toutes les marques</option>
              <option v-for="brand in uniqueBrands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
            <button 
              @click="refreshPosts" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ totalPosts }}</div>
            <div class="text-sm text-gray-600">Total des posts</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ activePosts }}</div>
            <div class="text-sm text-gray-600">Posts actifs</div>
          </div>
          <div class="bg-red-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-red-600">{{ deactivatedPosts }}</div>
            <div class="text-sm text-gray-600">Posts désactivés</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ totalLikes }}</div>
            <div class="text-sm text-gray-600">Total des likes</div>
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

      <!-- Liste des posts -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Posts ({{ filteredPosts.length }})</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicule</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-12 w-12">
                      <img 
                        v-if="post.images && post.images.length > 0" 
                        :src="post.images[0]" 
                        :alt="`${post.brand} ${post.model}`" 
                        class="h-12 w-12 rounded-lg object-cover"
                      >
                      <div v-else class="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ post.brand }} {{ post.model }}</div>
                      <div class="text-sm text-gray-500">{{ post.images?.length || 0 }} image(s)</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ truncateText(post.description, 60) }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="tag in post.tags" 
                      :key="tag"
                      class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <svg class="h-4 w-4 text-red-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-sm text-gray-900">{{ post.likes }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    !post.isDeactivated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ !post.isDeactivated ? 'Actif' : 'Désactivé' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(post.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="editPost(post)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                        Modifier
                    </button>
                    <button 
                      @click="togglePostStatus(post)"
                      :class="[
                        'transition-colors',
                        !post.isDeactivated ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      ]"
                    >
                      {{ !post.isDeactivated ? 'Désactiver' : 'Activer' }}
                    </button>
                    <button 
                      @click="deletePost(post)"
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

      <!-- Modal de modification -->
      <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">Modifier le post</h3>
          
          <form @submit.prevent="updatePost">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Marque</label>
                  <input 
                    v-model="editingPost.brand" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
                  <input 
                    v-model="editingPost.model" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    v-model="editingPost.description" 
                    rows="4" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tags (séparés par des virgules)</label>
                  <input 
                    v-model="tagsInput" 
                    type="text" 
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tuning, japon, sportive"
                  />
                </div>
                
                <div>
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="editingPost.isDeactivated"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Post désactivé</span>
                  </label>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Images</label>
                  <div class="space-y-2">
                    <div v-for="(image, index) in editingPost.images" :key="index" class="flex items-center space-x-2">
                      <input 
                        v-model="editingPost.images[index]" 
                        type="url" 
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="URL de l'image"
                      />
                      <button 
                        type="button" 
                        @click="removeImage(index)"
                        class="px-2 py-2 text-red-600 hover:text-red-900"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                    <button 
                      type="button" 
                      @click="addImage"
                      class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 transition-colors"
                    >
                      + Ajouter une image
                    </button>
                  </div>
                </div>
                
                <!-- Prévisualisation des images -->
                <div v-if="editingPost.images && editingPost.images.length > 0" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Prévisualisation</label>
                  <div class="grid grid-cols-2 gap-2">
                    <img 
                      v-for="(image, index) in editingPost.images.filter(img => img)" 
                      :key="index"
                      :src="image" 
                      :alt="`Image ${index + 1}`"
                      class="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
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
                {{ isUpdating ? 'Mise à jour...' : 'Mettre à jour' }}
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
            Êtes-vous sûr de vouloir supprimer le post "{{ postToDelete?.brand }} {{ postToDelete?.model }}" ? 
            Cette action est irréversible.
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
const statusFilter = ref('');
const brandFilter = ref('');
const alertMessage = ref('');
const alertType = ref('success');
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editingPost = ref({});
const postToDelete = ref(null);
const isUpdating = ref(false);
const isDeleting = ref(false);
const tagsInput = ref('');

// Récupération des posts
const { data: posts, error, refresh } = await useFetch(`${config.public.SERVICE_BDD_URL}/api/posts`);

// Computed properties
const filteredPosts = computed(() => {
  if (!posts.value) return [];
  
  return posts.value.filter(post => {
    const matchesSearch = !searchInput.value || 
      post.brand?.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      post.model?.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchInput.value.toLowerCase()));
    
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && !post.isDeactivated) ||
      (statusFilter.value === 'deactivated' && post.isDeactivated);
    
    const matchesBrand = !brandFilter.value || post.brand === brandFilter.value;
    
    return matchesSearch && matchesStatus && matchesBrand;
  });
});

const uniqueBrands = computed(() => {
  if (!posts.value) return [];
  const brands = posts.value.map(post => post.brand).filter(Boolean);
  return [...new Set(brands)].sort();
});

const totalPosts = computed(() => posts.value?.length || 0);
const activePosts = computed(() => posts.value?.filter(p => !p.isDeactivated).length || 0);
const deactivatedPosts = computed(() => posts.value?.filter(p => p.isDeactivated).length || 0);
const totalLikes = computed(() => posts.value?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0);

// Méthodes
const showAlert = (message, type = 'success') => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = '';
  }, 5000);
};

const refreshPosts = async () => {
  await refresh();
  showAlert('Posts actualisés avec succès');
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const editPost = (post) => {
  editingPost.value = { 
    ...post, 
    images: [...(post.images || [])],
    tags: [...(post.tags || [])]
  };
  tagsInput.value = post.tags?.join(', ') || '';
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingPost.value = {};
  tagsInput.value = '';
};

const addImage = () => {
  if (!editingPost.value.images) {
    editingPost.value.images = [];
  }
  editingPost.value.images.push('');
};

const removeImage = (index) => {
  editingPost.value.images.splice(index, 1);
};

const updatePost = async () => {
  isUpdating.value = true;
  
  try {
    // Traitement des tags

    delete editingPost.value.user

    editingPost.value.tags = tagsInput.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Nettoyage des images vides
    editingPost.value.images = editingPost.value.images.filter(img => img.trim().length > 0);
    
    const { data } = await $fetch(`${config.public.SERVICE_BDD_URL}/api/posts/${editingPost.value.id}`, {
      method: 'PUT',
      body: editingPost.value
    });
    
    // Mettre à jour le post dans la liste
    const index = posts.value.findIndex(p => p.id === editingPost.value.id);
    if (index !== -1) {
      posts.value[index] = { ...editingPost.value };
    }
    
    showAlert('Post mis à jour avec succès');
    closeEditModal();
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    showAlert('Erreur lors de la mise à jour du post', 'error');
  } finally {
    isUpdating.value = false;
  }
};

const togglePostStatus = async (post) => {
  try {

    const updatedPost = { ...post, isDeactivated: !post.isDeactivated };
    
    delete updatedPost.user

    await $fetch(`${config.public.SERVICE_BDD_URL}/api/posts/${post.id}`, {
      method: 'PUT',
      body: updatedPost
    });
    
    // Mettre à jour le statut dans la liste
    const index = posts.value.findIndex(p => p.id === post.id);
    if (index !== -1) {
      posts.value[index].isDeactivated = !post.isDeactivated;
    }
    
    showAlert(`Post ${!post.isDeactivated ? 'activé' : 'désactivé'} avec succès`);
  } catch (error) {
    console.error('Erreur lors du changement de statut:', error);
    showAlert('Erreur lors du changement de statut', 'error');
  }
};

const deletePost = (post) => {
  postToDelete.value = post;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  postToDelete.value = null;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  
  try {
    await $fetch(`${config.public.SERVICE_BDD_URL}/api/posts/${postToDelete.value.id}`, {
      method: 'DELETE'
    });
    
    // Supprimer le post de la liste
    posts.value = posts.value.filter(p => p.id !== postToDelete.value.id);
    
    showAlert('Post supprimé avec succès');
    closeDeleteModal();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showAlert('Erreur lors de la suppression du post', 'error');
  } finally {
    isDeleting.value = false;
  }
};

// Gestion des erreurs
if (error.value) {
  console.error('Erreur lors du chargement des posts:', error.value);
}
</script>