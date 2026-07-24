const express = require('express')
const authMiddleware = require('../middleware/auth.middleware.js')
const bookingController = require('../controllers/booking.controller.js')

const router = express.Router()

router.post('/createBooking/:_idProject/:_idPlot', authMiddleware.authenticate, bookingController.createBooking)
router.patch('/updateBooking/:_idProject/:_idPlot', authMiddleware.authenticate, bookingController.updateBooking)
router.get('/search/:_idProject', authMiddleware.authenticate, bookingController.search)
router.get('/getBookings/:_idProject', authMiddleware.authenticate, bookingController.getBookings)
router.get('/getBooking/:_idProject/:_idPlot', authMiddleware.authenticate, bookingController.getBookingById)
router.get('/getBookings', authMiddleware.authenticate, bookingController.getBookingsOfUser)
router.get('/getAllBookings/:_idUser', authMiddleware.authenticateAdmin, bookingController.getBookingsOfAllUser)
router.get('/getBookings/:_idProject/priceRange', authMiddleware.authenticate, bookingController.getBookingsByPriceRange)
router.get('/getBookings/:_idProject/dateRange', authMiddleware.authenticate, bookingController.getBookingsByDateRange)
router.get('/getBookings/:_idProject/:status', authMiddleware.authenticate, bookingController.getBookingsByStatus)
router.delete('/deleteBooking/:_idProject/:_idBooking', authMiddleware.authenticate, bookingController.deleteBooking)
module.exports = router