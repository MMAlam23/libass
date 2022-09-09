const { Order, OrderDetail, Product, addJoiOrder } = require('../model')
let { QueryTypes, DataTypes, or } = require('sequelize')
const CustomError = require('../services/CustomError')

const control = {}

// control.viewOrder = async (req, res, next) => {
//     if (!req.user) {
//         return next(CustomError.unAuthorize())
//     }
//     try {
//         let order = await OrderDetail.findByPk(req.params.id, { include: 'orders' }, { logging: false })
//             .catch(err => { return next(err) })
//         let orderDetail = await OrderDetail.findAll({ logging: false }).catch(err => { return next(err) })
//         return res.status(200).send({ order, orderDetail })
//     } catch (error) {
//         return next(error)
//     }
// }

control.viewOrder = async (req, res, next) => {
    if (!req.user) {
        return next(CustomError.unAuthorize())
    }
    try {
        let orderinfo = await Order.sequelize.query("select * from orderdetails left join orders on  OrderId= orders.id ", { type: QueryTypes.SELECT, logging: false })
            .catch(err => { return next(err) })
        console.log(orderinfo.id)
        return res.status(200).send(orderinfo)
    } catch (error) {
        return next(error)
    }
}


control.addOrder = async (req, res, next) => {
    if (!req.user) {
        return next(CustomError.unAuthorize())
    }
    if (!req.params.id) {
        return next(CustomError.params("No Product Found"))
    }
    let product = await Product.findOne({ where: { id: req.params.id }, logging: false })
        .catch(err => { return next(err) })
    if (product.stock == 0) {
        return res.status(200).send({ message: "Product is Out Of Stock" })
    }
    let valid = addJoiOrder(req.body)
    if (valid) {
        return next(valid)
    }
    //  req Object destructuring
    let { ammount, shipping_address, shipping_contact, shipping_email, productPrice, quantity } = req.body

    try {
        let order = await Order.create({
            userId: req.user.id,
            ammount,
            shipping_address, shipping_contact, shipping_email
        }, { logging: true }).catch(err => { return next(err) })
        //  Adding Data is Order Detail tabels
        await OrderDetail.create({
            OrderId: order.id,
            productId: req.params.id,
            productPrice: productPrice,
            quantity: quantity
        }, { logging: false }).catch(err => { return next(err) })
        //  saving Product stock
        product.stock -= quantity
        await product.save()

        return res.status(200).redirect('/viewOrder')
    } catch (error) {
        return next(error)
    }
}

//  Under Testing 
control.cancleOrder = async (req, res, next) => {
    if (!req.user) {
        return next(CustomError.unAuthorize())
    }
    if (!req.params.pid || !req.params.OrderId) {
        return next(CustomError.params("No Product Found"))
    }
    try {
        //  finding product 
        let product = await Product.findOne({ where: { id: req.params.pid }, logging: false })
            .catch(err => { return next(err) })

        if (!product) { return next(CustomError.params("No Product Found")) }
        // Checking order id 
        let order = await Order.findOne({ where: { id: req.params.OrderId }, logging: false })
            .catch(err => { return next(err) })

        //  Checking Orderid and Quantity 
        let orderDetail = await OrderDetail.findOne({ where: { OrderId: order.id }, logging: false })
            .catch(err => { return next(err) })

        // Updating Status 
        await Order.update({ shipping_status: "Cancle" }, { where: { id: req.params.OrderId }, logging: false }).catch(err => { return next(err) })

        //  updating Product Stock 
        product.stock += orderDetail.quantity
        await product.save()

        return res.send({ order: order })
    } catch (error) {
        return next(error)
    }
}

module.exports = control