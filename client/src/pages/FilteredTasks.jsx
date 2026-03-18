import React from 'react'
import { useParams, Link } from 'react-router-dom'
import useTasks from '../../hooks/useTasks.js'
import TaskCard from '../../components/TaskCard.js'

const FilteredTasks = ({ filterType }) => {
  const { tasks, loading, editTask, removeTask, addSubtask, editSubtask, removeSubtask } = useTasks()

  const config = {
    active:    { label: 'Active Tasks',       icon: '⚡', filter: t => !t.completed },
    high:      { label: 'High Priority',       icon: '🔴', filter: t => t.priority === 'high' && !t.completed },
    completed: { label: 'Completed Tasks',     icon: '✓',  filter: t => t.completed },
  }

  const { label, icon, filter } = config[filterType] || config.active
  const filtered = tasks.filter(filter)

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>{icon}</span> {label}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/tasks/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
          + New Task
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-gray-700 bg-gray-800/30">
          <p className="text-gray-500 text-lg mb-2">{icon}</p>
          <p className="text-gray-400 font-medium">No {label.toLowerCase()} found</p>
          <Link to="/dashboard" className="text-blue-400 hover:underline text-sm mt-2 block">Go to Dashboard</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(task => (
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
  )
}

export default FilteredTasks