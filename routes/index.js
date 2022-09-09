const express = require('express')
const router = express()
const routers = require('./routers')
const publicRouter = require('./publicRouter')

router.use(routers)
router.use(publicRouter)

module.exports = router