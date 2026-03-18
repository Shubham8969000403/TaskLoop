import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import useAuth from './hooks/useAuth'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Login from './pages/Login'
import Signup from './pages/Signup'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import TaskDetails from './pages/TaskDetails'
import CreateTask from './pages/CreateTask'
import FilteredTasks from './pages/FilteredTasks'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import Team from './pages/Team'
import InviteAccept from './pages/InviteAccept'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    <Sidebar />
    <div className="ml-[220px] mt-[60px]">
      {children}
    </div>
  </>
)

const AppRoutes = () => {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"           element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup"          element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/invite/:token"   element={<InviteAccept />} />

      {/* Protected */}
      <Route path="/"                element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
      <Route path="/dashboard"       element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/tasks/new"       element={<ProtectedRoute><AppLayout><CreateTask /></AppLayout></ProtectedRoute>} />
      <Route path="/tasks/active"    element={<ProtectedRoute><AppLayout><FilteredTasks filterType="active" /></AppLayout></ProtectedRoute>} />
      <Route path="/tasks/high"      element={<ProtectedRoute><AppLayout><FilteredTasks filterType="high" /></AppLayout></ProtectedRoute>} />
      <Route path="/tasks/completed" element={<ProtectedRoute><AppLayout><FilteredTasks filterType="completed" /></AppLayout></ProtectedRoute>} />
      <Route path="/tasks/:id"       element={<ProtectedRoute><AppLayout><TaskDetails /></AppLayout></ProtectedRoute>} />
      <Route path="/notes"           element={<ProtectedRoute><AppLayout><Notes /></AppLayout></ProtectedRoute>} />
      <Route path="/team"            element={<ProtectedRoute><AppLayout><Team /></AppLayout></ProtectedRoute>} />
      <Route path="/settings"        element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
)

export default App