const express = require('express')
const router = express.Router()
const {
  sendInvite,
  validateInvite,
  acceptInvite,
  getMyInvites,
  cancelInvite,
} = require('../controllers/inviteController')
const { protect } = require('../middleware/authMiddleware')


router.get('/validate/:token', validateInvite)
router.post('/accept/:token', acceptInvite)


router.use(protect)
router.get('/', getMyInvites)
router.post('/send', sendInvite)
router.delete('/:id', cancelInvite)

module.exports = router