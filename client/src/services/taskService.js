import api from './api'

export const fetchTasks = async () => {
  const { data } = await api.get('/tasks')
  return data
}

export const fetchTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`)
  return data
}

export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData)
  return data
}

export const updateTask = async (id, taskData) => {
  const { data } = await api.put(`/tasks/${id}`, taskData)
  return data
}

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`)
  return data
}

export const createSubtask = async (taskId, subtaskData) => {
  const { data } = await api.post(`/subtasks/${taskId}`, subtaskData)
  return data
}

export const updateSubtask = async (subtaskId, subtaskData) => {
  const { data } = await api.put(`/subtasks/item/${subtaskId}`, subtaskData)
  return data
}

export const deleteSubtask = async (subtaskId) => {
  const { data } = await api.delete(`/subtasks/item/${subtaskId}`)
  return data
}
