const crypto = require('crypto')
const Invite = require('../models/Invite')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')
const { generateToken } = require('../config/jwt')

const sendInvite = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) return res.status(400).json({ message: 'Email is required' })

    // Check if already a registered user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'This email already has an account' })
    }

    // Check if there's already a valid pending invite
    const existingInvite = await Invite.findOne({
      email,
      used: false,
      expiresAt: { $gt: new Date() },
    })
    if (existingInvite) {
      return res.status(400).json({ message: 'An invite has already been sent to this email' })
    }

    // Create invite token
    const token = crypto.randomBytes(32).toString('hex')
    const invite = await Invite.create({
      email,
      token,
      invitedBy: req.user._id,
    })

    const inviteUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/invite/${token}`

    // Send email
    await sendEmail({
      to: email,
      subject: `${req.user.name} invited you to join TaskLoop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #111827; color: #f9fafb; padding: 40px; border-radius: 12px;">
          <h1 style="color: #3b82f6; font-size: 28px; margin-bottom: 8px;">TaskLoop</h1>
          <p style="color: #9ca3af; font-size: 14px; margin-bottom: 32px;">Task Management</p>

          <h2 style="color: #f9fafb; font-size: 20px;">You've been invited!</h2>
          <p style="color: #d1d5db; line-height: 1.6;">
            <strong style="color: #f9fafb;">${req.user.name}</strong> has invited you to join their workspace on TaskLoop.
          </p>

          <div style="margin: 32px 0;">
            <a href="${inviteUrl}"
               style="background: #3b82f6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block;">
              Accept Invitation →
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px;">
            This invite link expires in 7 days. If you didn't expect this email, you can safely ignore it.
          </p>

          <hr style="border: none; border-top: 1px solid #374151; margin: 24px 0;" />
          <p style="color: #4b5563; font-size: 12px;">
            Or copy this link: <span style="color: #60a5fa;">${inviteUrl}</span>
          </p>
        </div>
      `,
    })

    res.status(201).json({ message: `Invite sent to ${email}` })
  } catch (error) {
    console.error('Send invite error:', error)
    if (error.message?.includes('Invalid login') || error.message?.includes('auth')) {
      return res.status(500).json({ message: 'Email sending failed. Check your EMAIL_USER and EMAIL_PASS in .env' })
    }
    res.status(500).json({ message: error.message || 'Failed to send invite' })
  }
}

const validateInvite = async (req, res) => {
  try {
    const invite = await Invite.findOne({
      token: req.params.token,
      used: false,
      expiresAt: { $gt: new Date() },
    }).populate('invitedBy', 'name')

    if (!invite) {
      return res.status(400).json({ message: 'Invite link is invalid or has expired' })
    }

    res.json({
      email: invite.email,
      invitedBy: invite.invitedBy?.name || 'Someone',
      expiresAt: invite.expiresAt,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const acceptInvite = async (req, res) => {
  try {
    const { name, password } = req.body

    const invite = await Invite.findOne({
      token: req.params.token,
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!invite) {
      return res.status(400).json({ message: 'Invite link is invalid or has expired' })
    }

    const exists = await User.findOne({ email: invite.email })
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists' })
    }

    const user = await User.create({
      name,
      email: invite.email,
      password,
    })

  
    invite.used = true
    await invite.save()

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getMyInvites = async (req, res) => {
  try {
    const invites = await Invite.find({ invitedBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('email used expiresAt createdAt')

    res.json(invites)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


const cancelInvite = async (req, res) => {
  try {
    const invite = await Invite.findOneAndDelete({
      _id: req.params.id,
      invitedBy: req.user._id,
      used: false,
    })
    if (!invite) return res.status(404).json({ message: 'Invite not found' })
    res.json({ message: 'Invite cancelled' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { sendInvite, validateInvite, acceptInvite, getMyInvites, cancelInvite }