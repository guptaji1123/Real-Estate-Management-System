const bookingModel = require('../models/booking.model.js')
const plotModel = require('../models/plot.model.js')
const validator = require('validator')

async function createBooking(request, response) {
    try {
        const { _idProject, _idPlot } = request.params
        const _idUser = request.user._id
        const { name, number, amount, remarks, status } = request.body
        if (!_idProject) {
            return response.status(400).json({ message: 'Project Id is required' })
        }
        if (!_idPlot) {
            return response.status(400).json({ message: 'Plot Id is required' })
        }
        if (!name) {
            return response.status(400).json({ message: 'Name is required' })
        }
        if (!number) {
            return response.status(400).json({ message: 'Number is required' })
        }
        if (name.length < 3 || name.length > 20) {
            return response.status(400).json({ message: 'Name must be between 3 and 20 characters' })
        }
        if (amount !== undefined && (isNaN(amount) || Number(amount) < 0)) {
            return response.status(400).json({ message: 'Amount cannot be negative' })
        }
        if (remarks && remarks.length > 500) {
            return response.status(400).json({ message: 'Remarks cannot exceed 500 words' })
        }
        if (status && !['PENDING', 'COMPLETED'].includes(status)) {
            return response.status(400).json({ message: 'Status must be either PENDING OR COMPLETED' })
        }
        if (!validator.isMobilePhone(number, 'en-IN')) {
            return response.status(400).json({ message: 'Invalid mobile number' })
        }
        const plot = await plotModel.findOne({ project: _idProject, _id: _idPlot })
        if (!plot) {
            return response.status(404).json({ message: 'Plot not found' })
        }
        if (plot.status === 'BOOKED' || plot.status === 'SOLD') {
            return response.status(400).json({ message: 'Plot already Booked or Sold' })
        }
        const booking = await bookingModel.create({ project: _idProject, plot: _idPlot, bookedBy: _idUser, name, number, amount, remarks, status })
        if (booking.status === 'PENDING') {
            plot.status = 'BOOKED'
        }
        if (booking.status === 'COMPLETED') {
            plot.status = 'SOLD'
        }
        await plot.save()
        return response.status(200).json({ booking })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function updateBooking(request, response) {
    try {
        const { _idProject, _idPlot } = request.params
        const { name, number, amount, remarks, status } = request.body
        const booking = await bookingModel.findOne({ project: _idProject, plot: _idPlot })
        if (!booking) {
            return response.status(404).json({ message: 'Booking not found' })
        }
        const plot = await plotModel.findOne({ project: _idProject, _id: _idPlot })
        if (!plot) {
            return response.status(404).json({ message: 'Plot not found' })
        }
        if (name !== undefined) {
            if (name.length < 3 || name.length > 20) {
                return response.status(400).json({ message: 'Name must be between 3 and 20 characters' })
            }
            booking.name = name
        }
        if (number !== undefined) {
            if (!validator.isMobilePhone(number, 'en-IN')) {
                return response.status(400).json({ message: 'Invalid mobile number' })
            }
            booking.number = number
        }
        if (amount !== undefined) {
            if (isNaN(amount) || Number(amount) < 0) {
                return response.status(400).json({ message: 'Amount cannot be negative' })
            }
            booking.amount = amount
        }
        if (remarks !== undefined) {
            if (remarks.length > 500) {
                return response.status(400).json({ message: 'Remarks cannot exceed 500 characters' })
            }
            booking.remarks = remarks
        }
        if (status !== undefined) {
            if (!['PENDING', 'COMPLETED'].includes(status)) {
                return response.status(400).json({ message: 'Status must be either PENDING or COMPLETED' })
            }
            booking.status = status
            if (status === 'PENDING') {
                plot.status = 'BOOKED'
            } else if (status === 'COMPLETED') {
                plot.status = 'SOLD'
            }
            await plot.save()
        }
        await booking.save()
        return response.status(200).json({ message: 'Booking updated successfully', booking })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function search(request, response) {
    try {
        const _idProject = request.params._idProject
        const keyword = request.query.keyword
        if (!keyword || !keyword.trim()) {
            return response.status(400).json({ message: 'Keyword is required' })
        }
        const bookings = await bookingModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { number: { $regex: keyword, $options: 'i' } },
                { remarks: { $regex: keyword, $options: 'i' } }
            ], project: _idProject
        })
        if (bookings.length === 0) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ bookings })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getBookings(request, response) {
    try {
        const _idProject = request.params._idProject
        const bookings = await bookingModel.find({ project: _idProject })
        if (bookings.length === 0) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ bookings })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getBookingById(request, response) {
    try {
        const { _idPlot, _idProject } = request.params
        const booking = await bookingModel.findOne({ plot: _idPlot, project: _idProject })
        if (!booking) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ booking })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getBookingsOfUser(request, response) {
    try {
        const bookedBy = request.user._id
        const bookings = await bookingModel.find({ bookedBy })
        if (bookings.length === 0) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ bookings })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getBookingsOfAllUser(request, response) {
    try {
        const bookedBy = request.params._idUser
        const bookings = await bookingModel.find({ bookedBy })
        if (bookings.length === 0) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ bookings })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getBookingsByStatus(request, response) {
    try {
        const { _idProject, status } = request.params
        const allowedStatus = ['PENDING', 'COMPLETED']
        if (!allowedStatus.includes(status)) {
            return response.status(400).json({ message: 'Invalid plot status' })
        }
        const bookings = await bookingModel.find({ project: _idProject, status })
        if (bookings.length === 0) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ bookings })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getBookingsByDateRange(request, response) {
    try {
        const { _idProject } = request.params
        const { startingDate, endingDate } = request.query
        const filter = { project: _idProject }
        if (startingDate || endingDate) {
            filter.bookingDate = {}
            if (startingDate) {
                filter.bookingDate.$gte = new Date(startingDate)
            }
            if (endingDate) {
                filter.bookingDate.$lte = new Date(endingDate)
            }
        }
        const bookings = await bookingModel.find(filter)
        if (bookings.length === 0) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ bookings })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getBookingsByPriceRange(request, response) {
    try {
        const { _idProject } = request.params
        const { minPrice, maxPrice } = request.query
        const filter = { project: _idProject }
        if (minPrice || maxPrice) {
            filter.amount = {}
            if (minPrice) {
                filter.amount.$gte = Number(minPrice)
            }
            if (maxPrice) {
                filter.amount.$lte = Number(maxPrice)
            }
        }
        const bookings = await bookingModel.find(filter)
        if (bookings.length === 0) {
            return response.status(404).json({ message: 'Bookings not found' })
        }
        return response.status(200).json({ bookings })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function deleteBooking(request, response) {
    try {
        const { _idProject, _idBooking } = request.params
        const booking = await bookingModel.findOne({ project: _idProject, _id: _idBooking })
        if (!booking) {
            return response.status(404).json({ message: 'Booking not found' })
        }
        const plot = await plotModel.findById(booking.plot)
        plot.status = 'AVAILABLE'
        await plot.save()
        await bookingModel.deleteOne({ _id: booking._id })
        return response.status(200).json({ message: 'Booking Deleted Successfully' })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { createBooking, search, getBookings, getBookingById, getBookingsOfUser, getBookingsOfAllUser, getBookingsByStatus, getBookingsByDateRange, getBookingsByPriceRange, deleteBooking }