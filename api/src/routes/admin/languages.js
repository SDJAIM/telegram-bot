const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/languages-controller.js')
const authUserCookie = require('../../middlewares/auth-user-cookie.js')

router.post('/', [authUserCookie], controller.create)
router.get('/', [authUserCookie], controller.findAll)
router.get('/:id', [authUserCookie], controller.findOne)
router.put('/:id', [authUserCookie], controller.update)
router.delete('/:id', [authUserCookie], controller.delete)

module.exports = router
