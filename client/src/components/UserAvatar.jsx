import React from 'react'
import { getInitials } from '../utils/helpers'

const colors = [
  'bg-blue-600', 'bg-purple-600', 'bg-green-600',
  'bg-yellow-600', 'bg-red-600', 'bg-pink-600', 'bg-indigo-600'
]

const getColor = (name = '') => {
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

const UserAvatar = ({ name = '', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  return (
    <div className={`${sizeClasses[size]} ${getColor(name)} ${className} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {getInitials(name)}
    </div>
  )
}

export default UserAvatar
