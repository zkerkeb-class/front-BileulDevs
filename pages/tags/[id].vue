<template>
    <Feed :posts="posts" />
</template>

<script setup>
import Feed from '~/components/post/Feed.vue';
const config = useRuntimeConfig();

const tag = useRoute().params.id;

const { data: posts, error } = await useFetch(`${config.public.SERVICE_BDD_URL}/api/search/tag/${tag}`)

if (error.value) {
  console.error('Erreur lors du fetch des posts:', error.value)
}
</script>