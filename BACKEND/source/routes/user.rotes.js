const express = require('express')
const authMiddleware = require('../middleware/auth.middleware.js')
const userController = require('../controllers/user.controller.js')

const router = express.Router()

router.post('/createUser', authMiddleware.authenticateAdmin, userController.createUser)
router.patch('/updateUser', authMiddleware.authenticate, userController.updateUser)
router.get('/getUser', authMiddleware.authenticate, userController.getUser)
router.get('/getAllUser', authMiddleware.authenticateAdmin, userController.getAllUser)
router.delete('/deleteUser/:_idUser', authMiddleware.authenticateAdmin, userController.deleteUser)

module.exports = router