const bookingModel = require('../models/booking.model.js')

async function getBooking(request, response) {
    try {
        const booking = await bookingModel.findOne({ plot: request.params._idPlot })
        if (!booking) {
            return response.status(404).json({ message: `Booking not found` })
        }
        return response.status(200).json({ booking: booking })
    } catch (error) {
        return response.status(500).json({ message: `Internal Server Error` })
    }
}

module.exports = { getBooking }