export const getInitials = (name = '') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

export const timeAgo = (date) => {
  if (!date) return ''
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export const calcProgress = (tasks) => {
  const totalSubtasks = tasks.reduce((a, t) => a + (t.subtasks?.length || 0), 0)
  const doneSubtasks  = tasks.reduce((a, t) => a + (t.subtasks?.filter(s => s.completed).length || 0), 0)
  const totalItems    = tasks.length + totalSubtasks
  const doneItems     = tasks.filter(t => t.completed).length + doneSubtasks
  return totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0
}
