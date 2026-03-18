import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useTasks from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'
import { calcProgress } from '../utils/helpers'

const Dashboard = () => {
  const { user } = useAuth()
  const { tasks, loading, error, addTask, editTask, removeTask, addSubtask, editSubtask, removeSubtask } = useTasks()

  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', assignee: '', priority: 'medium', description: '' })
  const [submitting, setSubmitting] = useState(false)

  const progress = useMemo(() => calcProgress(tasks), [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'completed') return tasks.filter(t => t.completed)
    if (filter === 'active') return tasks.filter(t => !t.completed)
    return tasks
  }, [tasks, filter])

  const stats = [
    { label: 'Total Tasks',   value: tasks.length,                             color: 'text-blue-400' },
    { label: 'Active',        value: tasks.filter(t => !t.completed).length,   color: 'text-yellow-400' },
    { label: 'Completed',     value: tasks.filter(t => t.completed).length,    color: 'text-green-400' },
    { label: 'Efficiency',    value: `${progress}%`,                           color: 'text-purple-400' },
  ]

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.assignee.trim()) return
    setSubmitting(true)
    try {
      await addTask(form)
      setForm({ title: '', assignee: '', priority: 'medium', description: '' })
      setShowForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top bar */}
      <div className="sticky top-[60px] z-10 bg-gray-900/95 border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Team Space</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
          >
            + Create Task
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Create Task Form */}
        {showForm && (
          <div className="mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-5">New Task</h3>
              <div className="space-y-4">
                <input
                  placeholder="What needs to be done?"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-200 text-sm placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
                />
                <input
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-200 text-sm placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
                />
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    placeholder="Assign to..."
                    value={form.assignee}
                    onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-200 text-sm placeholder-gray-600 outline-none focus:border-blue-500 transition-colors"
                  />
                  <select
                    value={form.priority}
                    onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-gray-200 text-sm outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                  >
                    {submitting ? 'Adding...' : 'Add Task'}
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{s.label}</p>
              <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
              {s.label === 'Efficiency' && (
                <div className="mt-3 h-1.5 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-5">
            {error}
          </div>
        )}

        {/* Task list */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-700 bg-gray-800/50">
            <p className="text-gray-500 font-medium">
              {filter === 'completed' ? 'No completed tasks yet.' : filter === 'active' ? 'Everything is done! 🎉' : 'No tasks yet — create one above.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onToggle={(id, data) => editTask(id, data)}
                onDelete={removeTask}
                onAddSubtask={addSubtask}
                onToggleSubtask={(taskId, subtaskId, data) => editSubtask(taskId, subtaskId, data)}
                onDeleteSubtask={removeSubtask}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
