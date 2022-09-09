const { Sequelize, DataTypes, Model, sequelize } = require('../config/dbConnection')

class category extends Model { }

category.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    modelName: "category",
    tableName: "category",
    sequelize
})
//  to check the data base is connected or not if table is not present sync method create a table

// category.sync({force:false}).then(()=> console.log('connect CAtegory ')).catch(er=> console.log(er))

module.exports = { category }