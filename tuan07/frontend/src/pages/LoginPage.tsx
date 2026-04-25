import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { StoryStreamTile } from '@/components/StoryStreamTile'
import { useLogin } from '@/hooks/useAuth'

const schema = z.object({
  username: z.string().min(3, 'Username phải ≥ 3 ký tự'),
  password: z.string().min(8, 'Password phải ≥ 8 ký tự'),
})
type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const login = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-12">
      <StoryStreamTile
        accent="slate"
        kicker="ACCESS / LOG IN"
        timestamp={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
        headline="Sign in to book the night"
        deck="Đăng nhập để đặt vé. Tài khoản demo: admin / Admin@123."
      >
        <form
          onSubmit={handleSubmit((values) => login.mutate(values))}
          className="flex flex-col gap-5 mt-2"
        >
          <Input
            label="USERNAME"
            placeholder="admin"
            autoComplete="username"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="PASSWORD"
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex items-center justify-between gap-4 mt-2">
            <p className="kicker text-current/70">
              No account?{' '}
              <Link to="/register" className="text-mint hover:text-linkBlue">
                Register →
              </Link>
            </p>
            <Button type="submit" variant="primaryMint" size="lg" disabled={login.isPending}>
              {login.isPending ? 'Signing in…' : 'Sign in →'}
            </Button>
          </div>
        </form>
      </StoryStreamTile>
    </div>
  )
}
