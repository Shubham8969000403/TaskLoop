import { useState, useEffect, useCallback } from 'react'
import {
  fetchTasks, createTask, updateTask, deleteTask,
  createSubtask, updateSubtask, deleteSubtask
} from '../services/taskService'

const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchTasks()
      setTasks(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  const addTask = async (taskData) => {
    const newTask = await createTask(taskData)
    setTasks(prev => [newTask, ...prev])
    return newTask
  }

  const editTask = async (id, taskData) => {
    const updated = await updateTask(id, taskData)
    setTasks(prev => prev.map(t => t._id === id ? updated : t))
    return updated
  }

  const removeTask = async (id) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t._id !== id))
  }

  const addSubtask = async (taskId, subtaskData) => {
    const newSub = await createSubtask(taskId, subtaskData)
    setTasks(prev => prev.map(t =>
      t._id === taskId ? { ...t, subtasks: [...t.subtasks, newSub] } : t
    ))
    return newSub
  }

  const editSubtask = async (taskId, subtaskId, subtaskData) => {
    const updated = await updateSubtask(subtaskId, subtaskData)
    setTasks(prev => prev.map(t =>
      t._id === taskId
        ? { ...t, subtasks: t.subtasks.map(s => s._id === subtaskId ? updated : s) }
        : t
    ))
    return updated
  }

  const removeSubtask = async (taskId, subtaskId) => {
    await deleteSubtask(subtaskId)
    setTasks(prev => prev.map(t =>
      t._id === taskId
        ? { ...t, subtasks: t.subtasks.filter(s => s._id !== subtaskId) }
        : t
    ))
  }

  return {
    tasks, loading, error, reload: loadTasks,
    addTask, editTask, removeTask,
    addSubtask, editSubtask, removeSubtask
  }
}

export default useTasks
