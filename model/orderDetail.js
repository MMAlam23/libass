const { Sequelize, DataTypes, Model, sequelize, QueryTypes } = require('../config/dbConnection')

class OrderDetail extends Model { }

OrderDetail.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        primaryKey: true
    },
    OrderId: {
        type: DataTypes.INTEGER,
        reference: {
            model: "Order",
            key: "id",
        },
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        reference: {
            model: "Product",
            key: "id",
        },
        allowNull: false
    },
    productPrice: {
        type: DataTypes.INTEGER,
        // allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "OrderDetail",
    tableName: "OrderDetails",
})

// OrderDetail.sync({ force: true }).then(_ => console.log("tables Created")).catch(err => console.log(err))
module.exports = { OrderDetail }