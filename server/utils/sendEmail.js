const nodemailer = require('nodemailer')

const sendEmail = async ({ to, subject, html }) => {
  
  const service = process.env.EMAIL_SERVICE || 'gmail'

  let transportConfig

  if (service === 'mailtrap') {
    
    transportConfig = {
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }
  } else if (service === 'outlook') {
    transportConfig = {
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }
  } else {
    // Gmail (default)
    transportConfig = {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    }
  }

  const transporter = nodemailer.createTransport(transportConfig)

  await transporter.sendMail({
    from: `"TaskLoop" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  })
}

module.exports = sendEmail