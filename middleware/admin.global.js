export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  
  if (to.path.startsWith('/admin')) {
    if (!user.value.isAdmin) return navigateTo('/')
  }
})
