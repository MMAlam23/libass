const express = require("express")
const sequelize = require("sequelize")
const errorhandler = require('./middleware/errorHandler')
const router = require('./routes')
require('dotenv').config()
require('express-async-errors')
const cors = require('cors')
let ejs = require('ejs')
const app = express()
let port = process.env.PORT || 6000

// uncaughtException Error Handler
process.on('uncaughtException', err => {
    console.log(`Error`, err)
    console.log("server Shut down due to uncaughtException")
    process.exit(1)
})

app.use(cors())
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')

//  App Config 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//  routing 
app.use(router)

// Error handler Middleware
app.use(errorhandler)
let server = app.listen(port, () => console.log(`server is live ${port}!`))

//  unhandled Promise Rejection Error handler 
process.on('unhandledRejection', err => {
    console.log(`error:${err.message}`)
    console.log('Server Shutdown due to unhandled Promise Rejection ')
    server.close(() => {
        process.exit(1)
    })
})