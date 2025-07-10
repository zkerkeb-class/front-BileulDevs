<template>
  <div class="mx-auto bg-white rounded-2xl shadow p-4 mb-6 w-2/3">
    <!-- Header : Avatar + Nom + Temps -->
    <div class="flex justify-between items-center">
      <div class="flex items-center mb-3">
        <UIAvatar
          :alt="localPost.user?.username || 'Utilisateur'"
          size="sm"
          class="w-10 h-10 rounded-full mr-3"
          v-if="!localPost.user?.image"
        />
        <NuxtImg
          :src="localPost.user?.avatar"
          class="w-10 h-10 rounded-full mr-3"
          v-else
        />
        <span class="font-semibold">{{ localPost.user?.username || 'Utilisateur inconnu' }}</span>
      </div>
      <div class="mb-3">
        <p class="font-medium">{{ postedTime }}</p>
      </div>
    </div>

    <!-- Carousel Swiper -->
    <Swiper
      :modules="[Pagination]"
      :pagination="{ clickable: true }"
      :loop="false"
      class="rounded-xl mb-3"
      v-if="localPost.images && localPost.images.length > 0"
    >
      <SwiperSlide v-for="(image, index) in localPost.images" :key="index">
        <NuxtImg
          :src="image"
          class="w-full h-96 object-cover rounded-xl"
          alt="Image du post"
        />
      </SwiperSlide>
    </Swiper>

    <!-- Likes + Timestamp -->
    <div class="flex justify-between items-center text-sm text-gray-600">
      <button
        @click.prevent="likePost"
        :class="[
          'relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ease-out select-none group',
          'hover:bg-red-50 hover:scale-105 hover:cursor-pointer',
          hasLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-400',
          isAnimating && 'animate-pulse'
        ]"
        :disabled="isLoading"
      >
        <!-- Particules d'animation -->
        <div v-if="showParticles" class="absolute inset-0 pointer-events-none">
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span class="absolute text-red-400 text-xs animate-ping opacity-75">💕</span>
            <span class="absolute text-red-500 text-xs animate-bounce" style="animation-delay: 0.1s;">✨</span>
          </div>
        </div>

        <!-- Icône cœur -->
        <span
          :class="[
            'text-lg transition-all duration-300 ease-out inline-block',
            hasLiked ? 'text-red-500 scale-110' : 'group-hover:scale-110',
            isAnimating && (hasLiked ? 'animate-bounce' : 'animate-pulse')
          ]"
        >
          {{ hasLiked ? '❤️' : '🤍' }}
        </span>

        <!-- Compteur -->
        <span
          :class="[
            'font-medium transition-all duration-300 ease-out',
            hasLiked ? 'text-red-600' : 'text-gray-700 group-hover:text-red-500',
            isAnimating && 'scale-110'
          ]"
        >
          {{ localPost.likes || 0 }}
        </span>

        <span class="text-gray-500 group-hover:text-red-400 transition-colors duration-200">
          {{ (localPost.likes || 0) > 1 ? 'likes' : 'like' }}
        </span>

        <!-- Loading -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center"
        >
          <div class="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      </button>

      <span>{{ localPost.timestamp }}</span>
    </div>

    <!-- Description -->
    <p class="mt-2">
      <span class="font-bold">{{ localPost.user?.username || 'Utilisateur inconnu' }}</span>
      {{ localPost.description }}
      <PostTags :tags="localPost?.tags" />
    </p>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const config = useRuntimeConfig()
const { user } = useAuth()

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const localPost = ref({ ...props.post })
const hasLiked = ref(localPost.value.whoLiked?.includes(user.value?.id) || false)
const isLoading = ref(false)
const isAnimating = ref(false)
const showParticles = ref(false)

const postedTime = computed(() => {
  if (!localPost.value?.createdAt) return ''

  const now = new Date()
  const created = new Date(localPost.value.createdAt)
  const diffMs = now.getTime() - created.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return `${seconds}s`
  if (minutes < 60) return `${minutes}min`
  if (hours < 24) return `${hours}h`
  return `${days}j`
})

const triggerAnimation = () => {
  isAnimating.value = true

  if (hasLiked.value) {
    showParticles.value = true
    setTimeout(() => {
      showParticles.value = false
    }, 800)
  }

  setTimeout(() => {
    isAnimating.value = false
  }, 600)
}

const likePost = async () => {
  if (isLoading.value || !user.value?.id) return

  try {
    isLoading.value = true

    const url = `${config.public.SERVICE_BDD_URL}/api/posts/like/${localPost.value.id}`

    const response = await $fetch(url, {
      method: 'PUT',
      body: { hasLiked: user.value.id },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    localPost.value.likes = response.likes
    localPost.value.whoLiked = response.whoLiked
    hasLiked.value = response.whoLiked?.includes(user.value.id) || false

    triggerAnimation()
  } catch (err) {
    console.error('Erreur lors du like :', err.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes heartBeat {
  0%, 50%, 100% {
    transform: scale(1);
  }
  25%, 75% {
    transform: scale(1.1);
  }
}

.animate-heartbeat {
  animation: heartBeat 0.6s ease-in-out;
}

@keyframes float-up {
  0% {
    opacity: 1;
    transform: translateY(0px) scale(0.8);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(1.2);
  }
}

.animate-float-up {
  animation: float-up 0.8s ease-out forwards;
}
</style>