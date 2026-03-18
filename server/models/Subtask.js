const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Subtask text is required'],
    trim: true,
  },
  assignee: {
    type: String,
    default: 'Unassigned',
  },
  completed: {
    type: Boolean,
    default: false,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Subtask', subtaskSchema);
