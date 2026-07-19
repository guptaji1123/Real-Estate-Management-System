const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE)
        console.log(`Application is connected to database`)
    } catch (error) {
        console.error(`Application is not connceted to database. Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB