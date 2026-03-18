import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import UserAvatar from './UserAvatar'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 w-full z-50 h-[60px] flex items-center justify-between bg-gray-950 border-b border-gray-800 px-4">
      <Link to="/" className="text-2xl font-bold tracking-tight">
        <span className="text-blue-500">Task</span>Loop
      </Link>

      {user && (
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">{user.name}</span>
          <UserAvatar name={user.name} size="sm" />
          <button
            onClick={logout}
            className="text-gray-500 hover:text-red-400 text-sm font-medium transition-colors px-2 py-1 rounded hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
