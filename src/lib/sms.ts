import twilio, { Twilio } from 'twilio'

export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

let client: Twilio | null = null

function getClient() {
  if (client) return client

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.warn('Twilio credentials not configured. SMS will not be sent.')
    return null
  }

  try {
    client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    return client
  } catch (error) {
    console.warn('Failed to initialize Twilio client:', error)
    return null
  }
}

export const sendSMS = async (to: string, message: string) => {
  const twilioClient = getClient()
  if (!twilioClient) {
    console.warn('Skipping SMS send: Twilio not configured.', { to, message })
    return null
  }

  if (!TWILIO_PHONE_NUMBER) {
    console.warn('TWILIO_PHONE_NUMBER not configured. Skipping SMS send.')
    return null
  }

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to,
    })
    return result
  } catch (error) {
    console.error('SMS sending failed:', error)
    return null
  }
}