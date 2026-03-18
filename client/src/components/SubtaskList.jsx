import React, { useState } from 'react'

const SubtaskList = ({ subtasks = [], taskId, onAdd, onToggle, onDelete, darkMode }) => {
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [assignee, setAssignee] = useState('')

  const handleAdd = async () => {
    if (!text.trim()) return
    await onAdd(taskId, { text, assignee: assignee || 'Unassigned' })
    setText('')
    setAssignee('')
    setShowForm(false)
  }

  return (
    <div className="mt-4 ml-10 space-y-2">
      {subtasks.map(st => (
        <div key={st._id} className="flex items-center gap-3 group/sub">
          <button
            onClick={() => onToggle(taskId, st._id, { completed: !st.completed })}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              st.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-600 hover:border-blue-400'
            }`}
          >
            {st.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <span className={`flex-1 text-sm font-medium ${st.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>
            {st.text}
          </span>

          <span className="text-[10px] font-bold bg-gray-700 px-2 py-0.5 rounded text-gray-400">
            {st.assignee}
          </span>

          <button
            onClick={() => onDelete(taskId, st._id)}
            className="text-gray-600 hover:text-red-400 transition-all opacity-0 group-hover/sub:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}

      {showForm ? (
        <div className="space-y-2 p-3 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Subtask name"
            className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-200 text-sm placeholder-gray-600 outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <input
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Assignee"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-200 text-xs placeholder-gray-600 outline-none"
            />
            <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold">
              Save
            </button>
            <button onClick={() => { setShowForm(false); setText(''); setAssignee('') }} className="bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-xs font-bold">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="text-blue-500 hover:text-blue-400 text-xs font-bold uppercase tracking-wider transition-colors">
          + Add Subtask
        </button>
      )}
    </div>
  )
}

export default SubtaskList
