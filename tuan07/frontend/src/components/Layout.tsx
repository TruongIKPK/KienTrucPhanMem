import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { useLogout } from '@/hooks/useAuth'
import { Button } from './Button'

export function Layout() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="border-b border-purpleRule">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-4 flex items-center justify-between gap-6">
          <Link to="/movies" className="flex items-center gap-3">
            <span className="font-display text-[44px] md:text-[56px] leading-display text-hazardWhite uppercase">
              Movie<span className="text-mint">Ticket</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavItem to="/movies">Movies</NavItem>
            {user && <NavItem to="/bookings">My bookings</NavItem>}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="kicker text-secondary hidden md:inline">
                  {user.username}
                </span>
                <Button variant="outlinedMint" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primaryMint" size="sm">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-purpleRule mt-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 flex flex-wrap justify-between gap-4 kicker text-secondary">
          <span>© 2026 — Movie Ticket System</span>
          <span>Built with Spring Boot + React · Event-driven via RabbitMQ</span>
        </div>
      </footer>
    </div>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'kicker hover:text-linkBlue transition',
          isActive ? 'text-mint' : 'text-hazardWhite',
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  )
}
