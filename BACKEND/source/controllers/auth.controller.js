const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')

async function login(request, response) {
    try {
        const { username, password } = request.body
        if (!username) {
            return response.status(400).json({ message: 'Username is required' })
        }
        if (!password) {
            return response.status(400).json({ message: 'Password is required' })
        }
        const user = await userModel.findOne({ username }).select('+password')
        if (!user) {
            return response.status(401).json({ message: 'Invalid Credentials' })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return response.status(401).json({ message: 'Invalid Credentials' })
        }
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3d' })
        response.cookie('token', token)
        return response.status(200).json({ user: { _id: user._id, username: user.username } })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function logout(request, response) {
    try {
        const token = request.cookies.token || request.headers.authorization?.split(" ")[1]
        if (!token) {
            return response.status(200).json({ message: 'User logged out successfully' })
        }
        response.clearCookie('token')
        return response.status(200).json({ message: 'User logged out successfully' })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { login, logout }