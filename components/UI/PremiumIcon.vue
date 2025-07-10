<template>
    <div class="bg-orange-100 text-orange-800 rounded-md w-fit my-2">
        <p class="font-bold text-sm mx-2">Premium - {{ sub?.status }}</p>
    </div>
</template>

<script setup>
defineProps(['sub'])
</script>