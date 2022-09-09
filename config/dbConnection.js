const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize')
require('dotenv').config()
let { DB_CONNECTION } = process.env

const sequelize = new Sequelize(DB_CONNECTION)
// sequelize.authenticate().then(() => console.log('connect')).catch((err) => console.log(err))

module.exports = {
    Sequelize, DataTypes, Model, sequelize, QueryTypes
}