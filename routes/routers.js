const express = require('express')
const router = express.Router()
const logger = require('../controller/logger')
const auth = require('../middleware/auth')
const product = require('../controller/productController')
const userController = require('../controller/userController')
const orderController = require('../controller/orderController')

// loging Routing 
router
    .post('/singup', logger.register)
    .post('/login', logger.login)
    .put('/changepassword', auth, logger.changePassword)
    .delete('/accountDelete', auth, logger.deleteAccount)
    .post('/forget', logger.sendUserPasswordResetEmail)
    .post('/reset/:id/:token', logger.resetPassword)

// USER Controllers and routing 

router
    .get('/profile', auth, userController.profile)
    .get('/viewUser', auth, userController.viewAllUser)
    .post('/viewUser', auth, userController.createUser)
    .put('/viewUser', auth, userController.updateUser)
    .delete('/viewUser', auth, userController.deleteUser)

//  product Routing with auth 

router
    .get('/product', product.viewProduct)
    .post('/product', auth, product.addProduct)
    .put('/product/:id', auth, product.updateProduct)
    .delete('/product/:id', auth, product.deleteProduct)
// Order Routing 
router
    .get('/viewOrder', auth, orderController.viewOrder)
    .post('/addOrder/:id', auth, orderController.addOrder)
    .put('/addOrder/:pid/:OrderId', auth, orderController.cancleOrder)

module.exports = router