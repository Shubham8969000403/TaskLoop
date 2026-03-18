const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/profile').get(getProfile).put(updateProfile);
router.put('/password', changePassword);

module.exports = router;
