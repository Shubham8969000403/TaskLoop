import React, { useState, useEffect } from 'react'
import api from '../services/api'
import useAuth from '../hooks/useAuth'
import { timeAgo } from '../utils/helpers'

const Team = () => {
  const { user } = useAuth()
  const [invites, setInvites]       = useState([])
  const [email, setEmail]           = useState('')
  const [sending, setSending]       = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [loading, setLoading]       = useState(true)
  const [cancelling, setCancelling] = useState(null)

  const loadInvites = async () => {
    try {
      const res = await api.get('/invites')
      setInvites(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadInvites() }, [])

  const handleInvite = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')

    if (!email.trim()) return setError('Please enter an email address')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return setError('Please enter a valid email address')

    setSending(true)
    try {
      const res = await api.post('/invites/send', { email: email.trim().toLowerCase() })
      setSuccess(res.data.message)
      setEmail('')
      loadInvites()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send invite')
    } finally {
      setSending(false)
    }
  }

  const handleCancel = async (inviteId) => {
    setCancelling(inviteId)
    try {
      await api.delete(`/invites/${inviteId}`)
      setInvites(prev => prev.filter(i => i._id !== inviteId))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel invite')
    } finally {
      setCancelling(null)
    }
  }

  const pendingInvites   = invites.filter(i => !i.used && new Date(i.expiresAt) > new Date())
  const expiredInvites   = invites.filter(i => !i.used && new Date(i.expiresAt) <= new Date())
  const acceptedInvites  = invites.filter(i => i.used)

  const StatusBadge = ({ invite }) => {
    if (invite.used) return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
        Accepted
      </span>
    )
    if (new Date(invite.expiresAt) <= new Date()) return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-700 text-gray-500 border border-gray-600">
        Expired
      </span>
    )
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
        Pending
      </span>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Team & Invites</h1>
        <p className="text-gray-500 text-sm mt-1">Invite people to join your workspace</p>
      </div>

      {/* Invite form */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
          ✉️ Invite Someone
        </h2>
        <p className="text-gray-500 text-sm mb-5">They'll receive an email with a link to join TaskLoop.</p>

        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
            <span className="flex-shrink-0">⚠️</span> <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleInvite} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); setSuccess('') }}
            placeholder="colleague@example.com"
            className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={sending}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex-shrink-0"
          >
            {sending ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
      </div>

      {/* Pending invites */}
      {!loading && pendingInvites.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Pending Invites ({pendingInvites.length})</h2>
          <div className="space-y-3">
            {pendingInvites.map(invite => (
              <div key={invite._id} className="flex items-center justify-between p-3 bg-gray-900/60 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-yellow-600/20 border border-yellow-600/30 flex items-center justify-center text-yellow-400 text-sm font-bold">
                    ?
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{invite.email}</p>
                    <p className="text-gray-500 text-xs">Sent {timeAgo(invite.createdAt)} · expires {timeAgo(invite.expiresAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge invite={invite} />
                  <button
                    onClick={() => handleCancel(invite._id)}
                    disabled={cancelling === invite._id}
                    className="text-gray-600 hover:text-red-400 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {cancelling === invite._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted invites */}
      {!loading && acceptedInvites.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Accepted Invites ({acceptedInvites.length})</h2>
          <div className="space-y-3">
            {acceptedInvites.map(invite => (
              <div key={invite._id} className="flex items-center justify-between p-3 bg-gray-900/60 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                    {invite.email[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{invite.email}</p>
                    <p className="text-gray-500 text-xs">Joined {timeAgo(invite.updatedAt)}</p>
                  </div>
                </div>
                <StatusBadge invite={invite} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expired invites */}
      {!loading && expiredInvites.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 opacity-60">
          <h2 className="text-gray-400 font-semibold mb-4">Expired ({expiredInvites.length})</h2>
          <div className="space-y-2">
            {expiredInvites.map(invite => (
              <div key={invite._id} className="flex items-center justify-between p-3 rounded-lg">
                <p className="text-gray-500 text-sm">{invite.email}</p>
                <StatusBadge invite={invite} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && invites.length === 0 && (
        <div className="text-center py-16 rounded-2xl border-2 border-dashed border-gray-700 bg-gray-800/30">
          <div className="text-4xl mb-3">📬</div>
          <p className="text-gray-400 font-medium">No invites sent yet</p>
          <p className="text-gray-600 text-sm mt-1">Invite someone above to get started</p>
        </div>
      )}

      {/* Setup reminder */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
        <p className="text-yellow-400 text-xs font-semibold mb-1">⚙️ Email Setup Required</p>
        <p className="text-gray-500 text-xs leading-relaxed">
          Make sure <code className="text-gray-300 bg-gray-700 px-1 rounded">EMAIL_USER</code> and{' '}
          <code className="text-gray-300 bg-gray-700 px-1 rounded">EMAIL_PASS</code> are set in your{' '}
          <code className="text-gray-300 bg-gray-700 px-1 rounded">.env</code> file.
          For Gmail, use an App Password from Google Account → Security → 2-Step Verification → App Passwords.
        </p>
      </div>
    </div>
  )
}

export default Team