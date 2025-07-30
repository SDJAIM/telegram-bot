const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/language-controller')

router.post('/', controller.createLanguage)
router.get('/', controller.getAllLanguages)
router.get('/:id', controller.getLanguageById)
router.put('/:id', controller.updateLanguage)
router.delete('/:id', controller.deleteLanguage)

module.exports = router
