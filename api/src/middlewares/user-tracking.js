module.exports = async (req, res, next) => {
  next()

  try {
    if (!req.ip || req.ip !== '::1') {
      const ip = req.ip.replace('::ffff:', '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)
      const data = await response.json()
      console.log(data)
    }
  } catch (error) {
    console.error('Error fetching user tracking data:', error)
  }
}
