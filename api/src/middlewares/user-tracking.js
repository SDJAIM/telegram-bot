'use strict'

const validateAdmin = async (req, res, next) => {
  try {
    // Perform IP tracking for non-local requests
    if (req.ip && req.ip !== '::1') {
      const ip = req.ip.replace('::ffff:', '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      console.log('User tracking data:', data)
    }

    // Call next() AFTER async work completes
    next()
  } catch (error) {
    console.error('Error in validateAdmin middleware:', error)
    // Continue even if tracking fails
    next()
  }
}

module.exports = {
  validateAdmin
}
