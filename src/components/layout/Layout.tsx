import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, User, LogOut, Bird, Search, Icon } from 'lucide-react'
import { authService } from '../../services/auth.service'

export default function Layout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    authService.logout()
    navigate('/auth')
  }

  const navItems = [
    {
      route: '/',
      icon: <Home />,
      name: 'Home',
    },
    {
      route: `/profile/${user.id}`,
      icon: <User />,
      name: 'Profile',
    },
    {
      route: '/discover',
      icon: <Search />,
      name: 'Discover',
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-20 md:w-64 bg-white border-r border-gray-400 flex flex-col sticky top-0 h-screen p-2 md:p-4">
        <div className="mt-2 md:mt-0 flex items-center justify-center md:justify-start md:space-x-2 md:px-4 mb-8 text-blue-500">
          <Bird className="w-8 h-8" />
          <span className="hidden md:block text-xl font-bold tracking-tight text-black">
            Murmur
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map(
            ({
              route,
              icon: Icon,
              name,
            }: {
              route: string
              icon: React.ReactNode
              name: string
            }) => (
              <NavLink
                to={route}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start md:space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                {Icon}
                <span className="hidden md:inline-block">{name}</span>
              </NavLink>
            ),
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center md:justify-start md:space-x-3 p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-auto"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden md:inline-block">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
