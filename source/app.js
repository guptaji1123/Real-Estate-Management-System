const express = require('express')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth.routes.js')
const projectRoutes = require('./routes/project.routes.js')
const plotRoutes = require('./routes/plot.routes.js')
const bookingRoutes = require('./routes/booking.routes.js')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/project', projectRoutes)
app.use('/api/plot', plotRoutes)
app.use('/api/booking', bookingRoutes)

module.exports = app