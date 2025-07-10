export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()

  const guestOnlyRoutes = ['/login', '/register', '/forgot-password']
  
  if (user.value && guestOnlyRoutes.includes(to.path)) {
    return navigateTo('/')
  }
})
