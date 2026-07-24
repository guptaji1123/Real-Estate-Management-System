require('dotenv').config()
const app = require('./source/app.js')
const connectDB = require('./source/database/database.js')

const PORT = process.env.PORT || 3000

async function startServer() {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Application is running on port ${PORT}`)
    })
}

startServer()