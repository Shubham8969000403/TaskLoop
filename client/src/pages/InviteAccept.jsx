import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const InviteAccept = () => {
  const { token } = useParams()
  const navigate = useNavigate()

  const [invite, setInvite]     = useState(null)   // { email, invitedBy, expiresAt }
  const [status, setStatus]     = useState('loading') // loading | valid | invalid
  const [form, setForm]         = useState({ name: '', password: '', confirm: '' })
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/invites/validate/${token}`)
      .then(res => { setInvite(res.data); setStatus('valid') })
      .catch(err => { setError(err.response?.data?.message || 'Invalid invite'); setStatus('invalid') })
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(p => ({ ...p, [name]: '' }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim())     errs.name     = 'Full name is required'
    if (!form.password)        errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (!form.confirm)         errs.confirm  = 'Please confirm your password'
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'

    if (Object.keys(errs).length) return setFieldErrors(errs)

    setSubmitting(true)
    try {
      await api.post(`/invites/accept/${token}`, { name: form.name, password: form.password })
      navigate('/login', { state: { message: 'Account created! Please sign in.' } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = (field) =>
    `w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors ${
      fieldErrors[field] ? 'border-red-500/60 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
    }`

  if (status === 'loading') return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-gray-500">Validating invite link...</p>
    </div>
  )

  if (status === 'invalid') return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🔗</div>
        <h1 className="text-2xl font-bold text-white mb-2">Invite Link Invalid</h1>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors">
          Go to Login
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold"><span className="text-blue-500">Task</span>Loop</h1>
          <p className="text-gray-400 mt-2">You've been invited by <span className="text-white font-semibold">{invite?.invitedBy}</span></p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          {/* Invite banner */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 mb-6">
            <p className="text-blue-400 text-sm font-medium">✉️ Invite for: <span className="text-white">{invite?.email}</span></p>
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Create Your Account</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm mb-5 flex items-start gap-2">
              <span className="flex-shrink-0">⚠️</span> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email — pre-filled, read-only */}
            <div>
              <label className="text-gray-400 text-sm block mb-1">Email</label>
              <input
                value={invite?.email}
                readOnly
                className="w-full bg-gray-700/50 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass('name')} />
              {fieldErrors.name && <p className="text-red-400 text-xs mt-1.5">⚠ {fieldErrors.name}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" className={inputClass('password')} />
              {fieldErrors.password && <p className="text-red-400 text-xs mt-1.5">⚠ {fieldErrors.password}</p>}
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1">Confirm Password</label>
              <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" className={inputClass('confirm')} />
              {fieldErrors.confirm && <p className="text-red-400 text-xs mt-1.5">⚠ {fieldErrors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors mt-2"
            >
              {submitting ? 'Creating account...' : 'Accept Invite & Join'}
            </button>
          </form>

          <p className="text-gray-600 text-xs text-center mt-4">
            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default InviteAccept