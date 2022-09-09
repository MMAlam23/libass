const router = require('express').Router()
const product = require('../controller/productController')

router.get('/', product.viewProductEjs)

router.get('/singup', (req, res) => {
    res.render('singup')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/contact', (req, res) => {
    res.render('contact')
})

router.get('/about', (req, res) => {
    res.render('about')
})

router.get('/aadProduct', (req, res) => {
    res.render('productRegister')
})

module.exports = router
