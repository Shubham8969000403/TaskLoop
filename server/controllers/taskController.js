const Task = require('../models/Task');
const Subtask = require('../models/Subtask');



const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });

    const tasksWithSubtasks = await Promise.all(
      tasks.map(async (task) => {
        const subtasks = await Subtask.find({ task: task._id });
        return { ...task.toObject(), subtasks };
      })
    );

    res.json(tasksWithSubtasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const subtasks = await Subtask.find({ task: task._id });
    res.json({ ...task.toObject(), subtasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createTask = async (req, res) => {
  try {
    const { title, description, priority, assignee, dueDate } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      title,
      description,
      priority: priority || 'medium',
      assignee: assignee || 'Unassigned',
      dueDate: dueDate || null,
      owner: req.user._id,
    });

    res.status(201).json({ ...task.toObject(), subtasks: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, priority, assignee, completed, status, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (assignee !== undefined) task.assignee = assignee;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    if (completed !== undefined) {
      task.completed = completed;
      task.completedAt = completed ? new Date() : null;
      task.status = completed ? 'completed' : 'todo';

      await Subtask.updateMany({ task: task._id }, { completed });
    }

    await task.save();
    const subtasks = await Subtask.find({ task: task._id });
    res.json({ ...task.toObject(), subtasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await Subtask.deleteMany({ task: task._id });
    await task.deleteOne();

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
