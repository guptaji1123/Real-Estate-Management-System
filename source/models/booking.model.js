const mongoose = require('mongoose')
const validator = require('validator')

const bookingSchema = new mongoose.Schema({
    plot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plot',
        required: [true, 'Plot is required'],
        unique: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project is required'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [3, 'Name must be at least 3 characters'],
        maxlength: [20, 'Name cannot exceed 20 characters']
    },
    number: {
        type: String,
        trim: true,
        required: [true, 'Mobile number is required'],
        validate: {
            validator: value => validator.isMobilePhone(value, 'en-IN'),
            message: 'Invalid mobile number'
        }
    },
    amount: {
        type: Number,
        default: 0,
        min: [0, 'Amount cannot be negative']
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking creator is required']
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    remarks: {
        type: String,
        trim: true,
        maxlength: [500, 'Remarks cannot exceed 500 characters'],
        default: ''
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'COMPLETED'],
            message: 'Invalid booking status'
        },
        default: 'PENDING'
    }
}, { timestamps: true })

const bookingModel = mongoose.model('Booking', bookingSchema)

module.exports = bookingModel