const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Project name is required`],
        trim: true,
        minlength: [3, `Project name must be at least 3 characters`],
        maxlength: [100, `Project name cannot exceed 100 characters`],
        unique: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, `Description cannot exceed 1000 characters`],
        default: ``
    },
    location: {
        type: String,
        required: [true, `Location is required`],
        trim: true,
        maxlength: [200, `Location cannot exceed 200 characters`]
    },
    status: {
        type: String,
        enum: {
            values: ['PLANNING', 'ONGOING', 'COMPLETED', 'ON_HOLD'],
            message: `Invalid project status`
        },
        default: 'PLANNING'
    }
}, { timestamps: true })

const projectModel = mongoose.model('Project', projectSchema)

module.exports = projectModel