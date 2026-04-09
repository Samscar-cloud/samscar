import nodemailer from 'nodemailer'

function getTransporter() {
  if (!process.env.EMAIL_SERVER_HOST) {
    return null
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number.parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = getTransporter()
  if (!transporter) {
    console.warn('Email not configured, skipping send to', to)
    return null
  }
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return result
  } catch (error) {
    console.error('Email sending failed:', error)
    return null
  }
}