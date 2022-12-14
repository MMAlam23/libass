const { Users, updateAdminJoi } = require('../model')
const CustomError = require('../services/CustomError')
const { UserValidate } = require('../model/joiUser')
const bcrypt = require('bcrypt')
const asyncError = require('../middleware/asyncError')


const control = {}

control.profile = async (req, res, next) => {
    if (!req.user) {
        return next(CustomError.unAuthorize())
    }
    try {
        let user = await Users.findOne({ where: { id: req.user.id } }).catch(err => { return next(err) })
        return res.status(200).send({ profile: user })
    } catch (error) {
        return next(error)
    }
}

control.viewAllUser = async (req, res, next) => {
    if (!req.user || !req.user.admin || req.user.admin !== "admin") {
        return next(CustomError.unAuthorize())
    }
    try {
        let user = await Users.findAll({ logging: false })
            .catch(err => { return next(err) })
        return res.status(200).send({ status: "sucess", user })
    } catch (error) {
        return next(error)
    }
}
control.createUser = async (req, res, next) => {
    if (!req.user || !req.user.admin || req.user.admin !== "admin") {
        return next(CustomError.unAuthorize())
    }
    let valid = UserValidate(req.body)
    if (valid) {
        return next(valid)
    }
    let { email, password, username, address, contact } = req.body
    try {
        //  checking user is present or not in data bases 
        let checkUser = await Users.findOne({ where: { email }, logging: false })
            .catch(err => { return next(err) })
        if (checkUser !== null) {
            return next(CustomError.alreadyExist())
        }
        //  hasing password 
        let salt = await bcrypt.genSalt(11)
        let hashPassword = await bcrypt.hash(password, salt)
        // Creating user 
        await Users.create({
            email, password: hashPassword, username, address, contact
        }, { logging: false })
        return res.redirect('/viewUser')
    } catch (error) {
        return next(error)
    }
}
control.updateUser = async (req, res, next) => {
    if (!req.user || !req.user.admin || req.user.admin !== "admin") {
        return next(CustomError.unAuthorize())
    }
    let valid = updateAdminJoi(req.body)
    if (valid) {
        return next(valid)
    }
    let { id, email, password, username, address, contact, admin } = req.body
    try {
        // checking user is present or not 
        let checkUser = await Users.findOne({ where: { id }, logging: false })
            .catch(err => { return next(err) })
        if (checkUser == null) {
            return next(CustomError.alreadyExist("User is Not Exit !"))
        }
        // hasing password if password is present 
        if (password) {
            let salt = await bcrypt.genSalt(11)
            let hashPassword = await bcrypt.hash(password, salt)
            password = hashPassword
        }
        // updating User information 
        await Users.update({ email, password, username, address, contact, admin }, { where: { id }, logging: false })
        //  redirect to viewAll user page 
        return res.redirect('/viewUser')
    } catch (error) {
        return next(error)
    }
}
control.deleteUser = async (req, res, next) => {
    if (!req.user || !req.user.admin || req.user.admin !== "admin") {
        return next(CustomError.unAuthorize())
    }
    let { id } = req.body
    try {
        let checkUser = await Users.findOne({ where: { id }, logging: false })
            .catch(err => { return next(err) })
        if (checkUser == null) {
            return next(CustomError.alreadyExist("User is Not Exit !"))
        }
        let user = await Users.destroy({ where: { id }, logging: false })
        return res.send("Count " + user)
    } catch (error) {
        return next(error)
    }
}



module.exports = control