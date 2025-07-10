export const useAuth = () => {
  const config = useRuntimeConfig();
  const user = useState('user', () => null)
  const token = useState('token', () => null)
  const loading = useState('auth_loading', () => false)
  const error = useState('auth_error', () => null)

  const login = async (credentials) => {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`${config.public.SERVICE_AUTH_URL}/api/auth/login`, {
        method: 'POST',
        body: credentials
      })

      if (data?.user && data?.token) {
        user.value = data.user
        token.value = data.token
        localStorage.setItem('auth_token', data.token)
      } else {
        throw new Error('Invalid response')
      }
    } catch (err) {
        if (err?.response?._data?.message) {
            error.value = err.response._data.message
        } else {
            error.value = 'Une erreur est survenue'
        }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    return navigateTo('/login')
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null

    userData.provider = "local"

    try {
      const data = await $fetch(`${config.public.SERVICE_AUTH_URL}/api/auth/register`, {
        method: 'POST',
        body: userData
      })

      if (data?.user && data?.token) {
        user.value = data.user
        token.value = data.token
        localStorage.setItem('auth_token', data.token)
      } else {
        throw new Error('Invalid response')
      }
    } catch (err) {
        if (err?.response?._data?.message) {
            error.value = err.response._data.message
        } else {
            error.value = 'Une erreur est survenue'
        }
    } finally {
      loading.value = false
    }
  }

  return { user, token, login, logout, register, loading, error }
}
