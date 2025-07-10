<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    password 
  </div>
</template>

<script setup>
const email = ref('')
const password = ref('')
const auth = useAuth()
const router = useRouter()

const handleLogin = async () => {
  await auth.login({ email: email.value, password: password.value })
  if (auth.user.value) {
    router.push('/')
  }
}

watch([email, password], () => {
  if (auth.error.value) {
    auth.error.value = null
  }
})
</script>
