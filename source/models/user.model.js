const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        maxlength: [128, 'Password cannot exceed 128 characters'],
        select: false
    },
    fullname: {
        type: String,
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters'],
        maxlength: [30, 'Full name cannot exceed 30 characters']
    },
    number: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        default: undefined,
        validate: {
            validator: (value) => validator.isMobilePhone(value, 'en-IN'),
            message: 'Please enter a valid mobile number'
        }
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        default: undefined,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email address'
        }
    },
    role: {
        type: String,
        enum: {
            values: ['WORKER', 'ADMIN'],
            message: 'Role must be either WORKER or ADMIN'
        },
        default: 'WORKER',
    }
}, { timestamps: true })

const userModel = mongoose.model('User', userSchema)

module.exports = userModel