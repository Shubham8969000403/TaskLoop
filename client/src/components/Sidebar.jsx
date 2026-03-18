import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useTasks from '../hooks/useTasks'

const Sidebar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { tasks } = useTasks()

  const activeTasks    = tasks.filter(t => !t.completed).length
  const highPriority   = tasks.filter(t => t.priority === 'high' && !t.completed).length
  const completedTasks = tasks.filter(t => t.completed).length

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const NavItem = ({ to, icon, label, badge, badgeColor = 'bg-blue-600' }) => (
    <Link
      to={to}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group ${
        isActive(to)
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-base w-5 text-center">{icon}</span>
        <span>{label}</span>
      </div>
      {badge > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${
          isActive(to) ? 'bg-white/20' : badgeColor
        }`}>
          {badge}
        </span>
      )}
    </Link>
  )

  const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-3 pt-5 pb-1">
      {children}
    </p>
  )

  return (
    <div className="fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-gray-950 border-r border-gray-800 w-[220px] flex flex-col">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">

        <SectionLabel>Main</SectionLabel>
        <NavItem to="/"          icon="⌂"  label="Home" />
        <NavItem to="/dashboard" icon="⊞"  label="Dashboard" badge={activeTasks} />
        <NavItem to="/tasks/new" icon="＋"  label="New Task" />

        <SectionLabel>Tasks</SectionLabel>
        <NavItem to="/tasks/active"    icon="⚡" label="Active"        badge={activeTasks}    badgeColor="bg-yellow-600" />
        <NavItem to="/tasks/high"      icon="🔴" label="High Priority" badge={highPriority}   badgeColor="bg-red-600" />
        <NavItem to="/tasks/completed" icon="✓"  label="Completed"     badge={completedTasks} badgeColor="bg-green-700" />

        <SectionLabel>Workspace</SectionLabel>
        <NavItem to="/team"     icon="👥" label="Team & Invites" />
        <NavItem to="/notes"    icon="📝" label="Scratchpad" />
        <NavItem to="/settings" icon="⚙"  label="Settings" />

      </div>

      {/* Bottom user card */}
      <div className="border-t border-gray-800 p-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
          </div>
          <button onClick={logout} title="Logout" className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
        {tasks.length > 0 && (
          <div className="px-2 mt-2">
            <div className="flex justify-between text-[10px] text-gray-600 mb-1">
              <span>Progress</span>
              <span>{completedTasks}/{tasks.length} tasks</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar