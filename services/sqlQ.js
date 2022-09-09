const { QueryTypes } = require('sequelize')
const { sequelize } = require('../config/dbConnection')

sequelize.query(`select * from product`, { type: QueryTypes.SELECT, logging: false }).then(i => console.log(i)).catch(err => console.log(err))