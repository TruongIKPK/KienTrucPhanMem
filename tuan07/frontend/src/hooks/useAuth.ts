import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi, type LoginInput, type RegisterInput } from '@/api/auth'
import { extractErrorMessage } from '@/api/client'
import { useAuthStore } from '@/store/useAuthStore'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user)
      toast.success(`Welcome back, ${data.user.username}`)
      navigate('/movies')
    },
    onError: (e) => toast.error(extractErrorMessage(e)),
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: () => {
      toast.success('Registration successful — please login')
      navigate('/login')
    },
    onError: (e) => toast.error(extractErrorMessage(e)),
  })
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear)
  const navigate = useNavigate()
  return () => {
    clear()
    navigate('/login')
  }
}
