import axios from 'axios'
import Constants from 'expo-constants'
import * as SecureStore from 'expo-secure-store'

axios.defaults.baseURL = Constants?.expoConfig?.extra?.apiUrl
axios.defaults.withCredentials = true

const axiosHeaders = (token: string) => {
  if (window !== null) {
    if (token) {
      return {
        Authorization: `Bearer ${token}`,
      }
    } else {
      return {}
    }
  } else {
    return {}
  }
}

const init = async (): Promise<void> => {
  console.log(axios.defaults.baseURL, 'axios.defaults.baseURL')
  let cookie = await SecureStore.getItemAsync('auth_token') || ''
  axios.interceptors.request.use(
    async (config) => ({
      ...config,
      headers: {
        ...config.headers,
      },
    }),
    (error) => {
      Promise.reject(error)
    }
  )
}

export default init
