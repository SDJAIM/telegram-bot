const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/image-controller.js')

router.get('/image/:filename', controller.getImage)
router.post('/', controller.create)
router.get('/', controller.findAll)
router.get('/:filename', controller.findOne)
router.delete('/:filename', controller.delete)

module.exports = router
