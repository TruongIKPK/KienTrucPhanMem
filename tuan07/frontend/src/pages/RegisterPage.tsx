import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { StoryStreamTile } from '@/components/StoryStreamTile'
import { useRegister } from '@/hooks/useAuth'

const schema = z.object({
  username: z.string().min(3, 'Username phải ≥ 3 ký tự').max(50),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Password phải ≥ 8 ký tự').max(100),
  fullName: z.string().max(120).optional(),
})
type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const register = useRegister()
  const {
    register: rhf,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-12">
      <StoryStreamTile
        accent="ultraviolet"
        kicker="JOIN / NEW MEMBER"
        timestamp={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}
        headline="Create an account"
        deck="Đăng ký để publish event USER_REGISTERED và bắt đầu đặt vé."
      >
        <form
          onSubmit={handleSubmit((v) => register.mutate(v))}
          className="flex flex-col gap-5 mt-2"
        >
          <Input
            label="USERNAME"
            placeholder="alice"
            error={errors.username?.message}
            {...rhf('username')}
          />
          <Input
            label="EMAIL"
            placeholder="alice@example.com"
            type="email"
            error={errors.email?.message}
            {...rhf('email')}
          />
          <Input
            label="PASSWORD"
            placeholder="••••••••"
            type="password"
            error={errors.password?.message}
            {...rhf('password')}
          />
          <Input
            label="FULL NAME (OPTIONAL)"
            placeholder="Alice Wonderland"
            error={errors.fullName?.message}
            {...rhf('fullName')}
          />
          <div className="flex items-center justify-between gap-4 mt-2">
            <p className="kicker text-current/80">
              Already a member?{' '}
              <Link to="/login" className="text-mint hover:text-linkBlue">
                Sign in →
              </Link>
            </p>
            <Button type="submit" variant="primaryMint" size="lg" disabled={register.isPending}>
              {register.isPending ? 'Creating…' : 'Create →'}
            </Button>
          </div>
        </form>
      </StoryStreamTile>
    </div>
  )
}
