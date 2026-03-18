export const PRIORITIES = ['low', 'medium', 'high']

export const PRIORITY_COLORS = {
  high:   { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
  medium: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  low:    { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20' },
}

export const STATUS_COLORS = {
  'todo':        { text: 'text-gray-400',  bg: 'bg-gray-700' },
  'in-progress': { text: 'text-blue-400',  bg: 'bg-blue-900/50' },
  'completed':   { text: 'text-green-400', bg: 'bg-green-900/50' },
}
