const { Sequelize, DataTypes, Model, sequelize } = require('../config/dbConnection')
const joi = require('joi')
class Users extends Model { }
Users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contact: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    admin: {
        type: DataTypes.STRING,
        defaultValue: "customer"
    }
}, {
    modelName: 'Users',
    tableName: 'user',
    sequelize
})
// Users.sync({force:true}).then(_=> console.log('workingn')).catch(err=> console.log({err}))

let updateAdminJoi = (param) => {
    const schema = joi.object(
        {
            id: joi.number(),
            email: joi.string().email().min(3).trim(),
            password: joi.string().min(1).trim(),
            username: joi.string().min(3).trim(),
            contact: joi.number().min(1),
            address: joi.string().min(5).trim(),
            admin: joi.string().min(1).default("customer")
        }
    )
    let { error } = schema.validate(param, { abortEarly: false })
    if (error) {
        return error
    }
    return false
}

module.exports = { Users, updateAdminJoi }