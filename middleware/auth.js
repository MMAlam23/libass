const jwt = require('jsonwebtoken')
const { Users } = require('../model')
require('dotenv').config()
let { jwt_Secret_Key } = process.env

let auth = async (req, res, next) => {
    let token
    const { authorization } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            // verifying token
            let { userId } = jwt.verify(token, jwt_Secret_Key)
            req.user = await Users.findOne({ where: { id: userId }, logging: false })
            next()
        } catch (error) {
            return next(error)
        }
    } else {
        return res.send('token is invalid ')
    }
    if (!token) {
        return res.send('token is not availabel')
    }
}

module.exports = auth