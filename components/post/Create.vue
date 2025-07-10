<template>
    <NuxtLink to="/create-post">
        <div class="flex cursor-default items-center justify-center rounded-md bg-gray-200 text-white font-semibold text-xl hover:cursor-pointer hover:bg-gray-100" :class="sizeClass">
            +
        </div>
    </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md'
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8'
    case 'lg':
      return 'w-16 h-16'
    default:
      return 'w-12 h-12 text-base'
  }
})
</script>