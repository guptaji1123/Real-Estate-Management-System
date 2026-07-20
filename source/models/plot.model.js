const mongoose = require('mongoose')

const plotSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project is required'],
    },
    plotNumber: {
        type: String,
        required: [true, 'Plot number is required'],
        trim: true,
        minlength: [1, 'Plot number cannot be empty'],
        maxlength: [20, 'Plot number cannot exceed 20 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
        default: ''
    },
    area: {
        type: Number,
        required: [true, 'Area is required'],
        min: [0, 'Area cannot be negative']
    },
    unit: {
        type: String,
        enum: {
            values: ['SQFT', 'SQM', 'BIGHA', 'ACRE'],
            message: 'Invalid area unit'
        },
        default: 'SQFT'
    },
    status: {
        type: String,
        enum: {
            values: ['AVAILABLE', 'BOOKED', 'SOLD'],
            message: 'Invalid plot status'
        },
        default: 'AVAILABLE'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    }
}, { timestamps: true })

plotSchema.index({
    project: 1,
    plotNumber: 1
}, { unique: true })

const plotModel = mongoose.model('Plot', plotSchema)

module.exports = plotModel