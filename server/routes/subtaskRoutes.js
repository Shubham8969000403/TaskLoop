const express = require('express');
const router = express.Router();
const { getSubtasks, createSubtask, updateSubtask, deleteSubtask } = require('../controllers/subtaskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/:taskId').get(getSubtasks).post(createSubtask);
router.route('/item/:id').put(updateSubtask).delete(deleteSubtask);

module.exports = router;
