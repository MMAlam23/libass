const { Sequelize, DataTypes, Model, sequelize, QueryTypes } = require('../config/dbConnection')
const joi = require('joi')
class Order extends Model { }

Order.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        reference: {
            model: "Users",
            key: "id",
        },
        allowNull: false
    },
    ammount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    shipping_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shipping_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shipping_contact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    shipping_status: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    createdAt: "Order_Date"
})

// Order.sync({ force: true }).then(_ => console.log("tables Created")).catch(err => console.log(err))

let addJoiOrder = (req) => {
    let OrderSchema = joi.object({
        ammount: joi.number().min(1).required(),
        shipping_contact: joi.number().min(1).required(),
        shipping_address: joi.string().min(1).required(),
        shipping_email: joi.string().email().min(1).required(),
        shipping_status: joi.string(),
        productPrice: joi.number().required(),
        quantity: joi.number().required()
    })
    let { error } = OrderSchema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = { Order, addJoiOrder }