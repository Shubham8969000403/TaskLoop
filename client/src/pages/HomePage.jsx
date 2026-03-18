import React, { useMemo, useState } from 'react' // Added useState
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import useTasks from '../hooks/useTasks'
import UserAvatar from '../components/UserAvatar'
import { PRIORITY_COLORS } from '../utils/constants'
import { calcProgress, timeAgo } from '../utils/helpers'

const HomePage = () => {
  const { user } = useAuth()
  const { tasks, loading } = useTasks()
  const [isGuideOpen, setIsGuideOpen] = useState(false) // State for the Guide Modal

  const progress = useMemo(() => calcProgress(tasks), [tasks])

  const totalTasks     = tasks.length
  const completedTasks = tasks.filter(t => t.completed).length
  const activeTasks    = tasks.filter(t => !t.completed).length
  const totalSubtasks  = tasks.reduce((a, t) => a + (t.subtasks?.length || 0), 0)
  const doneSubtasks   = tasks.reduce((a, t) => a + (t.subtasks?.filter(s => s.completed).length || 0), 0)
  const totalItems     = totalTasks + totalSubtasks
  const doneItems      = completedTasks + doneSubtasks

  const recentTasks = useMemo(() =>
    [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6)
  , [tasks])

  const highPriorityActive = tasks.filter(t => t.priority === 'high' && !t.completed)

  const stats = [
    { label: 'Total Tasks',  value: totalTasks,      color: 'text-blue-400',   desc: 'Created so far' },
    { label: 'Active',       value: activeTasks,      color: 'text-yellow-400', desc: 'Still in progress' },
    { label: 'Completed',    value: completedTasks,   color: 'text-green-400',  desc: 'Tasks finished' },
    { label: 'Efficiency',   value: `${progress}%`,  color: 'text-purple-400', desc: 'Overall completion' },
  ]

  return (
    <div className="relative max-w-6xl mx-auto px-6 py-8 space-y-10">
      {/* 1. Introduction Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900/20 to-gray-800 border border-gray-700 rounded-2xl p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-white mb-3">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              This system acts as a centralized command center for project management, facilitating team collaboration, ticket allocation, and real-time monitoring.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-700">🚀 Team Collaboration</span>
              <span className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-700">✅ Ticket Assignment</span>
              <span className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-900/50 px-3 py-1.5 rounded-full border border-gray-700">📊 Progress Tracking</span>
            </div>
          </div>
          <Link to="/tasks/new" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg text-center">+ New Ticket</Link>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-500">Syncing workspace...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-800 border border-gray-700 rounded-xl p-6 transition-transform hover:scale-[1.02]">
                  <p className="text-gray-400 text-sm font-medium">{s.label}</p>
                  <p className={`text-4xl font-bold mt-2 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Recent Tasks */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h2 className="text-white font-bold text-lg mb-6">Recent Tickets</h2>
              <ul className="space-y-4">
                {recentTasks.map(task => {
                  const p = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
                  return (
                    <li key={task._id}>
                      <Link to={`/tasks/${task._id}`} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/30 border border-transparent hover:border-gray-600 transition-all group">
                         <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                           {task.completed && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                         </div>
                         <p className={`flex-1 text-sm font-semibold truncate ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</p>
                         <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${p.bg} ${p.text}`}>{task.priority}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            

            {/* View Guide Component */}
            <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-6">
              <p className="text-indigo-400 font-bold text-sm mb-1">New to the Workspace?</p>
              <p className="text-gray-500 text-xs leading-relaxed">Learn how to manage team permissions and automate tickets.</p>
              <button 
                onClick={() => setIsGuideOpen(true)}
                className="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold rounded-lg transition-colors border border-indigo-500/30"
              >
                View Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- GUIDE MODAL --- */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Getting Started</h2>
              <button onClick={() => setIsGuideOpen(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            <div className="space-y-6 text-gray-300">
              <div className="flex gap-4">
                <div className="bg-blue-500/20 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <h4 className="text-white font-semibold">Invite Members</h4>
                  <p className="text-sm">Go to Team settings to invite collaborators via email address.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-green-500/20 text-green-400 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <h4 className="text-white font-semibold">Assign Tickets</h4>
                  <p className="text-sm">Click "+ New Ticket" and select an assignee to notify your team.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-purple-500/20 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <h4 className="text-white font-semibold">Track Velocity</h4>
                  <p className="text-sm">The "Efficiency" score tracks your completion rate over time.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsGuideOpen(false)}
              className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage