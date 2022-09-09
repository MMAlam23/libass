const { category } = require('./category')
const { Order, addJoiOrder } = require('./order')
const { OrderDetail } = require('./orderDetail')
const { Product, addJoi, updateJoi } = require('./product')
const { Users,updateAdminJoi } = require('./user')

module.exports = { category, Order, OrderDetail, Product, Users, addJoi, updateJoi ,addJoiOrder,updateAdminJoi}