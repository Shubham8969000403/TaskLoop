import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Signup = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Field-level errors so the user knows exactly what to fix
  const [fieldErrors, setFieldErrors] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear error for this field as user types
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate before hitting the API
    const newFieldErrors = { name: '', email: '', password: '' }
    let hasError = false

    if (!form.name.trim()) {
      newFieldErrors.name = 'Full name is required'
      hasError = true
    }
    if (!form.email.trim()) {
      newFieldErrors.email = 'Email is required'
      hasError = true
    }
    if (!form.password) {
      newFieldErrors.password = 'Password is required'
      hasError = true
    } else if (form.password.length < 6) {
      newFieldErrors.password = 'Password must be at least 6 characters'
      hasError = true
    }

    if (hasError) {
      setFieldErrors(newFieldErrors)
      return
    }

    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      // Show under the right field if possible
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('exists')) {
        setFieldErrors(prev => ({ ...prev, email: 'An account with this email already exists' }))
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (hasError) =>
    `w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors ${
      hasError ? 'border-red-500/60 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
    }`

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-blue-500">Task</span>Loop
          </h1>
          <p className="text-gray-400 mt-2">Create your account and start managing tasks</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Create Account</h2>

          {/* General error — stays until user types */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm mb-5 flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Full Name */}
            <div>
              <label className="text-gray-400 text-sm block mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass(!!fieldErrors.name)}
              />
              {fieldErrors.name && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass(!!fieldErrors.email)}
              />
              {fieldErrors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm block mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className={inputClass(!!fieldErrors.password)}
              />
              {fieldErrors.password && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg font-semibold text-sm transition-colors mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-500 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup