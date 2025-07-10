<template>
    <nav class="bg-white shadow p-4 flex justify-between items-center px-20">
        <NuxtLink to="/" class="flex items-center">
            <UILogo />
            <h1 class="text-xl font-bold">SPOT<span class="text-red-500">R</span></h1>
        </NuxtLink>
        <div v-if="user" class="flex justify-center items-center">
            <PostCreate size="sm" class="mr-4" />
            <NuxtLink to="/profil" class="">
                <UIAvatar :alt="user.username" size="md" class="hover:cursor-pointer" />
            </NuxtLink>
            <NuxtLink to="/settings" class="mr-2">
                parametres
            </NuxtLink>
            <NuxtLink to="/admin" class="" v-if="user.isAdmin">
                admin
            </NuxtLink>

            <button @click.prevent="logout" class="px-2 py-0.5 rounded text-sm font-medium bg-red-300 text-red-700 hover:bg-red-100 hover:text-white hover:cursor-pointer">
                Déconnexion
            </button>
        </div>
    </nav>
</template>

<script setup>
const { user, logout } = useAuth();
const navigation = ref({
    accueil: {
        name: "Accueil",
        route: "/"
    }
})

if (user?.value?.isAdmin) navigation.value.admin = { name: "Administration", route: "/admin" }
</script>