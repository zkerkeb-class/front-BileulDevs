<template>
    <div class="absolute right-3 top-2.5 px-2 py-0.5 rounded text-xs font-medium" :class="verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" >
        {{ verified ? 'Vérifié' : 'Non vérifié' }}
    </div>
</template>

<script setup>
defineProps(['verified'])
</script>