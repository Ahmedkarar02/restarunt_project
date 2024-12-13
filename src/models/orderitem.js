'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
      OrderItem.belongsTo(models.Menu, { foreignKey: 'menuId' });
    }
  }
  OrderItem.init(
    {
      orderId: { type: DataTypes.INTEGER, allowNull: false,references: {
        model: 'orders', // Ensure this points to the correct table name
        key: 'id', // Primary key of the Menu model
      }  },
      menuId: { type: DataTypes.INTEGER, allowNull: false,references: {
        model: 'Menus', // Ensure this points to the correct table name
        key: 'id', // Primary key of the Menu model
      } },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    {
      sequelize,
      modelName: 'OrderItem',
    }
  );
  return OrderItem;
};
