const express = require('express')
const router = express.Router()

// POST /api/contact
router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' })
  }
  // In production, send email via Nodemailer / SendGrid
  console.log(`📧 New Contact Form Submission:
  From: ${name} <${email}> | ${phone}
  Subject: ${subject}
  Message: ${message}`)

  res.json({ message: 'Message received! We will reply within 24 hours.' })
})

module.exports = router
