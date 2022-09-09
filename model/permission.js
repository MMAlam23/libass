const { Sequelize, DataTypes, Model, sequelize } = require('../config/dbConnection')

class Permission extends Model { }
Permission.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Permission',
    tableName: 'user_permission'
})
module.exports = { Users }