const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
})

async function sendOtpMail(to, otp) {
    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: 'Your password reset OTP',
        text: `Your OTP is ${otp}. It is valid for ${process.env.OTP_MINUTES || 10} minutes. If you did not request this, ignore this email.`
    })
}

module.exports = { sendOtpMail }