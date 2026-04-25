import axios, { type AxiosError } from 'axios'
import { useAuthStore } from '@/store/useAuthStore'
import type { ApiError } from '@/types'

const baseURL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (resp) => resp,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clear()
      const path = window.location.pathname
      if (!path.startsWith('/login') && !path.startsWith('/register')) {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

export function extractErrorMessage(error: unknown): string {
  const err = error as AxiosError<ApiError>
  return err.response?.data?.message || err.message || 'Unknown error'
}
