const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const userModel = require('../models/user.model.js')
const { sendOtpMail } = require('../utilities/mailer.js')

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

async function forgotPassword(request, response) {
    try {
        const email = request.body.email?.trim().toLowerCase()
        if (!email) {
            return response.status(400).json({ message: 'Email is required' })
        }
        const GENERIC = { message: 'If this email is registered, an OTP has been sent' }

        const user = await userModel.findOne({ email }).select('+resetOtpSentAt')
        if (!user) {
            return response.status(200).json(GENERIC)
        }

        if (user.resetOtpSentAt && Date.now() - user.resetOtpSentAt.getTime() < 60 * 1000) {
            return response.status(429).json({ message: 'Please wait 60 seconds before requesting another OTP' })
        }

        const otp = crypto.randomInt(100000, 1000000).toString()
        const minutes = Number(process.env.OTP_MINUTES) || 10

        user.resetOtpHash = await bcrypt.hash(otp, 10)
        user.resetOtpExpires = new Date(Date.now() + minutes * 60 * 1000)
        user.resetOtpAttempts = 0
        user.resetOtpSentAt = new Date()
        await user.save()

        await sendOtpMail(email, otp)
        return response.status(200).json(GENERIC)
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

async function resetPassword(request, response) {
    try {
        const email = request.body.email?.trim().toLowerCase()
        const { otp, newPassword } = request.body
        if (!email || !otp || !newPassword) {
            return response.status(400).json({ message: 'Email, OTP and new password are required' })
        }
        if (newPassword.length < 8 || newPassword.length > 128) {
            return response.status(400).json({ message: 'Password must be 8-128 characters' })
        }

        const user = await userModel.findOne({ email })
            .select('+password +resetOtpHash +resetOtpExpires +resetOtpAttempts')
        if (!user || !user.resetOtpHash || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
            return response.status(400).json({ message: 'OTP expired or invalid' })
        }

        if (user.resetOtpAttempts >= 5) {
            return response.status(429).json({ message: 'Too many attempts. Request a new OTP' })
        }

        const ok = await bcrypt.compare(String(otp), user.resetOtpHash)
        if (!ok) {
            user.resetOtpAttempts += 1
            await user.save()
            return response.status(400).json({ message: 'OTP expired or invalid' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetOtpHash = undefined
        user.resetOtpExpires = undefined
        user.resetOtpAttempts = 0
        user.resetOtpSentAt = undefined
        await user.save()

        return response.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        return response.status(500).json({ message: 'Internal Server Error' })
    }
}

module.exports = { login, logout, forgotPassword, resetPassword }