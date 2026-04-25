import { apiClient } from './client'
import type { LoginResponse, User } from '@/types'

export interface LoginInput {
  username: string
  password: string
}

export interface RegisterInput {
  username: string
  email: string
  password: string
  fullName?: string
}

export const authApi = {
  login: (input: LoginInput) =>
    apiClient.post<LoginResponse>('/api/users/login', input).then((r) => r.data),

  register: (input: RegisterInput) =>
    apiClient.post<User>('/api/users/register', input).then((r) => r.data),

  me: () => apiClient.get<User>('/api/users/me').then((r) => r.data),
}
