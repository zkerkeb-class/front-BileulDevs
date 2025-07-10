<template>
  <div class="flex cursor-default items-center justify-center rounded-md bg-gray-300 text-white font-semibold" :class="sizeClass">
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  alt: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  }
})

const initials = computed(() => {
  if (!props.alt) return ''
  const words = props.alt.trim().split(' ')
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8 text-xs'
    case 'lg':
      return 'w-16 h-16 text-xl'
    default:
      return 'w-12 h-12 text-base'
  }
})
</script>
