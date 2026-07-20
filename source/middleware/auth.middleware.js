const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model.js')

async function authenticate(request, response, next) {
    try {
        const token = request.cookies?.token || request.headers.authorization?.split(' ')[1]
        if (!token) {
            return response.status(401).json({ message: 'Unauthorized' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded._id)
        if (!user) {
            return response.status(401).json({ message: 'Unauthorized: User not found' })
        }
        request.user = user
        next()
    } catch (error) {
        return response.status(401).json({ message: 'Unauthorized: Invalid or expired token' })
    }
}

async function authenticateAdmin(request, response, next) {
    try {
        await authenticate(request, response, () => {
            if (request.user.role !== 'ADMIN') {
                return response.status(403).json({ message: 'Forbidden: Admins only' })
            }
            next()
        })
    } catch (error) {
        return response.status(401).json({ message: 'Unauthorized: Invalid or expired token' })
    }
}

module.exports = { authenticate, authenticateAdmin }