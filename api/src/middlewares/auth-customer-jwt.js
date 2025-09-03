require('dotenv').config()
const jwt = require('jsonwebtoken')
const process = require('process')

const verifyCompanyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      redirection: '/empresa/login'
    })
  }

  const token = req.headers.authorization.split(' ')[1]

  if (token === 'null') {
    return res.status(401).send({
      redirection: '/empresa/login'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        redirection: '/empresa/login'
      })
    }

    if (decoded.type !== 'companyStaff') {
      return res.status(401).send({
        redirection: '/empresa/login'
      })
    }

    req.companyStaffId = decoded.companyStaffId
    req.companyId = decoded.companyId

    next()
  })
}

const authCompanyJwt = {
  verifyCompanyToken
}

module.exports = authCompanyJwt
