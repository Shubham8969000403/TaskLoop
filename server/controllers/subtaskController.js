const Subtask = require('../models/Subtask');
const Task = require('../models/Task');


const getSubtasks = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const subtasks = await Subtask.find({ task: req.params.taskId });
    res.json(subtasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createSubtask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, owner: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { text, assignee } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    const subtask = await Subtask.create({
      text,
      assignee: assignee || 'Unassigned',
      task: task._id,
      owner: req.user._id,
    });

    res.status(201).json(subtask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateSubtask = async (req, res) => {
  try {
    const subtask = await Subtask.findOne({ _id: req.params.id, owner: req.user._id });
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    const { completed, text, assignee } = req.body;
    if (completed !== undefined) subtask.completed = completed;
    if (text !== undefined) subtask.text = text;
    if (assignee !== undefined) subtask.assignee = assignee;

    await subtask.save();

    const allSubtasks = await Subtask.find({ task: subtask.task });
    const allDone = allSubtasks.length > 0 && allSubtasks.every(s => s.completed);
    await Task.findByIdAndUpdate(subtask.task, {
      completed: allDone,
      status: allDone ? 'completed' : 'in-progress',
      completedAt: allDone ? new Date() : null,
    });

    res.json(subtask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteSubtask = async (req, res) => {
  try {
    const subtask = await Subtask.findOne({ _id: req.params.id, owner: req.user._id });
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    await subtask.deleteOne();
    res.json({ message: 'Subtask deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSubtasks, createSubtask, updateSubtask, deleteSubtask };
