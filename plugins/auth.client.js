export default defineNuxtPlugin(async () => {
    const config = useRuntimeConfig()
    const { user, token } = useAuth()
    const storedToken = localStorage.getItem('auth_token')

    if (storedToken && !user.value) {
        try {
            const data = await $fetch(`${config.public.SERVICE_AUTH_URL}/api/auth/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${storedToken}`
                }
            })

            if (data?.user) {
                user.value = data.user
                token.value = storedToken
            }
        } catch (err) {
            
        }
    }
})