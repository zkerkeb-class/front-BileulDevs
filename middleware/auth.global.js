export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  
  if (!user.value && !['/login', '/register', '/forgot-password'].includes(to.path)) {
    return navigateTo('/login')
  }
})
