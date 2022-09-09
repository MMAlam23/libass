const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { emailTextSender } = require('../config/nodemail')
const joi = require('joi')
const { Users } = require('../model/user')
const { UserValidate } = require('../model/joiUser')
const CustomError = require('../services/CustomError')
const asyncError = require('../middleware/asyncError')
require('dotenv').config()
const { jwt_Secret_Key } = process.env

let control = {}

control.register = async (req, res, next) => {
    let { email, password, username, address, contact } = req.body
    let valid = UserValidate(req.body)
    if (valid) {
        return next(valid)
    }
    if (email && password && username && address && contact) {
        try {
            // CHEKING user is present or not 
            let user = await Users.findOne({ where: { email: email }, logging: false })
            if (user !== null) {
                return next(CustomError.alreadyExist("user is present "))
            }
            // genrating salt round and hasing password 
            let salt = await bcrypt.genSalt(11);
            let hashPassword = await bcrypt.hash(password, salt)
            // creating user  
            let result = await Users.create({
                email, password: hashPassword, username, address, contact
            }, { logging: false })
            //  sending emsail to user 
            // emailTextSender(result.email, "singup is complete you are register !")
            let token = jwt.sign({ userId: result.id }, jwt_Secret_Key)
            return res.cookie("jwt", token).send({ "status": "successfully", Token: token })
        } catch (error) {
            return next(error)
        }
    } else {
        return next(CustomError.allFieldAreRequired('all field are required '))
    }
}

control.login = async (req, res, next) => {

    let Schema = joi.object({
        email: joi.string().email().min(1).required(),
        password: joi.string().min(1).required(),
    })
    let { error } = Schema.validate(req.body, { abortEarly: false })
    if (error) {
        return next(error)
    }

    let { email, password } = req.body
    if (!email || !password) {
        return next(CustomError.allFieldAreRequired('all field are required '))
    }

    let user = await Users.findOne({ where: { email: req.body.email }, logging: false })
        .catch(err => { return next(err) })

    if (user === null) {
        return next(CustomError.alreadyExist("user is not present from data base!"))
    }

    let checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
        return next(CustomError.passwordNotMatch("email or password is incorrect !"))
    }
    let token = jwt.sign({ userId: user.id }, jwt_Secret_Key)
    // sending emsail to user 
    // emailTextSender(user.email, "singup is complete you are logged ")
    return res.status(200).cookie("jwt", token).send({ status: 'success', Token: token })
}


control.changePassword = async (req, res, next) => {
    let { password, confirmPassword } = req.body
    if (password && confirmPassword) {
        if (password === confirmPassword) {
            try {
                let salt = await bcrypt.genSalt(11)
                let newPassword = await bcrypt.hash(password, salt)
                let user = await Users.update({ password: newPassword }, { where: { id: req.user.id }, logging: false })
                // Email sending 
                // emailTextSender(req.user.email, "your Password is change successfully ")
                return res.status(200).send({ status: "success", message: "data is updated ", result: user })
            } catch (error) {
                return next(error)
            }
        } else {
            return next(CustomError.passwordNotMatch("email or password is incorrect !"))
        }
    }
    else {
        return next(CustomError.allFieldAreRequired('all field are required '))
    }
}
control.sendUserPasswordResetEmail = async (req, res, next) => {
    const { email } = req.body
    if (email) {
        const user = await Users.findOne({ where: { email: email }, logging: false }).catch(error => { return next(error) })
        if (user) {
            const secret = user.id + jwt_Secret_Key
            const token = jwt.sign({ userID: user._id }, secret)
            const link = `http://127.0.0.1:5000/reset/${user._id}/${token}`
            console.log(link)
            // // Send Email
            // let info = await transporter.sendMail({
            //   from: process.env.EMAIL_FROM,
            //   to: user.email,
            //   subject: "GeekShop - Password Reset Link",
            //   html: `<a href=${link}>Click Here</a> to Reset Your Password`
            // })
            emailTextSender(link)
            res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
        } else {
            return next(CustomError.alreadyExist("user is not present !"))
        }
    } else {
        return next(CustomError.allFieldAreRequired('all field are required '))
    }
}
control.resetPassword = async (req, res, next) => {
    let { password, confirmPassword } = req.body
    let { id, token } = req.params
    let user = await Users.findOne({ where: { id: id }, logging: false })
    let secret = user.id + token
    try {
        jwt.verify(token, secret)
        if (password && confirmPassword) {
            if (password === confirmPassword) {
                let salt = await bcrypt.genSalt(11)
                let newHashPassword = await bcrypt.hash(password, salt)
                let data = await Users.update({ password: newHashPassword }, { where: { id: user.id }, logging: false })
                return res.send({ status: "success", message: "password is updated ", data })
            } else {
                return next(CustomError.passwordNotMatch(" password is incorrect !"))
            }
        } else {
            return next(CustomError.allFieldAreRequired('all field are required '))
        }
    } catch (error) {
        return next(error)
    }
}

control.deleteAccount = async (req, res, next) => {
    try {
        let user = await Users.destroy({ where: { id: req.user.id }, logging: false })
        // emailTextSender(req.user.email, "your account is deleted")
        return res.status(200).send({ status: "sucess", message: "Account deleted", result: user })
    } catch (error) {
        return next(error)
    }
}


module.exports = control