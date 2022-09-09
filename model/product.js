const { Sequelize, DataTypes, Model, sequelize, QueryTypes } = require('../config/dbConnection')
const joi = require('joi')

class Product extends Model { }

Product.init({
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
        allowNull: [false, "userId Not be empty !"]
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: [false, "gender is null enter your gender "]
    },
    size: {
        type: DataTypes.STRING,
        allowNull: [false, "Pls Enter Size"]
    },
    MRP: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Discount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Product",
    tableName: "product"
})
//  sequelize.query("select * from product",{type:QueryTypes.SELECT,logging:false}).then(i => console.log(i)).catch(err=> console.log({some_erro:err}))

// Product.sync({ force: true }).then(() => console.log('database is connect')).catch(err => console.log(err))

let addJoi = (req) => {
    let Schema = joi.object({
        name: joi.string().min(1).required(),
        description: joi.string().min(1).required(),
        color: joi.string().min(1).required(),
        stock: joi.number().required(),
        gender: joi.string().required(),
        type: joi.string().required(),
        size: joi.string().required(),
        MRP: joi.number().required(),
        Discount: joi.number().required()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

let updateJoi = (req = null) => {
    if (req == null) {
        return false
    }
    let Schema = joi.object({
        name: joi.string().min(1),
        color: joi.string().min(1),
        stock: joi.number(),
        gender: joi.string(),
        type: joi.string(),
        description: joi.string(),
        size: joi.string(),
        MRP: joi.number(),
        Discount: joi.number()
    })
    let { error } = Schema.validate(req, { abortEarly: false })
    if (error) {
        return msg
    }
    return false
}


module.exports = { Product, updateJoi, addJoi }