export const useFetching = () => {
  const { token } = useAuth()
  
  const fetching = async (url, options = {}) => {

    let defaultHeaders = {};

    if (token?.value) defaultHeaders = { 'Authorization': `Bearer ${token?.value}` }
    
    return await $fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    })
  }
  
  return { fetching }
}