const { DataTypes } = require('sequelize');
const sequelize = require('../services/db');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    price: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'products',
    timestamps: false, 
    underscored: false
});

module.exports = Product;
