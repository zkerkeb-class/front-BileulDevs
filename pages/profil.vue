<template>
  <div class="min-h-screen">
    <!-- Header du profil -->
    <div class="border-b border-gray-100">
      <div class="w-full px-6 py-12">
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center gap-8">
            <!-- Avatar -->
            <div class="flex-shrink-0">
              <div v-if="user.avatar == null" class="bg-gray-400 relative flex shrink-0 overflow-hidden rounded-full h-32 w-32">
                <span class="flex h-full w-full items-center justify-center rounded-full text-3xl font-light text-white">
                  {{ userInitial }}
                </span>
              </div>
              <NuxtImg
                :src="user.avatar"
                class="w-32 h-32 rounded-full object-cover"
                :alt="user.username"
                v-else
              />
            </div>

            <!-- Infos du profil -->
            <div class="flex-1">
              <!-- Statistiques -->
              <div class="mb-2">
                <div class="text-2xl font-light text-gray-900">{{ userPosts.length }}</div>
                <div class="text-sm text-gray-500">{{ userPosts.length > 1 ? 'publications' : 'publication' }}</div>
              </div>

              <!-- Nom -->
              <h1 class="text-xl font-medium text-gray-900 mb-1">{{ user.username }}</h1>
            </div>
          </div>

          <!-- Boutons d'action -->
          <div class="flex items-center gap-3 ml-8">
            <Nuxt-link to="/settings" class="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Modifier le profil
            </Nuxt-link>
            <Nuxt-link to="/premium" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Premium
            </Nuxt-link>
            <button class="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation des onglets -->
    <div class="border-b border-gray-100">
      <div class="w-full px-6">
        <div class="flex justify-center">
          <button
            @click="activeTab = 'posts'"
            :class="[
              'flex items-center gap-2 px-6 py-4 border-t-2 font-medium text-sm transition-colors',
              activeTab === 'posts' 
                ? 'border-gray-900 text-gray-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            ]"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/>
            </svg>
            PUBLICATIONS
          </button>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="w-full px-6 py-8">
      <!-- Onglet Publications -->
      <div v-if="activeTab === 'posts'">
        <!-- Grille de posts -->
        <div class="grid grid-cols-3 gap-1 max-w-4xl mx-auto">
          <div 
            v-for="post in userPosts" 
            :key="post.id"
            class="aspect-square bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity group relative"
            @click="openPost(post)"
          >
            <NuxtImg
              :src="post.images[0]"
              class="w-full h-full object-cover"
              :alt="`Post de ${user.username}`"
            />
            
            <!-- Icône de suppression -->
            <div
              @click.stop="deletePost(post.id)"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center hover:cursor-pointer z-10"
            >
              <Icon name="lucide:trash-2" class="w-4 h-4" />
            </div>
            
            <!-- Overlay avec stats -->
            <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="flex items-center gap-4 text-white">
                <div class="flex items-center gap-1">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-medium">{{ post.likes }}</span>
                </div>
                <div class="flex items-center gap-1" v-if="post.commentsCount">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/>
                  </svg>
                  <span class="font-medium">{{ post.commentsCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucun post -->
        <div v-if="userPosts.length === 0" class="text-center py-20">
          <div class="text-gray-300 mb-6">
            <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-light text-gray-400 mb-3">Aucune publication pour le moment</h3>
          <p class="text-gray-500 text-lg">Partagez vos premiers moments !</p>
        </div>
      </div>
    </div>

    <!-- Modal pour post détaillé -->
    <div 
      v-if="selectedPost" 
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      @click="closePost"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 class="font-semibold">Publication</h3>
          <button @click="closePost" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <PostCard :post="selectedPost" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user } = useAuth()
const config = useRuntimeConfig()

// États réactifs
const activeTab = ref('posts')
const selectedPost = ref(null)
const userPosts = ref([])
const isLoading = ref(false)

const userInitial = computed(() => {
  return user.value.username ? user.value.username.charAt(0).toUpperCase() : '';
})

const deletePost = async (postId) => {
  try {
    const confirmed = confirm('Êtes-vous sûr de vouloir supprimer ce post ?')
    
    if (!confirmed) return
    
    const url = `${config.public.SERVICE_BDD_URL}/api/posts/${postId}`
    
    await $fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    userPosts.value = userPosts.value.filter(post => post.id !== postId)
    
    console.log('Post supprimé avec succès')
    
  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error)
    alert('Erreur lors de la suppression du post')
  }
}

const fetchUserPosts = async () => {
  isLoading.value = true
  try {
    const response = await $fetch(`${config.public.SERVICE_BDD_URL}/api/users/${user.value.id}/posts`)
    userPosts.value = response.posts
    
  } catch (error) {
    console.error('Erreur lors du chargement des posts:', error)
  } finally {
    isLoading.value = false
  }
}

const openPost = (post) => {
  selectedPost.value = post
}

const closePost = () => {
  selectedPost.value = null
}

// Lifecycle
onMounted(() => {
  fetchUserPosts()
})

// Meta
definePageMeta({
  title: 'Profil'
})
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>