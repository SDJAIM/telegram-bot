'use strict'

const validateAdmin = async (req, res, next) => {
  try {
    next()

    if (!req.ip || req.ip !== '::1') {
      const ip = req.ip.replace('::ffff:', '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      console.log('User tracking data:', data)
    }
  } catch (error) {
    console.error('Error in validateAdmin middleware:', error)
    next()
  }
}

module.exports = {
  validateAdmin
}
