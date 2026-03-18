import React, { useState, useEffect } from 'react'

const Notes = () => {
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('taskloop_notes')
    if (stored) setNotes(stored)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('taskloop_notes', notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 600)
    return () => clearTimeout(timeout)
  }, [notes])

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">📝 Scratchpad</h1>
          <p className="text-gray-500 text-sm mt-1">Quick notes, ideas, anything</p>
        </div>
        <span className={`text-xs font-medium transition-opacity duration-300 ${saved ? 'text-green-400 opacity-100' : 'opacity-0'}`}>
          ✓ Saved
        </span>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-900/50">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Notes</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
        </div>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Start typing your notes here...&#10;&#10;• Ideas&#10;• Reminders&#10;• Anything you need"
          className="w-full h-[calc(100vh-280px)] min-h-[400px] bg-transparent px-6 py-5 text-gray-300 text-sm leading-relaxed resize-none outline-none placeholder-gray-600 font-mono"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-600 mt-2 px-1">
        <span>{notes.length} characters</span>
        <span>{notes.split('\n').filter(l => l.trim()).length} lines</span>
      </div>
    </div>
  )
}

export default Notes