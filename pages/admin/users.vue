<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Gestion des Utilisateurs</h1>
        
        <!-- Barre de recherche et filtres -->
        <div class="flex flex-col sm:flex-row gap-4 mb-6">
          <div class="flex-1">
            <input 
              type="text" 
              v-model="searchInput" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Rechercher par nom d'utilisateur ou email..." 
            />
          </div>
          <div class="flex gap-2">
            <select v-model="roleFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="user">Utilisateurs</option>
            </select>
            <select v-model="verificationFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les statuts</option>
              <option value="verified">Email vérifié</option>
              <option value="unverified">Email non vérifié</option>
            </select>
            <select v-model="providerFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="">Tous les providers</option>
              <option value="local">Local</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
            </select>
            <button 
              @click="refreshUsers" 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ totalUsers }}</div>
            <div class="text-sm text-gray-600">Total utilisateurs</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ verifiedUsers }}</div>
            <div class="text-sm text-gray-600">Emails vérifiés</div>
          </div>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ adminUsers }}</div>
            <div class="text-sm text-gray-600">Administrateurs</div>
          </div>
          <div class="bg-orange-50 p-4 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">{{ recentUsers }}</div>
            <div class="text-sm text-gray-600">Nouveaux (7 jours)</div>
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

      <!-- Liste des utilisateurs -->
      <div class="bg-white shadow rounded-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Utilisateurs ({{ filteredUsers.length }})</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateur</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date d'inscription</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <img 
                        v-if="user.avatar" 
                        :src="user.avatar" 
                        :alt="user.username" 
                        class="h-10 w-10 rounded-full object-cover"
                      >
                      <div v-else class="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                      <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                  <div class="text-sm text-gray-500">
                    {{ user.isEmailVerified ? 'Vérifié' : 'Non vérifié' }}
                    <span v-if="user.emailVerifiedAt" class="ml-1">({{ formatDate(user.emailVerifiedAt) }})</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    user.isAdmin ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ user.isAdmin ? 'Administrateur' : 'Utilisateur' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                    user.provider === 'local' ? 'bg-blue-100 text-blue-800' : 
                    user.provider === 'google' ? 'bg-red-100 text-red-800' : 
                    'bg-indigo-100 text-indigo-800'
                  ]">
                    {{ user.provider || 'Local' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button 
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      Modifier
                    </button>
                    <button 
                      @click="toggleAdminStatus(user)"
                      :class="[
                        'transition-colors',
                        user.isAdmin ? 'text-orange-600 hover:text-orange-900' : 'text-purple-600 hover:text-purple-900'
                      ]"
                    >
                      {{ user.isAdmin ? 'Rétrograder' : 'Promouvoir' }}
                    </button>
                    <button 
                      v-if="!user.isEmailVerified"
                      @click="verifyEmail(user)"
                      class="text-green-600 hover:text-green-900 transition-colors"
                    >
                      Vérifier
                    </button>
                    <button 
                      @click="deleteUser(user)"
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
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 class="text-lg font-semibold mb-4">Modifier l'utilisateur</h3>
          
          <form @submit.prevent="updateUser">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                <input 
                  v-model="editingUser.username" 
                  type="text" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  v-model="editingUser.email" 
                  type="email" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">URL de l'avatar</label>
                <input 
                  v-model="editingUser.avatar" 
                  type="url" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="editingUser.isAdmin"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Administrateur</span>
                  </label>
                </div>
                <div>
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="editingUser.isEmailVerified"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">Email vérifié</span>
                  </label>
                </div>
              </div>
              
              <div v-if="editingUser.avatar" class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Prévisualisation de l'avatar</label>
                <img 
                  :src="editingUser.avatar" 
                  :alt="editingUser.username"
                  class="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                />
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
            Êtes-vous sûr de vouloir supprimer l'utilisateur "{{ userToDelete?.username }}" ? 
            Cette action est irréversible et supprimera également tous ses posts.
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
const roleFilter = ref('');
const verificationFilter = ref('');
const providerFilter = ref('');
const alertMessage = ref('');
const alertType = ref('success');
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const editingUser = ref({});
const userToDelete = ref(null);
const isUpdating = ref(false);
const isDeleting = ref(false);

// Récupération des utilisateurs
const { data: users, error, refresh } = await useFetch(`${config.public.SERVICE_BDD_URL}/api/users`);

// Computed properties
const filteredUsers = computed(() => {
  if (!users.value) return [];
  
  return users.value.filter(user => {
    const matchesSearch = !searchInput.value || 
      user.username?.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchInput.value.toLowerCase());
    
    const matchesRole = !roleFilter.value || 
      (roleFilter.value === 'admin' && user.isAdmin) ||
      (roleFilter.value === 'user' && !user.isAdmin);
    
    const matchesVerification = !verificationFilter.value || 
      (verificationFilter.value === 'verified' && user.isEmailVerified) ||
      (verificationFilter.value === 'unverified' && !user.isEmailVerified);
    
    const matchesProvider = !providerFilter.value || user.provider === providerFilter.value;
    
    return matchesSearch && matchesRole && matchesVerification && matchesProvider;
  });
});

const totalUsers = computed(() => users.value?.length || 0);
const verifiedUsers = computed(() => users.value?.filter(u => u.isEmailVerified).length || 0);
const adminUsers = computed(() => users.value?.filter(u => u.isAdmin).length || 0);
const recentUsers = computed(() => {
  if (!users.value) return 0;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return users.value.filter(u => new Date(u.createdAt) > weekAgo).length;
});

// Méthodes
const showAlert = (message, type = 'success') => {
  alertMessage.value = message;
  alertType.value = type;
  setTimeout(() => {
    alertMessage.value = '';
  }, 5000);
};

const refreshUsers = async () => {
  await refresh();
  showAlert('Utilisateurs actualisés avec succès');
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

const editUser = (user) => {
  editingUser.value = { ...user };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editingUser.value = {};
};

const updateUser = async () => {
  isUpdating.value = true;
  
  try {
    // Si l'email est vérifié et qu'il n'y avait pas de date, on ajoute la date actuelle
    if (editingUser.value.isEmailVerified && !editingUser.value.emailVerifiedAt) {
      editingUser.value.emailVerifiedAt = new Date().toISOString();
    }
    
    const { data } = await $fetch(`${config.public.SERVICE_BDD_URL}/api/users/${editingUser.value.id}`, {
      method: 'PUT',
      body: editingUser.value
    });
    
    // Mettre à jour l'utilisateur dans la liste
    const index = users.value.findIndex(u => u.id === editingUser.value.id);
    if (index !== -1) {
      users.value[index] = { ...editingUser.value };
    }
    
    showAlert('Utilisateur mis à jour avec succès');
    closeEditModal();
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    showAlert('Erreur lors de la mise à jour de l\'utilisateur', 'error');
  } finally {
    isUpdating.value = false;
  }
};

const toggleAdminStatus = async (user) => {
  try {
    const updatedUser = { ...user, isAdmin: !user.isAdmin };
    
    await $fetch(`${config.public.SERVICE_BDD_URL}/api/users/${user.id}`, {
      method: 'PUT',
      body: updatedUser
    });
    
    // Mettre à jour le statut dans la liste
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users.value[index].isAdmin = !user.isAdmin;
    }
    
    showAlert(`Utilisateur ${!user.isAdmin ? 'promu administrateur' : 'rétrogradé utilisateur'} avec succès`);
  } catch (error) {
    console.error('Erreur lors du changement de rôle:', error);
    showAlert('Erreur lors du changement de rôle', 'error');
  }
};

const verifyEmail = async (user) => {
  try {
    const updatedUser = { 
      ...user, 
      isEmailVerified: true, 
      emailVerifiedAt: new Date().toISOString() 
    };
    
    await $fetch(`${config.public.SERVICE_BDD_URL}/api/users/${user.id}`, {
      method: 'PUT',
      body: updatedUser
    });
    
    // Mettre à jour le statut dans la liste
    const index = users.value.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users.value[index].isEmailVerified = true;
      users.value[index].emailVerifiedAt = updatedUser.emailVerifiedAt;
    }
    
    showAlert('Email vérifié avec succès');
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    showAlert('Erreur lors de la vérification de l\'email', 'error');
  }
};

const deleteUser = (user) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const confirmDelete = async () => {
  isDeleting.value = true;
  
  try {
    await $fetch(`${config.public.SERVICE_BDD_URL}/api/users/${userToDelete.value.id}`, {
      method: 'DELETE'
    });
    
    // Supprimer l'utilisateur de la liste
    users.value = users.value.filter(u => u.id !== userToDelete.value.id);
    
    showAlert('Utilisateur supprimé avec succès');
    closeDeleteModal();
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    showAlert('Erreur lors de la suppression de l\'utilisateur', 'error');
  } finally {
    isDeleting.value = false;
  }
};

// Gestion des erreurs
if (error.value) {
  console.error('Erreur lors du chargement des utilisateurs:', error.value);
}
</script>