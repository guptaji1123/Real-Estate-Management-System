const bcrypt = require('bcryptjs')
const userModel = require('../models/user.model.js')

async function createUser(request, response) {
    try {
        const { username, password, role } = request.body
        if (!username) {
            return response.status(400).json({ message: 'Username is required' })
        }
        if (!password) {
            return response.status(400).json({ message: 'Password is required' })
        }
        if (role && !['ADMIN', 'WORKER'].includes(role)) {
            return response.status(400).json({ message: 'Role must be either ADMIN, WORKER' })
        }
        if (username.length < 3 || username.length > 30) {
            return response.status(400).json({ message: 'Username must be between 3 and 30 characters' })
        }
        if (password.length < 8 || password.length > 128) {
            return response.status(400).json({ message: 'Password must be between 8 and 128 characters' })
        }
        const isExists = await userModel.findOne({ username })
        if (isExists) {
            return response.status(422).json({ message: 'Username already exists' })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({ username: username.trim(), password: hashedPassword, role })
        return response.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ message: Object.values(error.errors)[0].message })
        }
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function updateUser(request, response) {
    try {
        const _id = request.user._id
        const { username, password, fullname, number, email, role } = request.body
        const user = await userModel.findById(_id).select('+password')
        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        if (username) {
            if (username.length < 3 || username.length > 30) {
                return response.status(400).json({ message: 'Username must be between 3 and 30 characters' })
            }
            const usernameExists = await userModel.findOne({ username, _id: { $ne: _id } })
            if (usernameExists) {
                return response.status(422).json({ message: 'Username already exists' })
            }
            user.username = username.trim()
        }
        if (password) {
            if (password.length < 8 || password.length > 128) {
                return response.status(400).json({ message: 'Password must be between 8 and 128 characters' })
            }
            user.password = await bcrypt.hash(password, 10)
        }
        if (fullname !== undefined) {
            if (fullname && (fullname.length < 3 || fullname.length > 30)) {
                return response.status(400).json({ message: 'Full name must be between 3 and 30 characters' })
            }
            user.fullname = fullname
        }
        if (number !== undefined) {
            const numberExists = await userModel.findOne({ number, _id: { $ne: _id } })
            if (numberExists) {
                return response.status(422).json({ message: 'Mobile number already exists' })
            }
            user.number = number
        }
        if (email !== undefined) {
            const emailExists = await userModel.findOne({ email, _id: { $ne: _id } })
            if (emailExists) {
                return response.status(422).json({ message: 'Email already exists' })
            }
            user.email = email.toLowerCase().trim()
        }
        if (role) {
            if (!['ADMIN', 'WORKER'].includes(role)) {
                return response.status(400).json({ message: 'Role must be either ADMIN or WORKER' })
            }
            user.role = role
        }
        await user.save()
        return response.status(200).json({
            message: 'User updated successfully', user: { _id: user._id, username: user.username, fullname: user.fullname, number: user.number, email: user.email, role: user.role }
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ message: Object.values(error.errors)[0].message })
        }
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getUser(request, response) {
    try {
        const _id = request.user._id
        const user = await userModel.findById(_id)
        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        return response.status(200).json({ user })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function getAllUser(request, response) {
    try {
        const users = await userModel.find()
        if (users.length === 0) {
            return response.status(404).json({ message: 'Users not found' })
        }
        return response.status(200).json({ count: users.length, users })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function deleteUser(request, response) {
    try {
        const { _idUser } = request.params
        const user = await userModel.findById(_idUser)
        if (!user) {
            return response.status(404).json({ message: 'User not found' })
        }
        if (user.role === 'ADMIN') {
            return response.status(403).json({ message: 'Cannot delete an ADMIN user' })
        }
        await userModel.findByIdAndDelete(_idUser)
        return response.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { createUser, updateUser, getAllUser, getUser, deleteUser }