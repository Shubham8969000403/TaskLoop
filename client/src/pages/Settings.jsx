import React, { useState } from 'react'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

const Settings = () => {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [profileMsg, setProfileMsg]     = useState('')
  const [passwordMsg, setPasswordMsg]   = useState('')
  const [profileErr, setProfileErr]     = useState('')
  const [passwordErr, setPasswordErr]   = useState('')
  const [profileLoading, setProfileLoading]   = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirm: '',
  })

  const inputClass = (hasError) =>
    `w-full bg-gray-900 border rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none transition-colors ${
      hasError ? 'border-red-500/60 focus:border-red-500' : 'border-gray-700 focus:border-blue-500'
    }`

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileErr(''); setProfileMsg('')
    setProfileLoading(true)
    try {
      await api.put('/users/profile', { name: profile.name, email: profile.email })
      setProfileMsg('Profile updated successfully!')
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    setPasswordErr(''); setPasswordMsg('')

    // Validate all fields first before hitting API
    const newErrors = { currentPassword: '', newPassword: '', confirm: '' }
    let hasError = false

    if (!passwords.currentPassword) {
      newErrors.currentPassword = 'Please enter your current password'
      hasError = true
    }
    if (!passwords.newPassword) {
      newErrors.newPassword = 'Please enter a new password'
      hasError = true
    } else if (passwords.newPassword.length < 6) {
      newErrors.newPassword = 'New password must be at least 6 characters'
      hasError = true
    }
    if (!passwords.confirm) {
      newErrors.confirm = 'Please confirm your new password'
      hasError = true
    } else if (passwords.newPassword && passwords.newPassword !== passwords.confirm) {
      newErrors.confirm = 'Passwords do not match'
      hasError = true
    }

    if (hasError) {
      setFieldErrors(newErrors)
      return
    }

    setFieldErrors({ currentPassword: '', newPassword: '', confirm: '' })
    setPasswordLoading(true)

    try {
      await api.put('/users/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      })
      setPasswordMsg('Password changed successfully!')
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password'
      // Show the specific error under the right field
      if (msg.toLowerCase().includes('current') || msg.toLowerCase().includes('incorrect')) {
        setFieldErrors(prev => ({ ...prev, currentPassword: 'Current password is incorrect' }))
      } else {
        setPasswordErr(msg)
      }
    } finally {
      setPasswordLoading(false)
    }
  }

  const clearFieldError = (field) => {
    setFieldErrors(prev => ({ ...prev, [field]: '' }))
    setPasswordErr('')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <span>👤</span> Profile
        </h2>

        {profileMsg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
            ✓ {profileMsg}
          </div>
        )}
        {profileErr && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
            ⚠️ {profileErr}
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm block mb-1">Full Name</label>
            <input
              value={profile.name}
              onChange={e => { setProfile(p => ({ ...p, name: e.target.value })); setProfileErr(''); setProfileMsg('') }}
              className={inputClass(false)}
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={e => { setProfile(p => ({ ...p, email: e.target.value })); setProfileErr(''); setProfileMsg('') }}
              className={inputClass(false)}
            />
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {profileLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-5 flex items-center gap-2">
          <span>🔒</span> Change Password
        </h2>

        {passwordMsg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
            ✓ {passwordMsg}
          </div>
        )}
        {passwordErr && (
          <div className="bg-red-500/10 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">⚠️</span>
            <span>{passwordErr}</span>
          </div>
        )}

        <form onSubmit={savePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Current Password</label>
            <input
              type="password"
              value={passwords.currentPassword}
              onChange={e => { setPasswords(p => ({ ...p, currentPassword: e.target.value })); clearFieldError('currentPassword') }}
              placeholder="••••••••"
              className={inputClass(!!fieldErrors.currentPassword)}
            />
            {fieldErrors.currentPassword && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {fieldErrors.currentPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">New Password</label>
            <input
              type="password"
              value={passwords.newPassword}
              onChange={e => { setPasswords(p => ({ ...p, newPassword: e.target.value })); clearFieldError('newPassword') }}
              placeholder="Min 6 characters"
              className={inputClass(!!fieldErrors.newPassword)}
            />
            {fieldErrors.newPassword && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {fieldErrors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-400 text-sm block mb-1">Confirm New Password</label>
            <input
              type="password"
              value={passwords.confirm}
              onChange={e => { setPasswords(p => ({ ...p, confirm: e.target.value })); clearFieldError('confirm') }}
              placeholder="••••••••"
              className={inputClass(!!fieldErrors.confirm)}
            />
            {fieldErrors.confirm && (
              <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                <span>⚠</span> {fieldErrors.confirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-gray-800 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-1 flex items-center gap-2">
          <span>⚠️</span> Danger Zone
        </h2>
        <p className="text-gray-500 text-sm mb-4">Sign out from this session.</p>
        <button
          onClick={logout}
          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default Settings