const nodemailer = require('nodemailer')
require('dotenv').config()
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.Email,
        pass: process.env.Email_Pass
    }
});

let emailTextSender = async (reciverEmail = null, subject = "WELCOME TO BLACKMART", message = null) => {

    if (reciverEmail === null) {
        return console.log("value is null pls provide value")
    }
    let mailOption = {
        from: process.env.Email,
        to: reciverEmail,
        subject: subject,
        text: message,
    }
    try {
        transporter.sendMail(mailOption)
    } catch (error) {
        return console.log({ msg: "something Went wronge", status: "fail", error: error })
    }
}

let ForgetPasswordEmailSend = async (reciverEmail, link) => {
    if (!reciverEmail) { return false }

    return new Promise(async (res, rej) => {
        try {
            res(
                await transporter.sendMail({
                    from: process.env.Email,
                    to: reciverEmail,
                    subject: "Kaisar - Password Reset Link",
                    html: `<a href=${link}>Click Here</a> to Reset Your Password`
                }))
        } catch (error) {
            return rej(error)
        }
    })
}

module.exports = { emailTextSender, transporter, ForgetPasswordEmailSend }