<template>
  <div class="flex flex-wrap gap-2">
    <NuxtLink
      v-for="tag in tags"
      :key="tag"
      :to="`/tags/${tag}`"
      class="inline-flex items-center px-3 py-1 mt-1 rounded-full text-sm bg-blue-100 text-blue-800"
    >
      #{{ tag }}
    </NuxtLink>
  </div>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    required: true,
    default: []
  }
})
</script>
