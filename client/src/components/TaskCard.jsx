import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PRIORITY_COLORS } from '../utils/constants'
import { timeAgo } from '../utils/helpers'
import SubtaskList from './SubtaskList'
import UserAvatar from './UserAvatar'

const TaskCard = ({ task, onToggle, onDelete, onAddSubtask, onToggleSubtask, onDeleteSubtask }) => {
  const navigate = useNavigate()
  const p = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium
  const subtasksDone = task.subtasks?.filter(s => s.completed).length || 0
  const subtasksTotal = task.subtasks?.length || 0

  return (
    <div className={`rounded-2xl border transition-all duration-200 group bg-gray-800 hover:border-gray-600 ${task.completed ? 'border-gray-700 opacity-70' : 'border-gray-700'}`}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(task._id, { completed: !task.completed })}
            className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              task.completed ? 'bg-green-500 border-green-500' : 'border-gray-600 hover:border-blue-500'
            }`}
          >
            {task.completed && (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <button
                onClick={() => navigate(`/tasks/${task._id}`)}
                className={`text-base font-bold text-left hover:text-blue-400 transition-colors ${task.completed ? 'line-through text-gray-500' : 'text-gray-100'}`}
              >
                {task.title}
              </button>
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold border ${p.bg} ${p.text} ${p.border}`}>
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className="text-gray-500 text-sm mb-2 line-clamp-1">{task.description}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5">
                <UserAvatar name={task.assignee} size="sm" />
                <span>{task.assignee}</span>
              </div>
              {subtasksTotal > 0 && (
                <span>{subtasksDone}/{subtasksTotal} subtasks</span>
              )}
              <span>{timeAgo(task.createdAt)}</span>
            </div>
          </div>

          {/* Delete */}
          <button
            onClick={() => onDelete(task._id)}
            className="text-gray-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Subtasks */}
        <SubtaskList
          subtasks={task.subtasks || []}
          taskId={task._id}
          onAdd={onAddSubtask}
          onToggle={onToggleSubtask}
          onDelete={onDeleteSubtask}
        />
      </div>
    </div>
  )
}

export default TaskCard
