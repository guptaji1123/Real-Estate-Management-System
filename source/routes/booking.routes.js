const express = require('express')
const authMiddleware = require('../middleware/auth.middleware.js')
const bookingController = require('../controllers/booking.controller.js')

const router = express.Router()

router.get('/getBooking/:_idPlot', authMiddleware.authenticate, bookingController.getBooking)

module.exports = router