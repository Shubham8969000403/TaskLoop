import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    // Only clear error when user starts correcting their input
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
      // Shake the form to draw attention
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-blue-500">Task</span>Loop
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, sign in to continue</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Sign In</h2>

          {/* Error — stays visible until user edits a field */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm mb-5 flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors ${
                  error ? 'border-red-500/50 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors ${
                  error ? 'border-red-500/50 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-colors mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login