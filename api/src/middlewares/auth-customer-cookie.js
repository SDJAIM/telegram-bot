module.exports = (req, res, next) => {
  if (req.session.customer) {
    next()
  } else {
    res.status(401).send({
      redirection: '/cliente/login'
    })
  }
}
