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

    if (reciverEmail === null || message === null) {
        return console.log("value is null pls provide value")
    }
    let mailOption = {
        from: process.env.Email,
        to: reciverEmail,
        subject: subject,
        text: message,
    }
    try {
        await transporter.sendMail(mailOption)
    } catch (error) {
        return console.log({ msg: "something Went wronge", status: "fail", error: error })
    }
}

module.exports = { emailTextSender, transporter }