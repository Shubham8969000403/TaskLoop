import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchTask } from '../services/taskService'
import useTasks from '../hooks/useTasks'
import SubtaskList from '../components/SubtaskList'
import UserAvatar from '../components/UserAvatar'
import { PRIORITY_COLORS } from '../utils/constants'
import { formatDate, timeAgo } from '../utils/helpers'

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { editTask, removeTask, addSubtask, editSubtask, removeSubtask } = useTasks()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})

  useEffect(() => {
    fetchTask(id)
      .then(data => { setTask(data); setForm(data) })
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    const updated = await editTask(task._id, { title: form.title, description: form.description, priority: form.priority, assignee: form.assignee })
    setTask(updated)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return
    await removeTask(task._id)
    navigate('/dashboard')
  }

  const handleToggle = async () => {
    const updated = await editTask(task._id, { completed: !task.completed })
    setTask(updated)
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading...</div>
  if (!task) return null

  const p = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
  const subtasksDone = task.subtasks?.filter(s => s.completed).length || 0
  const subtasksTotal = task.subtasks?.length || 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
        ← Back to Dashboard
      </button>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={handleToggle}
              className={`mt-1 w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                task.completed ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-blue-500'
              }`}
            >
              {task.completed && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {editing ? (
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="flex-1 text-xl font-bold bg-gray-900 border border-gray-600 rounded-lg px-3 py-1 text-white outline-none focus:border-blue-500"
              />
            ) : (
              <h1 className={`text-2xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                {task.title}
              </h1>
            )}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {editing ? (
              <>
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Save</button>
                <button onClick={() => setEditing(false)} className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm font-bold">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Edit</button>
                <button onClick={handleDelete} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold transition-colors">Delete</button>
              </>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`text-xs px-3 py-1 rounded-full font-bold border ${p.bg} ${p.text} ${p.border}`}>
            {task.priority} priority
          </span>
          <span className={`text-xs px-3 py-1 rounded-full font-bold ${task.completed ? 'bg-green-900/50 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
            {task.completed ? 'Completed' : 'Active'}
          </span>
          {subtasksTotal > 0 && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-400 font-bold">
              {subtasksDone}/{subtasksTotal} subtasks
            </span>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">Description</label>
          {editing ? (
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Add a description..."
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 text-sm outline-none focus:border-blue-500 resize-none"
            />
          ) : (
            <p className="text-gray-400 text-sm">{task.description || 'No description provided.'}</p>
          )}
        </div>

        {/* Assignee & Priority edit */}
        {editing && (
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">Assignee</label>
              <input
                value={form.assignee}
                onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-300 text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs font-bold uppercase tracking-wider block mb-2">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="bg-gray-900 border border-gray-600 rounded-lg px-4 py-2.5 text-gray-300 text-sm outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}

        {/* Assignee display */}
        {!editing && (
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-700">
            <UserAvatar name={task.assignee} size="md" />
            <div>
              <p className="text-white font-semibold">{task.assignee}</p>
              <p className="text-gray-500 text-xs">Assignee · {timeAgo(task.createdAt)}</p>
            </div>
          </div>
        )}

        {/* Subtasks */}
        <div>
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Subtasks</h3>
          <SubtaskList
            subtasks={task.subtasks || []}
            taskId={task._id}
            onAdd={async (taskId, data) => {
              const newSub = await addSubtask(taskId, data)
              setTask(prev => ({ ...prev, subtasks: [...prev.subtasks, newSub] }))
            }}
            onToggle={async (taskId, subtaskId, data) => {
              const updated = await editSubtask(taskId, subtaskId, data)
              setTask(prev => ({ ...prev, subtasks: prev.subtasks.map(s => s._id === subtaskId ? updated : s) }))
            }}
            onDelete={async (taskId, subtaskId) => {
              await removeSubtask(taskId, subtaskId)
              setTask(prev => ({ ...prev, subtasks: prev.subtasks.filter(s => s._id !== subtaskId) }))
            }}
          />
        </div>

        {/* Timestamps */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-xs text-gray-600 space-y-1">
          <p>Created: {formatDate(task.createdAt)}</p>
          {task.completedAt && <p>Completed: {formatDate(task.completedAt)}</p>}
        </div>
      </div>
    </div>
  )
}

export default TaskDetails
