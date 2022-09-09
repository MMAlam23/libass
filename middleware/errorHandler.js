const { ValidationError } = require('joi')
const CustomError = require('../services/CustomError')
require('dotenv').config()
const { DebugMod } = process.env

// Globel ErrorHandler 
const errorhandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: "Error from server",
        ...(DebugMod === "true" && { originalError: err.message })
    }

    if (err instanceof ValidationError) {
        statusCode = 412
        data.message = err.message
    }

    if (err instanceof CustomError) {
        statusCode = err.status,
            data.message = err.message
    }

    return res.status(statusCode).send(data)
}

module.exports = errorhandler