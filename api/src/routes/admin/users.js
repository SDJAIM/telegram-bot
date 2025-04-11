const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  console.log(req.body)
  res.send('POST request to the homepage')
})

router.get('/', (req, res) => {
  console.log(req.query)
  res.send('GET request to the homepage')
})

router.get('/:id', (req, res) => {
  console.log(req.params.id)
  res.send('GET request to the homepage')
})

router.put('/:id', (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  res.send('PUT request to the homepage')
})

router.delete('/:id', (req, res) => {
  console.log(req.params.id)
  res.send('DELETE request to the homepage')
})

module.exports = router
