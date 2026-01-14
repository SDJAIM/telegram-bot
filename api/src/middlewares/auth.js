const jwt = require('jsonwebtoken')

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      const err = new Error('Token de acceso requerido')
      err.statusCode = 401
      throw err
    }

    const parts = authHeader.split(' ')

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      const err = new Error('Formato de token inválido')
      err.statusCode = 401
      throw err
    }

    const token = parts[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      name: decoded.name
    }

    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      err.message = 'Token expirado'
      err.statusCode = 401
    } else if (err.name === 'JsonWebTokenError') {
      err.message = 'Token inválido'
      err.statusCode = 401
    }

    next(err)
  }
}
